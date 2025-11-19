// src/components/teacher/TeacherDashboardContent.tsx
import React, { useEffect, useState } from 'react';
import styles from './TeacherDashboardContent.module.css';
import TeacherDashboardHeader from './TeacherDashboardHeader';
import TeacherClassView from './TeacherClassView';
import {
  TeacherClassView as TeacherClassViewType,
  TeacherClassSummary,
  StudentTaskItem,
} from '../../models/teacher.model';
import { getTeacherClassView, getStudentsOfClass } from '../../services/teacherService';

const TeacherDashboardContent: React.FC = () => {
  const [teacherInfo, setTeacherInfo] = useState<TeacherClassViewType['teacherInfo'] | null>(null);
  const [classSummaries, setClassSummaries] = useState<TeacherClassSummary[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<StudentTaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        setLoading(true);
        const data = await getTeacherClassView();
        setTeacherInfo(data.teacherInfo);
        setClassSummaries(data.classSummaries);
      } catch (err) {
        console.error('[TeacherDashboardContent] ❌ Lỗi lấy danh sách lớp:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassList();
  }, []);

  const handleSelectClass = async (classId: string, filterType?: StudentTaskItem['taskType']) => {
    try {
      const students = await getStudentsOfClass(classId); // Gọi API backend
      if (filterType) {
        setSelectedStudents(students.filter((s) => s.taskType === filterType));
      } else {
        setSelectedStudents(students);
      }
    } catch (err) {
      console.error(`[TeacherDashboardContent] ❌ Lỗi khi load học sinh lớp ${classId}:`, err);
    }
  };

  const totalHomework = classSummaries.reduce((sum, c) => sum + c.pendingHomework, 0);
  const totalReview = classSummaries.reduce((sum, c) => sum + c.pendingReview, 0);
  const totalUpdateReview = classSummaries.reduce((sum, c) => sum + c.pendingUpdateReview, 0);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!teacherInfo) return <div>Không tìm thấy thông tin giáo viên.</div>;

  return (
    <div className={styles.wrapper}>
      <TeacherDashboardHeader
        totalPendingHomework={totalHomework}
        totalPendingReview={totalReview}
        totalPendingUpdateReview={totalUpdateReview}
      />
      <TeacherClassView
        classSummaries={classSummaries}
        students={selectedStudents}
        onSelectClass={handleSelectClass}
      />
    </div>
  );
};

export default TeacherDashboardContent;
