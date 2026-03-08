import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { menuItems } from '../../lib/menu';
import { useAuth } from '../../store/auth';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const menu = useMemo(
    () => menuItems.filter((item) => user && item.roles.includes(user.role)),
    [user],
  );

  return (
    <div className="flex min-h-full bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <Link to="/" className="mb-8 rounded-3xl bg-gradient-to-r from-brand-600 to-slate-900 px-5 py-4 text-white shadow-soft">
          <div className="text-xs uppercase tracking-[0.28em] text-white/80">Enterprise TMS</div>
          <div className="mt-2 text-2xl font-bold">Transport Management</div>
        </Link>
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-full flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Logged in as</div>
              <div className="font-semibold">{user?.fullName}</div>
              <div className="text-sm text-slate-500">{user?.role}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDark((value) => !value)} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800">
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <button onClick={() => navigate('/notifications')} className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800">
                <Bell className="size-4" />
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
