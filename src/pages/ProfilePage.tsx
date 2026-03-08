import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ProfilePage() {
  const [profile, setProfile] = useState<any>({ fullName: '', email: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    api.get('/profile/me').then((response) => {
      setProfile({ fullName: response.data.fullName, email: response.data.email });
    });
  }, []);

  return (
    <div>
      <PageHeader title="Profile & Security" subtitle="All roles can change their own name, email, and password. Employee number stays locked." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 text-lg font-semibold">Profile details</div>
          <div className="space-y-4">
            <div><label className="mb-2 block text-sm font-medium">Full Name</label><Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} /></div>
            <div><label className="mb-2 block text-sm font-medium">Email</label><Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
            <Button onClick={async () => {
              try {
                await api.patch('/profile/me', profile);
                toast.success('Profile updated');
              } catch (error: any) {
                toast.error(error?.response?.data?.error?.message || 'Profile update failed');
              }
            }}>Save profile</Button>
          </div>
        </Card>

        <Card>
          <div className="mb-4 text-lg font-semibold">Change password</div>
          <div className="space-y-4">
            <div><label className="mb-2 block text-sm font-medium">Current Password</label><Input type="password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} /></div>
            <div><label className="mb-2 block text-sm font-medium">New Password</label><Input type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /></div>
            <Button onClick={async () => {
              try {
                await api.post('/profile/change-password', password);
                toast.success('Password changed');
                setPassword({ currentPassword: '', newPassword: '' });
              } catch (error: any) {
                toast.error(error?.response?.data?.error?.message || 'Password change failed');
              }
            }}>Update password</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
