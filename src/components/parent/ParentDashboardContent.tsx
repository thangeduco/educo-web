import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../app/context/UserContext';
import ParentDashboardHeader from './ParentDashboardHeader';
import ParentCourseWeekView from './ParentCourseWeekView';
import styles from './ParentDashboardContent.module.css';

import {
  StudentCourseWeekForParent,
} from '../../services/dtos/student-course-detail.dto';
import { getStudentCourseStatForParent } from '../../services/parentService';

import socket from '../../services/socketClient';

const ParentDashboardContent: React.FC = () => {
  const { courseId, studentId } = useParams<{ courseId: string; studentId: string }>();
  const { user } = useUser();

  const [courseTitle, setCourseTitle] = useState<string>('');
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>('');
  const [studentAvatarUrl, setStudentAvatarUrl] = useState<string>('');
  const [studentSlogan, setStudentSlogan] = useState<string>('');
  const [studentCourseWeeks, setStudentCourseWeeks] = useState<StudentCourseWeekForParent[]>([]);
  const [loading, setLoading] = useState(true);

  const [triggerCelebration, setTriggerCelebration] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId || !studentId) return;

      try {
        setLoading(true);

        const courseStat = await getStudentCourseStatForParent(Number(studentId), courseId);
        if (!courseStat) throw new Error('Không tìm thấy thông tin khoá học');

        setCourseTitle(courseStat.courseTitle);
        setBadgeCount(courseStat.courseBadgeCount ?? 0);
        setCourseProgress(courseStat.courseProgress ?? 0);
        setStudentName(courseStat.studentName);
        setStudentAvatarUrl(courseStat.studentAvatarUrl);
        setStudentSlogan(courseStat.studentSlogan);
        setStudentCourseWeeks(courseStat.courseWeekDetails || []);
      } catch (error) {
        console.error('[ParentDashboardContent] ❌ Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId, studentId]);

  // 🎯 Lắng nghe sự kiện tặng huy hiệu
  useEffect(() => {
    if (!studentId) return;

    socket.emit('join_student_room', { studentId: Number(studentId) });

    const handleBadgeAwarded = (data: any) => {
      console.log('[Socket] 🎉 Nhận badge_awarded:', data);
      setBadgeCount((prev) => prev + 1);
      setTriggerCelebration(true);
      setTimeout(() => setTriggerCelebration(false), 3500);
    };

    socket.on('badge_awarded', handleBadgeAwarded);

    return () => {
      socket.off('badge_awarded', handleBadgeAwarded);
    };
  }, [studentId]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!studentCourseWeeks.length) return <div>Không tìm thấy nội dung học tập.</div>;

  return (
    <div className={styles.wrapper}>
      <ParentDashboardHeader
        studentName={studentName}
        studentAvatarUrl={studentAvatarUrl}
        studentSlogan={studentSlogan}
        courseTitle={courseTitle}
        courseProgress={courseProgress}
        badgeCount={badgeCount}
      />
      <ParentCourseWeekView
        courseId={courseId!}
        studentCourseWeeksStat={studentCourseWeeks}
      />
    </div>
  );
};

export default ParentDashboardContent;
