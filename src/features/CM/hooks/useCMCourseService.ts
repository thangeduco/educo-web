// src/features/CM/hooks/useCMCourseService.ts

import { useEffect, useState } from 'react';
import { getCourseByCodeApi } from '../api/cmCourseServiceApi';
import type { CMCourseDto } from '../model/CMCourseDto';

export interface UseCMCourseServiceResult {
  course: CMCourseDto | null;
  loading: boolean;
  error: string | null;
}

/**
 * useCMCourseService
 * Gọi API lấy chi tiết 1 khoá học (week-detail/public) từ backend CM theo courseCode.
 * Endpoint backend:
 *   GET /cm/courses/:courseCode/week-detail/public
 */
export function useCMCourseService(courseCode: string): UseCMCourseServiceResult {
  const [course, setCourse] = useState<CMCourseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;

        // reset state mỗi lần courseCode thay đổi
        setLoading(true);
        setError(null);
        setCourse(null);

        if (!courseCode) {
          setError('courseCode is missing');
          setLoading(false);
          return;
        }

        const data = await getCourseByCodeApi(courseCode);

        if (!isMounted) return;
        setCourse(data);
      } catch (err: any) {
        if (!isMounted) return;
        console.error(
          '[useCMCourseService] ❌ Lỗi khi tải dữ liệu khoá học (week-detail/public):',
          err
        );
        setError(err?.message || 'Lỗi khi tải dữ liệu khoá học.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [courseCode]);

  return {
    course,
    loading,
    error,
  };
}
