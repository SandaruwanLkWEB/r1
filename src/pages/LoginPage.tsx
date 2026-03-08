import { useForm } from 'react-hook-form';
import { useAuth } from '../store/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>({
    defaultValues: { email: 'admin@company.com', password: 'Demo@123' },
  });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4">
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
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.34em] text-slate-500">Secure access</div>
            <h2 className="mt-3 text-3xl font-bold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use demo accounts from the README or seeded credentials.</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await login(values);
                toast.success('Welcome to Transport Management System');
                navigate('/');
              } catch (error: any) {
                toast.error(error?.response?.data?.error?.message || 'Login failed');
              }
            })}
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input {...register('email')} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <Input type="password" {...register('password')} />
            </div>
            <Button className="w-full py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
