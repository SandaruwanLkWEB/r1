import { useForm } from 'react-hook-form';
import { useAuth } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const demoAccounts = [
  { label: 'Super Administer', email: 'superadmin@company.com', password: 'Demo@123' },
  { label: 'Admin', email: 'admin@company.com', password: 'Demo@123' },
  { label: 'HR', email: 'hr@company.com', password: 'Demo@123' },
  { label: 'Transport Authority', email: 'ta@company.com', password: 'Demo@123' },
  { label: 'HOD', email: 'hod@company.com', password: 'Demo@123' },
  { label: 'Planning', email: 'planning@company.com', password: 'Demo@123' },
  { label: 'Employee', email: 'emp@company.com', password: 'Demo@123' },
];

export function LoginPage() {
  const { register, handleSubmit, setValue, watch } = useForm<{ email: string; password: string }>({
    defaultValues: { email: 'admin@company.com', password: 'Demo@123' },
  });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const values = watch();

  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-soft">
          <div className="text-xs uppercase tracking-[0.34em] text-white/70">2026 Enterprise Workflow</div>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Production-ready staff transport operations platform.</h1>
          <p className="mt-4 max-w-xl text-white/80">
            Manage departments, employees, requests, approvals, auto-grouped route snapshots, vehicle assignments, and printable reports from one secure platform.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {['Audit-safe request workflow', 'Role-based secure access', 'Generated route snapshots', 'Vehicle capacity validation'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 text-sm font-semibold text-white/90">Seeded demo access</div>
            <div className="grid gap-2 md:grid-cols-2">
              {demoAccounts.map((account) => (
                <button
                  type="button"
                  key={account.email}
                  onClick={() => {
                    setValue('email', account.email);
                    setValue('password', account.password);
                    toast.success(`${account.label} credentials loaded`);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm transition hover:bg-white/10"
                >
                  <div className="font-medium">{account.label}</div>
                  <div className="text-white/70">{account.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.34em] text-slate-500">Secure access</div>
            <h2 className="mt-3 text-3xl font-bold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use demo accounts from the seeded credentials, or self-register as an employee.</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (formValues) => {
              try {
                await login({
                  email: formValues.email.trim(),
                  password: formValues.password,
                });
                toast.success('Welcome to Transport Management System');
                navigate('/');
              } catch (error: any) {
                toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || 'Login failed');
              }
            })}
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input autoComplete="email" {...register('email', { required: true })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <Input autoComplete="current-password" type="password" {...register('password', { required: true })} />
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Current payload preview: <span className="font-medium text-slate-700">{values.email || '(empty email)'}</span>
            </div>
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm">
            <div>
              <div className="font-medium text-slate-900">New employee?</div>
              <div className="text-slate-500">Self-register and send your account for HOD approval.</div>
            </div>
            <Link to="/register" className="rounded-2xl bg-slate-900 px-4 py-2 font-medium text-white">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
