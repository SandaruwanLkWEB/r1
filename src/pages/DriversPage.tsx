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

export function DriversPage() {
  const { data, reload } = useFetch<any[]>('/drivers', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ fullName: '', phone: '', licenseNo: '' });

  return (
    <div>
      <PageHeader title="Drivers" subtitle="Maintain driver availability and assignment details." action={<Button onClick={() => setOpen(true)}>Add New</Button>} />
      <Card>
        <Table
          columns={['Full Name', 'Phone', 'License No', 'Active']}
          rows={(data || []).map((item) => [String(item.fullName ?? '-'), String(item.phone ?? '-'), String(item.licenseNo ?? '-'), String(item.isActive)])}
        />
      </Card>
      <Modal open={open} title="Create Driver" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-medium">Full Name</label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">License No</label><Input value={form.licenseNo} onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await api.post('/drivers', form);
              toast.success('Driver saved');
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
