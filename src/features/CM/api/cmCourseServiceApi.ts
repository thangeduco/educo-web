// src/features/CM/api/cmCourseServiceApi.ts

import apiEducoreBE from '../../../services/apiService';
import type { CMCourseDto } from '../model/CMCourseDto';

/**
 * Endpoint backend CM:
 * GET /cm/courses/:courseCode/week-detail/public
 * Router backend:
 *   router.get(
 *     '/courses/:courseCode/week-detail/public',
 *     (req, res) =>
 *       cmCourseWeekDetailController.getCourseWeekDetailForPublicView(req, res)
 *   );
 */
const CM_COURSE_WEEK_DETAIL_PUBLIC_ENDPOINT = (courseCode: string) =>
  `/cm/courses/${courseCode}/week-detail/public`;

/**
 * Gọi API GET /cm/courses/:courseCode/week-detail/public
 * Trả về CourseWeekDetailResponseDto (alias: CMCourseDto)
 */
export const getCourseByCodeApi = async (
  courseCode: string
): Promise<CMCourseDto> => {
  try {
    if (!courseCode) {
      throw new Error('courseCode is required');
    }

    const response = await apiEducoreBE.get(
      CM_COURSE_WEEK_DETAIL_PUBLIC_ENDPOINT(courseCode)
    );

    // Backend trả trực tiếp DTO, không bọc success/data
    const data = response.data ?? response.data;

    return data as CMCourseDto;
  } catch (error: any) {
    console.error(
      '[getCourseByCodeApi] ❌ Lỗi khi lấy chi tiết khoá học (week-detail/public):',
      error?.response?.data || error
    );
    throw error;
  }
};
