import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { useFetch } from '../hooks/useFetch';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../store/auth';

export function RequestsPage() {
  const { user } = useAuth();
  const { data, reload } = useFetch<any[]>('/transport-requests', []);
  const { data: departments } = useFetch<any[]>('/departments', []);
  const { data: employees } = useFetch<any[]>('/employees', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    requestDate: new Date().toISOString().slice(0, 10),
    departmentId: '',
    notes: '',
    employeeIds: '',
  });

  async function callAction(id: string, path: string, body: any = {}) {
    try {
      await api.post(`/transport-requests/${id}/${path}`, body);
      toast.success('Action completed');
      reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Action failed');
    }
  }

  return (
    <div>
      <PageHeader title="Transport Requests" subtitle="Multi-step department request workflow from draft to HR final approval." action={['HOD', 'ADMIN', 'SUPER_ADMINISTER'].includes(user?.role || '') ? <Button onClick={() => setOpen(true)}>Create Request</Button> : null} />
      <Card>
        <Table
          columns={['Request Code', 'Date', 'Department', 'Status', 'Employees', 'Actions']}
          rows={(data || []).map((item) => [
            String(item.requestCode ?? '-'),
            String(item.requestDate ?? '-'),
            String(item.department?.name ?? '-'),
            <Badge value={String(item.status)} />,
            String(item.employees?.length ?? 0),
            <div className="flex flex-wrap gap-2">
              {item.status === 'DRAFT' && <Button onClick={() => callAction(item.id, 'submit')}>Submit</Button>}
              {['ADMIN', 'SUPER_ADMINISTER'].includes(user?.role || '') && item.status === 'SUBMITTED' && <Button onClick={() => callAction(item.id, 'admin-approve')}>Admin Approve</Button>}
              {['ADMIN', 'SUPER_ADMINISTER'].includes(user?.role || '') && item.status === 'SUBMITTED' && <Button variant="danger" onClick={() => callAction(item.id, 'admin-reject', { comment: 'Rejected from UI' })}>Admin Reject</Button>}
              {user?.role === 'TRANSPORT_AUTHORITY' && ['ADMIN_APPROVED', 'TA_PROCESSING'].includes(item.status) && <Button onClick={() => callAction(item.id, 'ta-processing')}>TA Start</Button>}
              {user?.role === 'TRANSPORT_AUTHORITY' && ['TA_PROCESSING', 'ADMIN_APPROVED'].includes(item.status) && <Button onClick={() => callAction(item.id, 'ta-complete')}>TA Complete</Button>}
              {user?.role === 'HR' && item.status === 'TA_COMPLETED' && <Button onClick={() => callAction(item.id, 'hr-approve')}>HR Approve</Button>}
              {user?.role === 'HR' && item.status === 'TA_COMPLETED' && <Button variant="danger" onClick={() => callAction(item.id, 'hr-reject', { comment: 'Rejected from UI' })}>HR Reject</Button>}
            </div>,
          ])}
        />
      </Card>

      <Modal open={open} title="Create Transport Request" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-medium">Request Date</label><Input type="date" value={form.requestDate} onChange={(e) => setForm({ ...form, requestDate: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Department ID</label><Input list="department-list" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} /><datalist id="department-list">{(departments || []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</datalist></div>
          <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium">Employee IDs (comma separated)</label><Input list="employee-list" value={form.employeeIds} onChange={(e) => setForm({ ...form, employeeIds: e.target.value })} /><datalist id="employee-list">{(employees || []).map((item) => <option key={item.id} value={item.id}>{item.empNo} - {item.fullName}</option>)}</datalist></div>
          <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium">Notes</label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await api.post('/transport-requests', {
                requestDate: form.requestDate,
                departmentId: form.departmentId,
                notes: form.notes,
                employees: form.employeeIds
                  .split(',')
                  .map((value: string) => value.trim())
                  .filter(Boolean)
                  .map((employeeId: string) => ({ employeeId })),
              });
              toast.success('Request created');
              setOpen(false);
              reload();
            } catch (error: any) {
              toast.error(error?.response?.data?.error?.message || 'Failed to create request');
            }
          }}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
