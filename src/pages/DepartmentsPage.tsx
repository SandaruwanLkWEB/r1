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

export function DepartmentsPage() {
  const { data, reload } = useFetch<any[]>('/departments', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ code: '', name: '' });

  return (
    <div>
      <PageHeader title="Departments" subtitle="Manage master department data and operational structure." action={<Button onClick={() => setOpen(true)}>Add New</Button>} />
      <Card>
        <Table
          columns={['Code', 'Name', 'Active']}
          rows={(data || []).map((item) => [String(item.code ?? '-'), String(item.name ?? '-'), String(item.isActive)])}
        />
      </Card>
      <Modal open={open} title="Create Department" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-medium">Code</label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await api.post('/departments', form);
              toast.success('Department saved');
              setOpen(false);
              reload();
            } catch (error: any) {
              toast.error(error?.response?.data?.error?.message || 'Failed to save');
            }
          }}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
