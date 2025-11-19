// src/features/BM/hooks/useHomeUserGuide.ts

import { useEffect, useState } from 'react';
import { fetchHomeUserGuideApi } from '../api/homePageParamsApi';
import type { HomeUserGuideDto } from '../model/HomeUserGuideDto';

export interface UseHomeUserGuideResult {
  data: HomeUserGuideDto | null;
  loading: boolean;
  error: string | null;
}

export function useHomeUserGuide(): UseHomeUserGuideResult {
  const [data, setData] = useState<HomeUserGuideDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const guide = await fetchHomeUserGuideApi(); // luôn trả HomeUserGuideDto hoặc throw error

        if (!isMounted) return;
        setData(guide);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Có lỗi khi tải hướng dẫn sử dụng.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
