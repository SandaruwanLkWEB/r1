import api from '../lib/api';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useFetch } from '../hooks/useFetch';

export function NotificationsPage() {
  const { data, reload } = useFetch<any[]>('/notifications', []);

  return (
    <div>
      <PageHeader title="Notifications" subtitle="In-app workflow alerts for submissions, approvals, grouping, and capacity issues." />
      <div className="space-y-4">
        {(data || []).map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-slate-500">{item.message}</div>
                <div className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
              {!item.isRead && (
                <Button onClick={async () => {
                  await api.patch(`/notifications/${item.id}/read`);
                  reload();
                }}>
                  Mark read
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
