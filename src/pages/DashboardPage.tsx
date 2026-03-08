import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { useFetch } from '../hooks/useFetch';
import { StatusBarChart } from '../components/charts/StatusBarChart';
import { useAuth } from '../store/auth';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useFetch<any>('/dashboard', []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  if (user?.role === 'EMP') {
    return (
      <div>
        <PageHeader title="Today’s Transport" subtitle="Only the current employee transport information is visible for EMP role." />
        <Card>
          {data?.transport ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div><div className="text-sm text-slate-500">Group</div><div className="text-xl font-semibold">{data.transport.groupName}</div></div>
              <div><div className="text-sm text-slate-500">Route</div><div className="text-xl font-semibold">{data.transport.routeName}</div></div>
              <div><div className="text-sm text-slate-500">Vehicle</div><div className="text-lg font-medium">{data.transport.vehicleRegistration}</div></div>
              <div><div className="text-sm text-slate-500">Driver</div><div className="text-lg font-medium">{data.transport.driverName}</div><div className="text-sm text-slate-500">{data.transport.driverPhone}</div></div>
              <div className="md:col-span-2"><div className="text-sm text-slate-500">Instructions</div><div className="text-base">{data.transport.instructions}</div></div>
            </div>
          ) : (
            <div className="text-slate-500">No transport assignment found for today.</div>
          )}
        </Card>
      </div>
    );
  }

  const cards = [
    ['Departments', data?.totalDepartments],
    ['Places', data?.totalPlaces],
    ['Vehicles', data?.totalVehicles],
    ['Employees', data?.totalEmployees],
    ['Account Requests', data?.totalAccountRequests],
    ['Pending Approvals', data?.pendingApprovals],
    ['Vehicle Capacity', data?.totalVehicleCapacity],
    ['Coverage %', data?.vehicleCoveragePercent],
  ];

  const chartData = Object.entries(data?.requestStatusBreakdown || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Operational overview of the transport workflow and capacity position." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-4 text-3xl font-bold">{value ?? 0}</div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 text-lg font-semibold">Request status trend</div>
          <StatusBarChart data={chartData} />
        </Card>
        <Card>
          <div className="mb-4 text-lg font-semibold">Grouping summary</div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
              <div className="text-sm text-slate-500">Total groups</div>
              <div className="text-2xl font-bold">{data?.groupingSummary?.totalGroups || 0}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
              <div className="text-sm text-slate-500">Assigned groups</div>
              <div className="text-2xl font-bold">{data?.groupingSummary?.assignedGroups || 0}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
              <div className="text-sm text-slate-500">Unassigned groups</div>
              <div className="text-2xl font-bold">{data?.groupingSummary?.unassignedGroups || 0}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
