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

export function PlacesPage() {
  const { data, reload } = useFetch<any[]>('/places', []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ placeId: '', title: '', address: '', latitude: '', longitude: '' });

  return (
    <div>
      <PageHeader title="Places" subtitle="Searchable place records with coordinates for grouping." action={<Button onClick={() => setOpen(true)}>Add New</Button>} />
      <Card>
        <Table
          columns={['Place ID', 'Title', 'Address', 'Lat', 'Lng']}
          rows={(data || []).map((item) => [String(item.placeId ?? '-'), String(item.title ?? '-'), String(item.address ?? '-'), String(item.latitude ?? '-'), String(item.longitude ?? '-')])}
        />
      </Card>
      <Modal open={open} title="Create Place" onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm font-medium">Place ID</label><Input value={form.placeId} onChange={(e) => setForm({ ...form, placeId: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Title</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Address</label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Latitude</label><Input type="number" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></div>
          <div><label className="mb-2 block text-sm font-medium">Longitude</label><Input type="number" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await api.post('/places', { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) });
              toast.success('Place saved');
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
