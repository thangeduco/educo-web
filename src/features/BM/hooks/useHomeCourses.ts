// src/features/BM/hooks/useHomeCourse.ts
import { useEffect, useState } from 'react';
import { fetchHomeCoursesApi } from '../api/homePageParamsApi';
import {
  HomePageCoursesDto,
  HomePageCourseItemDto,
} from '../model/home-page-param.dto';

type UseHomeCoursesResult = {
  courses: HomePageCoursesDto;
  loading: boolean;
  error: string | null;
};

export function useHomeCourses(): UseHomeCoursesResult {
  const [courses, setCourses] = useState<HomePageCoursesDto>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);

        const data = await fetchHomeCoursesApi(); // Promise<HomePageCoursesDto>

        if (!isMounted) return;

        // Sort đúng theo display_order
        const sorted = [...data].sort(
          (a: HomePageCourseItemDto, b: HomePageCourseItemDto) =>
            (a.display_order ?? 0) - (b.display_order ?? 0)
        );

        setCourses(sorted);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Có lỗi xảy ra khi tải danh sách khoá học.');
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
    courses,
    loading,
    error,
  };
}
