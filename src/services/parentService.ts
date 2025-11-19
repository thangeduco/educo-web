import {StudentCourseViewForParent} from './dtos/student-course-detail.dto';

import apiEducoreBE from './apiService'; // ✅ Gọi API backend


// === 1. Lấy thông tin chi tiết khoá học cho phụ huynh
export const getStudentCourseStatForParent = async (
  studentId: number,
  courseId: string
): Promise<StudentCourseViewForParent> => {
  await new Promise((r) => setTimeout(r, 300));
  try {
    const response = await apiEducoreBE.get(`/learning/parent-view-stat/students/${studentId}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('[parentService] Lỗi khi gọi getStudentCourseStatForParent:', error);
    throw error;
  }
};
