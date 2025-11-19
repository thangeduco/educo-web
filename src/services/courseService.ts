// src/services/courseService.ts
import apiEducoreBE from './apiService';

export const getCourseTitle = async (courseId: string): Promise<string> => {
  console.log('[courseService] 🔍 Gọi getCourseTitle cho courseId:', courseId);
  try {
    const course = await getCourseById(courseId);
    return course.title;
  } catch (error: any) {
    console.error('[courseService] ❌ Lỗi khi lấy title khoá học:', error);
    throw new Error(error?.message || 'Không thể lấy tiêu đề khoá học');
  }
};

export const getWeekDetailContents = async (courseId: string) => {
  console.log('[courseService] Gọi API lấy week detail contents của course:', courseId);
  try {
    const res = await apiEducoreBE.get(`/courses/${courseId}/week-detail-contents`);
    return res.data;
  } catch (error: any) {
    console.error('[courseService] Lỗi khi lấy dữ liệu tuần học:', error);
    throw new Error(error?.response?.data?.message || 'Lỗi khi tải dữ liệu tuần học');
  }
};

// src/services/courseService.ts
export const getCourseById = async (courseId: string): Promise<{
  id: number;
  title: string;
  description: string;
  roadmapImageUrl?: string;
}> => {
  const endpoint = `/courses/${courseId}`;
  try {
    const res = await apiEducoreBE.get(endpoint);
    console.log('[courseService] ✅ Đã gọi API:', res.config?.url); // in lại URL sau khi gọi thành công
    return res.data;
  } catch (error: any) {
    console.error('[courseService] ❌ Lỗi khi gọi API:', endpoint);
    console.error('[courseService] Chi tiết lỗi:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Không thể tải thông tin khóa học');
  }
};


