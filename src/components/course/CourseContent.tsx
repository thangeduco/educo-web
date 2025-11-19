import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../app/context/UserContext';
import CourseHeader from './CourseHeader';
import CourseWeek from './weeks/CourseWeek';
import styles from './CourseContent.module.css';
import {
  WeekProgressDto,
  WeeklyLearningStats,
} from '../../services/dtos/student-course-detail.dto';
import { getStudentCourseProgressDetail } from '../../services/learningService';

import socket from '../../services/socketClient';

const CourseContent: React.FC = () => {
  const { courseId } = useParams();
  const { user } = useUser();

  const [courseTitle, setCourseTitle] = useState<string>('');
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [weeksProgress, setWeeksProgress] = useState<WeekProgressDto[]>([]);
  const [weekContent, setWeekContent] = useState<WeeklyLearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [triggerCelebration, setTriggerCelebration] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId) return;

      try {
        setLoading(true);

        const studentId = user?.id ?? -1;
        const result = await getStudentCourseProgressDetail(studentId, courseId);

        console.log('[CourseContent] ✅ Kết quả từ backend:', result);
        setCourseTitle(result.courseTitle);
        setBadgeCount(result.courseBadgeCount ?? 0);
        setCourseProgress(result.courseProgress ?? 0);
        setWeeksProgress(result.weeksProgress);
        setWeekContent(result.weekDetailContent);
      } catch (error) {
        console.error('[CourseContent] ❌ Lỗi khi lấy thông tin khoá học:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [user, courseId]);

  // 🎯 Lắng nghe badge_awarded từ socket
  useEffect(() => {
    if (!user) return;

    socket.emit('join_student_room', { studentId: user.id });

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
  }, [user]);

  if (loading) return <div>Đang tải...</div>;
  if (!weekContent) return <div>Không tìm thấy nội dung học.</div>;

  return (
    <div className={styles.wrapper}>
      <CourseHeader
        courseTitle={courseTitle}
        badgeCount={badgeCount}
        courseProgress={courseProgress}
        triggerCelebration={triggerCelebration}
      />
      <CourseWeek
        courseId={courseId!}
        weekContent={weekContent}
        weeksProgress={weeksProgress}
        isGuest={!user}
      />
    </div>
  );
};

export default CourseContent;
