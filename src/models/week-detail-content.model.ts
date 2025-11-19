// src/models/week-detail-content.model.ts

export interface VideoLecture {
  id: number;
  title: string;
  url: string;
  duration?: number;         // Thời lượng video (giây)
}

export interface Worksheet {
  id: number;
  title: string;
  downloadUrl?: string; // ➕ Link tải worksheet (PDF, DOCX, v.v.)
}

export interface WeekDetailContent {
  id: number;
  courseWeekId: number;
  weekNumber: number;           // Tuần học (số tuần học trong khoá học)
  weekTitle: string;         // Tiêu đề của tuần học
  weekDescription: string;      // Mô tả về tuần học
  contentType: 'video' | 'worksheet'; // Loại nội dung: video hoặc worksheet
  contentId: number;            // ID của video hoặc worksheet
  step: number;                 // Thứ tự của bước trong tuần học
  videoLecture?: VideoLecture; // Nếu contentType là 'video', chứa thông tin về video lecture
  worksheet?: Worksheet;        // Nếu contentType là 'worksheet', chứa thông tin về worksheet

  // ➕ Thêm các trường sau để hỗ trợ UX
  status?: 'not_started' | 'in_progress' | 'done'; // Trạng thái học hiện tại
  attempts?: number;            // Số lần làm bài tập (worksheet)
  bestScore?: number;           // Điểm cao nhất (worksheet)
}
