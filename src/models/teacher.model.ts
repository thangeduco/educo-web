// src/models/teacher.model.ts

// === Kiểu dữ liệu học sinh cần xử lý trong lớp học ===
export interface StudentTaskItem {
  id: string;
  studentName: string;
  weekNumber: number;
  weekTitle: string;
  homeworkTitle: string;
  homeworkFileUrl: string;
  taskType: 'Chờ chấm BTVN' | 'Chờ nhận xét tuần' | 'Chờ cập nhật nhận xét tuần';
}

// === Kiểu dữ liệu lớp học mà giáo viên phụ trách ===
export interface TeacherClassSummary {
  classId: string;
  className: string;
  pendingHomework: number;
  pendingReview: number;
  pendingUpdateReview: number;
  students: StudentTaskItem[];
}

// === Kiểu dữ liệu tổng quan dashboard của giáo viên ===
export interface TeacherClassView {
  teacherInfo: {
    teacherName: string;
    teacherAvatarUrl: string;
    teacherSlogan: string;
  };
  classSummaries: TeacherClassSummary[];
}
