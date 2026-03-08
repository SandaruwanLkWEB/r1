import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { Role } from '../types';

export function ProtectedRoute({
  roles,
  children,
}: {
  roles?: Role[];
  children: JSX.Element;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
