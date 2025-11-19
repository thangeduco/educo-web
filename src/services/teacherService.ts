// src/services/teacherService.ts

import apiEducoreBE from './apiService';
import { TeacherClassView } from '../models/teacher.model';
import { StudentTaskItem } from '../models/teacher.model';

// === API chính: Lấy thông tin tổng quan các lớp học giáo viên phụ trách ===
export const getTeacherClassView = async (): Promise<TeacherClassView> => {
    await new Promise((r) => setTimeout(r, 300));
    try {
        const response = await apiEducoreBE.get('/learning/teacher-view/class-summary');
        return response.data;
    } catch (error) {
        console.error('[teacherService] ❌ Lỗi khi gọi getTeacherClassView:', error);
        throw error;
    }
};

export const getStudentsOfClass = async (classId: string): Promise<StudentTaskItem[]> => {
    try {
        const response = await apiEducoreBE.get(`/learning/teacher-view/class/${classId}/students`);
        return response.data;
    } catch (error) {
        console.error('[teacherService] ❌ Lỗi khi gọi getStudentsOfClass:', error);
        throw error;
    }
};
