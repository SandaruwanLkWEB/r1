import { useEffect, useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export function useFetch<T>(url: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await api.get(url);
      setData(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, reload: load };
}
