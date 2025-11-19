import React, { useState } from 'react';
import styles from './CourseWeek.module.css';
import WeekList from './WeekList';
import WeekDetail from './WeekDetail';
import { useUser } from '../../../app/context/UserContext';
import {
  WeekProgressDto,
  WeeklyLearningStats,
} from '../../../services/dtos/student-course-detail.dto';
import { getWeeklyLearningStats } from '../../../services/learningService';

interface CourseWeekProps {
  courseId: string;
  weeksProgress: WeekProgressDto[];
  weekContent: WeeklyLearningStats;
  isGuest: boolean;
}

const CourseWeek: React.FC<CourseWeekProps> = ({
  courseId,
  weeksProgress,
  weekContent,
  isGuest,
}) => {
  const { user } = useUser();
  const [selectedWeekId, setSelectedWeekId] = useState<number>(weekContent.week_id);
  const [currentWeekContent, setCurrentWeekContent] = useState<WeeklyLearningStats>(weekContent);
  const [loading, setLoading] = useState(false);

  const handleSelectWeek = async (weekId: number) => {
    if (weekId === selectedWeekId) return;
    setSelectedWeekId(weekId);

    try {
      setLoading(true);
      const studentId = isGuest ? -1 : user!.id;
      const result = await getWeeklyLearningStats(studentId, courseId, weekId);
      setCurrentWeekContent(result);
    } catch (err) {
      console.error('[CourseWeek] ❌ Lỗi khi lấy dữ liệu tuần học:', err);
    } finally {
      setLoading(false);
    }
  };

  const studentId = isGuest ? -1 : user?.id ?? -1;

  return (
    <div className={styles.courseWeeksLayout}>
      <WeekList
        weeksProgress={weeksProgress}
        selectedWeekId={selectedWeekId}
        onSelectWeek={handleSelectWeek}
      />

      {loading ? (
        <div>Đang tải nội dung tuần học...</div>
      ) : (
        <WeekDetail
          courseId={courseId}
          weekId={currentWeekContent.week_id} // ✅ truyền vào
          weekNumber={currentWeekContent.week_number}
          weekDescription={currentWeekContent.week_description}
          videos={currentWeekContent.videos}
          worksheets={currentWeekContent.worksheets}
          isGuest={isGuest}
          studentId={studentId} // ✅ truyền vào
          userName = {user?.fullName || ''} // ✅ truyền vào nếu cần
        />
      )}
    </div>
  );
};

export default CourseWeek;
