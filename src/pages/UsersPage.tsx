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

export function UsersPage() {
  const { data, reload } = useFetch<any[]>('/users', []);
  const [selected, setSelected] = useState<any>(null);

  return (
    <div>
      <PageHeader title="User Control" subtitle="Admin and HR can search users, suspend accounts, change password, and toggle 2FA status." />
      <Card>
        <Table
          columns={['Full Name', 'Email', 'Role', 'Department', 'Active', 'Suspended', '2FA', 'Actions']}
          rows={(data || []).map((item) => [
            String(item.fullName ?? '-'),
            String(item.email ?? '-'),
            String(item.role ?? '-'),
            String(item.department?.name ?? '-'),
            String(item.isActive ?? false),
            String(item.isSuspended ?? false),
            String(item.twoFactorEnabled ?? false),
            <Button onClick={() => setSelected({ ...item, password: '' })}>Manage</Button>,
          ])}
        />
      </Card>

      <Modal open={Boolean(selected)} title="Manage User" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            <div><label className="mb-2 block text-sm font-medium">Full Name</label><Input value={selected.fullName} onChange={(e) => setSelected({ ...selected, fullName: e.target.value })} /></div>
            <div><label className="mb-2 block text-sm font-medium">Email</label><Input value={selected.email} onChange={(e) => setSelected({ ...selected, email: e.target.value })} /></div>
            <div><label className="mb-2 block text-sm font-medium">Manual Password Reset</label><Input type="password" value={selected.password || ''} onChange={(e) => setSelected({ ...selected, password: e.target.value })} /></div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={async () => {
                try {
                  await api.patch(`/users/${selected.id}`, {
                    fullName: selected.fullName,
                    email: selected.email,
                    password: selected.password || undefined,
                  });
                  toast.success('User updated');
                  setSelected(null);
                  reload();
                } catch (error: any) {
                  toast.error(error?.response?.data?.error?.message || 'Update failed');
                }
              }}>Save changes</Button>
              <Button variant="ghost" onClick={async () => {
                await api.patch(`/users/${selected.id}`, { isSuspended: !selected.isSuspended });
                toast.success('Suspension status changed');
                setSelected(null);
                reload();
              }}>{selected.isSuspended ? 'Unsuspend' : 'Suspend'}</Button>
              <Button variant="ghost" onClick={async () => {
                await api.patch(`/users/${selected.id}`, { twoFactorEnabled: !selected.twoFactorEnabled });
                toast.success('2FA updated');
                setSelected(null);
                reload();
              }}>{selected.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
