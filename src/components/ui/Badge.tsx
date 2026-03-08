import { cn } from '../../lib/utils';

const variants: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-amber-100 text-amber-700',
  ADMIN_APPROVED: 'bg-blue-100 text-blue-700',
  ADMIN_REJECTED: 'bg-rose-100 text-rose-700',
  TA_PROCESSING: 'bg-indigo-100 text-indigo-700',
  TA_COMPLETED: 'bg-cyan-100 text-cyan-700',
  HR_APPROVED: 'bg-emerald-100 text-emerald-700',
  HR_REJECTED: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-slate-100 text-slate-700',
};

export function Badge({ value }: { value: string }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', variants[value] || 'bg-slate-100 text-slate-700')}>
      {value.replace(/_/g, ' ')}
    </span>
  );
}
