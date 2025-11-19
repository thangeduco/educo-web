// src/services/learningService.ts
import apiEducoreBE from './apiService';
import { StudentCourseDetailDto } from '../services/dtos/student-course-detail.dto';
import {StudentNearProgressData} from './dtos/student-near-progress-data.dto';

// 📝 Gửi bài tập kèm file nộp
export const submitWorksheetWithFile = async (formData: FormData) => {
  console.log('[learningService] Gửi form submit bài tập kèm file');
  try {
    const res = await apiEducoreBE.post('/learning/worksheet-submissions/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    console.error('[learningService] Lỗi submit bài tập:', err);
    throw err;
  };


};

// ✅ Lấy thống kê học tập theo tuần của học sinh trong khoá học
export const getWeeklyLearningStats = async (studentId: number, courseId: string, weekId: number) => {
  console.log('[learningService] Gọi API lấy thống kê học tập của tuần học:', { studentId, courseId, weekId });
  try {
    const res = await apiEducoreBE.get(`/learning/student/${studentId}/courses/${courseId}/weeks/${weekId}/weekly-stats`);
    return res.data;
  } catch (error) {
    console.error('[learningService] ❌ Lỗi khi lấy thống kê học tập theo tuần:', error);
    throw new Error('Lỗi khi lấy thống kê học tập theo tuần');
  }
};

// ✅ Gọi API lấy toàn bộ thông tin học tập của học sinh trong khoá học
export const getStudentCourseProgressDetail = async (studentId: number, courseId: string): Promise<StudentCourseDetailDto> => {
  console.log('[learningService] Gọi API lấy StudentCourseDetailDto:', { studentId, courseId });
  try {
    const res = await apiEducoreBE.get(`/learning/student/${studentId}/courses/${courseId}/progress-detail`);
    return res.data;
  } catch (error) {
    console.error('[learningService] ❌ Lỗi khi lấy StudentCourseDetailDto:', error);
    throw new Error('Lỗi khi lấy tiến độ khoá học');
  }
};

export const getGuestCourseDetail = async (courseId: string): Promise<StudentCourseDetailDto> => {
  console.log('[learningService] Gọi API lấy Danh sách các nội dung học theo từng tuần:', {courseId });
  try {
    const res = await apiEducoreBE.get(`/courses/${courseId}/course-detail`);
    return res.data;
  } catch (error) {
    console.error('[learningService] ❌ Lỗi khi lấy danh sách các nội dung học theo từng tuần::', error);
    throw new Error('Lỗi khi lấy tiến các nội dung học theo từng tuần');
  }
};

// Gọi khi học sinh bắt đầu xem video
export const startVideoSession = async (data: {
  student_id: number;
  video_lecture_id: number;
  course_week_id: number;
  course_id: number;
  start_second: number;

}): Promise<{ id: number }> => {
  console.log('[learningService] ▶️ Bắt đầu phiên xem video:', data);
  try {
    const res = await apiEducoreBE.post('/learning/video-sessions/start', data);
    return res.data;
  } catch (err) {
    console.error('[learningService] ❌ Lỗi khi tạo phiên xem video:', err);
    throw err;
  }
};

// Gọi khi học sinh kết thúc xem video
export const stopVideoSession = async (
  sessionId: number,
  payload: {
    stop_second: number;
    actual_duration: number;
  }
) => {
  console.log('[learningService] ⏹️ Kết thúc phiên xem video:', { sessionId, ...payload });
  try {
    await apiEducoreBE.patch(`/learning/video-sessions/${sessionId}/stop`, payload);
  } catch (err) {
    console.error('[learningService] ❌ Lỗi khi dừng phiên xem video:', err);
    throw err;
  }
}; 

export const getStudentNearProgressSummary = async (
  studentId: number,
  courseId: number
): Promise<StudentNearProgressData[]> => {
  console.log('[learningService] 📈 Gọi API lấy thống kê học tập học sinh gần đây của khoá học:', { studentId, courseId });
  try {
    // Gọi API lấy thống kê học tập học sinh gần đây
    if (!studentId) {
      throw new Error('studentId is required');
    }
    //router.get('/student/:studentId/courses/:courseId/near-progress-summary', learningController.getNearProgressSummaryOfStudent);
    const res = await apiEducoreBE.get(`/learning/student/${studentId}/courses/${courseId}/near-progress-summary`);

    return res.data;
  } catch (error) {
    console.error('[learningService] ❌ Lỗi khi lấy thống kê học tập học sinh:', error);
    throw new Error('Lỗi khi lấy dữ liệu thống kê học tập');
  }
};


// ✅ Ghi log lựa chọn của học sinh cho câu hỏi lựa chọn trong video
export const logChoiceQuizAnswer = async (payload: {
  student_id: number;
  choice_quiz_id: number;
  selected_option: string;
  is_correct: boolean;
  answered_in_seconds: number;
  course_id: number; // Thêm course_id để phù hợp với API
}) => {
  try {
    // Backend khuyến nghị: tạo created_at/updated_at ở DB; FE không cần gửi
    //Cập nhật API theo format này: student/:studentId/courses/:courseId/video-choice-quiz-logs
    const res = await apiEducoreBE.post(`/learning/student/${payload.student_id}/courses/${payload.course_id}/video-choice-quiz-logs`, payload);
    return res.data;
  } catch (error) {
    console.error('[learningService] ❌ Lỗi ghi log video_choice_quiz_logs:', error);
    throw error;
  }
};


