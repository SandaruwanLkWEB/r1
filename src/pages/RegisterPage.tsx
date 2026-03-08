import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useFetch } from '../hooks/useFetch';

const configuredEndpoint = import.meta.env.VITE_EMP_REGISTER_ENDPOINT as string | undefined;
const endpointCandidates = [configuredEndpoint, '/auth/register-employee', '/auth/register', '/employees/self-register'].filter(Boolean) as string[];

type RegisterPayload = {
  empNo: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  departmentId: string;
  placeId?: string;
  latitude?: string;
  longitude?: string;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { data: departments } = useFetch<any[]>('/departments', []);
  const { data: places } = useFetch<any[]>('/places', []);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch } = useForm<RegisterPayload>();
  const selectedPlaceId = watch('placeId');

  const selectedPlace = useMemo(
    () => (places || []).find((item) => String(item.id) === String(selectedPlaceId || '')),
    [places, selectedPlaceId],
  );

  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-slate-500">Employee self-registration</div>
            <h1 className="mt-3 text-3xl font-bold">Create employee access request</h1>
            <p className="mt-2 text-sm text-slate-500">Submit your employee details. The request will wait for HOD review and activation.</p>
          </div>
          <Link to="/login" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Back to login
          </Link>
        </div>

        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            setSaving(true);
            try {
              const payload = {
                empNo: values.empNo.trim(),
                fullName: values.fullName.trim(),
                email: values.email.trim(),
                password: values.password,
                phone: values.phone.trim(),
                departmentId: values.departmentId,
                placeId: values.placeId || undefined,
                latitude: values.latitude ? Number(values.latitude) : selectedPlace?.latitude ? Number(selectedPlace.latitude) : undefined,
                longitude: values.longitude ? Number(values.longitude) : selectedPlace?.longitude ? Number(selectedPlace.longitude) : undefined,
                role: 'EMP',
              };

              let lastError: any;
              for (const endpoint of endpointCandidates) {
                try {
                  await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, payload);
                  toast.success('Registration submitted for approval');
                  navigate('/login');
                  return;
                } catch (error: any) {
                  if ([404, 405].includes(error?.response?.status)) {
                    lastError = error;
                    continue;
                  }
                  throw error;
                }
              }
              throw lastError || new Error('Registration endpoint is not available');
            } catch (error: any) {
              toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || 'Registration failed');
            } finally {
              setSaving(false);
            }
          })}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">Employee No</label>
            <Input {...register('empNo', { required: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <Input {...register('fullName', { required: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input type="email" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <Input type="password" {...register('password', { required: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Phone</label>
            <Input {...register('phone', { required: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Department</label>
            <Select {...register('departmentId', { required: true })} defaultValue="">
              <option value="" disabled>Select department</option>
              {(departments || []).map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Place</label>
            <Select {...register('placeId')} defaultValue="">
              <option value="">Optional place</option>
              {(places || []).map((item) => (
                <option key={item.id} value={item.id}>{item.name || item.title}</option>
              ))}
            </Select>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            {selectedPlace ? `Selected place coordinates: ${selectedPlace.latitude}, ${selectedPlace.longitude}` : 'You can select a place or enter direct latitude / longitude below.'}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Latitude</label>
            <Input type="number" step="any" {...register('latitude')} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Longitude</label>
            <Input type="number" step="any" {...register('longitude')} />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <Link to="/login" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Cancel</Link>
            <Button type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit registration'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
