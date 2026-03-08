import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import { AuthUser } from '../types';

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  reloadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('tms_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('tms_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || user) return;
    reloadProfile();
  }, [token]);

  async function login(payload: { email: string; password: string }) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('tms_token', data.token);
      localStorage.setItem('tms_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  async function reloadProfile() {
    if (!localStorage.getItem('tms_token')) return;
    try {
      const { data } = await api.get('/profile/me');
      const currentUser: AuthUser = {
        sub: data.id,
        email: data.email,
        role: data.role,
        departmentId: data.departmentId,
        employeeId: data.employeeId,
        fullName: data.fullName,
      };
      localStorage.setItem('tms_user', JSON.stringify(currentUser));
      setUser(currentUser);
    } catch {
      logout();
    }
  }

  function logout() {
    localStorage.removeItem('tms_token');
    localStorage.removeItem('tms_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout, reloadProfile }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Auth context missing');
  return ctx;
}
