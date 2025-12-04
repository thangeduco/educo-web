// src/features/BM/hooks/useHomeArchievement.ts

import { useEffect, useState } from 'react';
import { fetchHomeArchievementApi } from '../api/homePageParamsApi';
import { HomePageAchievementDto } from '../model/home-page-param.dto';

type UseHomeArchievementResult = {
  achievement: HomePageAchievementDto | null;
  loading: boolean;
  error: string | null;
};

export function useHomeArchievement(): UseHomeArchievementResult {
  const [achievement, setAchievement] = useState<HomePageAchievementDto | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const data = await fetchHomeArchievementApi();

        if (!isMounted) return;

        setAchievement(data || null);
      } catch (err: any) {
        if (!isMounted) return;
        setError(
          err?.message ||
            'Có lỗi xảy ra khi tải thông tin Thành tựu của Educo.'
        );
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

  return {
    achievement,
    loading,
    error,
  };
}
