import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { useFetch } from '../hooks/useFetch';

export function GroupsPage() {
  const { data: requests } = useFetch<any[]>('/transport-requests', []);
  const { data: vehicles } = useFetch<any[]>('/vehicles', []);
  const { data: drivers } = useFetch<any[]>('/drivers', []);
  const [requestId, setRequestId] = useState('');
  const [runs, setRuns] = useState<any[]>([]);

  async function loadRuns(id: string) {
    if (!id) {
      setRuns([]);
      return;
    }
    try {
      const response = await api.get(`/grouping/request/${id}/runs`);
      setRuns(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Failed to load grouping runs');
      setRuns([]);
    }
  }

  useEffect(() => {
    loadRuns(requestId);
  }, [requestId]);

  async function generate() {
    if (!requestId) return toast.error('Select request id first');
    try {
      await api.post(`/grouping/request/${requestId}/generate`);
      toast.success('Grouping snapshot generated');
      loadRuns(requestId);
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Generation failed');
    }
  }

  async function assign(groupId: string) {
    const vehicleId = prompt('Enter vehicle ID from vehicle table');
    if (!vehicleId) return;
    const driverId = prompt('Enter driver ID if needed');
    try {
      await api.post(`/grouping/groups/${groupId}/assign`, { vehicleId, driverId: driverId || undefined });
      toast.success('Group assigned');
      loadRuns(requestId);
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Assignment failed');
    }
  }

  const groups = runs.flatMap((run) => run.groups || []);

  return (
    <div>
      <PageHeader title="Generated Groups" subtitle="Stable grouping snapshots saved per request run for audit-safe reporting." />
      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-medium">Request ID</label>
            <Input list="request-list" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
            <datalist id="request-list">
              {(requests || []).map((item) => (
                <option key={item.id} value={item.id}>{item.requestCode}</option>
              ))}
            </datalist>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={generate}>Generate Snapshot</Button>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500">Vehicle IDs available: {(vehicles || []).map((v) => v.id).join(', ') || '-'} | Driver IDs: {(drivers || []).map((d) => d.id).join(', ') || '-'}</div>
      </Card>
      <Card>
        <Table
          columns={['Group Code', 'Group Name', 'Route', 'Members', 'Vehicle', 'Driver', 'Status', 'Actions']}
          rows={groups.map((group) => [
            String(group.groupCode ?? '-'),
            String(group.groupName ?? '-'),
            String(group.route?.name ?? '-'),
            String(group.employeeCount ?? 0),
            String(group.assignedVehicle?.registrationNo ?? '-'),
            String(group.assignedDriver?.fullName ?? '-'),
            String(group.status ?? '-'),
            <Button onClick={() => assign(group.id)}>Assign</Button>,
          ])}
        />
      </Card>
    </div>
  );
}
