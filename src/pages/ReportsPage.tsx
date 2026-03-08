import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { useFetch } from '../hooks/useFetch';

export function ReportsPage() {
  const [requestId, setRequestId] = useState('');
  const routeWise = useFetch<any[]>(requestId ? `/reports/route-wise?requestId=${requestId}` : '/reports/route-wise', [requestId]);
  const vehicleWise = useFetch<any[]>(requestId ? `/reports/vehicle-wise?requestId=${requestId}` : '/reports/vehicle-wise', [requestId]);
  const departmentSummary = useFetch<any[]>('/reports/department-summary', []);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Printable operational views based on generated groups and approval-safe snapshots." />
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px]">
            <label className="mb-2 block text-sm font-medium">Optional request ID filter</label>
            <Input value={requestId} onChange={(e) => setRequestId(e.target.value)} placeholder="Enter request ID" />
          </div>
          <Button onClick={() => window.print()}>Print A4</Button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <div className="mb-4 text-lg font-semibold">Route-wise report</div>
          <Table
            columns={['Route', 'Group', 'Vehicle', 'Driver', 'Employee Count']}
            rows={(routeWise.data || []).map((item) => [
              String(item.route?.name ?? '-'),
              String(item.groupName ?? '-'),
              String(item.assignedVehicle?.registrationNo ?? '-'),
              String(item.assignedDriver?.fullName ?? '-'),
              String(item.employeeCount ?? 0),
            ])}
          />
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold">Vehicle-wise report</div>
          <Table
            columns={['Vehicle', 'Driver', 'Group', 'Route', 'Members']}
            rows={(vehicleWise.data || []).map((item) => [
              String(item.assignedVehicle?.registrationNo ?? '-'),
              String(item.assignedDriver?.fullName ?? '-'),
              String(item.groupName ?? '-'),
              String(item.route?.name ?? '-'),
              String(item.employeeCount ?? 0),
            ])}
          />
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold">Department summary</div>
          <Table
            columns={['Department', 'Total Employees', 'Total Requests', 'Approved Requests', 'Pending Requests']}
            rows={(departmentSummary.data || []).map((item) => [
              String(item.departmentName ?? '-'),
              String(item.totalEmployees ?? 0),
              String(item.totalRequests ?? 0),
              String(item.approvedRequests ?? 0),
              String(item.pendingRequests ?? 0),
            ])}
          />
        </Card>
      </div>
    </div>
  );
}
