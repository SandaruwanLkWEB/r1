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

export function EmployeesPage() {
  const { data, reload } = useFetch<any[]>('/employees', []);
  const { data: departments } = useFetch<any[]>('/departments', []);
  const { data: routes } = useFetch<any[]>('/routes', []);
  const { data: places } = useFetch<any[]>('/places', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    empNo: '',
    fullName: '',
    departmentId: '',
    phone: '',
    email: '',
    placeId: '',
    preferredRouteId: '',
    accountPassword: 'Demo@123',
  });

  return (
    <div>
      <PageHeader title="Employees" subtitle="Department-controlled employee records with route and place preferences." action={<Button onClick={() => setOpen(true)}>Add Employee</Button>} />
      <Card>
        <Table
          columns={['Emp No', 'Full Name', 'Department', 'Phone', 'Email', 'Place', 'Preferred Route', 'Pending Approval']}
          rows={(data || []).map((item) => [
            String(item.empNo ?? '-'),
            String(item.fullName ?? '-'),
            String(item.department?.name ?? '-'),
            String(item.phone ?? '-'),
            String(item.email ?? '-'),
            String(item.place?.title ?? '-'),
            String(item.preferredRoute?.name ?? '-'),
            String(item.isPendingDepartmentApproval ?? false),
          ])}
        />
      </Card>

      <Modal open={open} title="Create Employee" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-medium">Emp No</label><Input value={form.empNo} onChange={(e) => setForm({ ...form, empNo: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Full Name</label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Department ID</label><Input list="departments-list" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} /><datalist id="departments-list">{(departments || []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</datalist></div>
          <div><label className="mb-2 block text-sm font-medium">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Email</label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Account Password</label><Input value={form.accountPassword} onChange={(e) => setForm({ ...form, accountPassword: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Place ID</label><Input list="places-list" value={form.placeId} onChange={(e) => setForm({ ...form, placeId: e.target.value })} /><datalist id="places-list">{(places || []).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</datalist></div>
          <div><label className="mb-2 block text-sm font-medium">Preferred Route ID</label><Input list="routes-list" value={form.preferredRouteId} onChange={(e) => setForm({ ...form, preferredRouteId: e.target.value })} /><datalist id="routes-list">{(routes || []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</datalist></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await api.post('/employees', form);
              toast.success('Employee created');
              setOpen(false);
              reload();
            } catch (error: any) {
              toast.error(error?.response?.data?.error?.message || 'Failed to create employee');
            }
          }}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
