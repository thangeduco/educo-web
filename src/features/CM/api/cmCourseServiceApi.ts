// src/features/CM/api/cmCourseServiceApi.ts

import apiEducoreBE from '../../../services/apiService';
import type { CMCourseDto } from '../model/CMCourseDto';

/**
 * Endpoint backend CM:
 * GET /cm/courses/:courseCode
 * Router backend:
 *   router.get('/courses/:courseCode', cmCourseController.getCourseByCode);
 */
const CM_COURSE_BY_CODE_ENDPOINT = (courseCode: string) =>
  `/cm/courses/${courseCode}`;

/**
 * Gọi API GET /cm/courses/:courseCode
 * Trả về 1 CMCourseDto (type-safe)
 */
export const getCourseByCodeApi = async (
  courseCode: string
): Promise<CMCourseDto> => {
  try {
    if (!courseCode) {
      throw new Error('courseCode is required');
    }

    const response = await apiEducoreBE.get(
      CM_COURSE_BY_CODE_ENDPOINT(courseCode)
    );

    // Backend style:
    // {
    //   success: true,
    //   data: { ... CMCourseDto ... }
    // }
    const data = response.data?.data ?? response.data;

    return data as CMCourseDto;
  } catch (error: any) {
    console.error(
      '[getCourseByCodeApi] ❌ Lỗi khi lấy thông tin khoá học:',
      error?.response?.data || error
    );
    throw error;
  }
};
