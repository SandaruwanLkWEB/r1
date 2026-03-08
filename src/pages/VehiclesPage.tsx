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

export function VehiclesPage() {
  const { data, reload } = useFetch<any[]>('/vehicles', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ registrationNo: '', type: '', capacity: '' });

  return (
    <div>
      <PageHeader title="Vehicles" subtitle="Operational vehicle fleet records with capacity control." action={<Button onClick={() => setOpen(true)}>Add New</Button>} />
      <Card>
        <Table
          columns={['Registration', 'Type', 'Capacity', 'Active']}
          rows={(data || []).map((item) => [String(item.registrationNo ?? '-'), String(item.type ?? '-'), String(item.capacity ?? '-'), String(item.isActive)])}
        />
      </Card>
      <Modal open={open} title="Create Vehicle" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-medium">Registration</label><Input value={form.registrationNo} onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Type</label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Capacity</label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await api.post('/vehicles', { ...form, capacity: Number(form.capacity) });
              toast.success('Vehicle saved');
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
