import React from 'react';
import styles from './WeekList.module.css';
import WeekListItem from './WeekListItem';
import { WeekProgressDto } from '../../../services/dtos/student-course-detail.dto';

interface WeekListProps {
  weeksProgress: WeekProgressDto[];
  selectedWeekId: number;
  onSelectWeek: (weekId: number) => void;
}

const WeekList: React.FC<WeekListProps> = ({
  weeksProgress,
  selectedWeekId,
  onSelectWeek,
}) => {
  // Sắp xếp tuần theo thứ tự tăng dần của weekNumber
  const sortedWeeks = [...weeksProgress].sort((a, b) => a.weekNumber - b.weekNumber);

  return (
    <div className={styles.weekListColumn}>
      {sortedWeeks.map(week => (
        <WeekListItem
          key={week.weekId}
          weekId={week.weekId}
          weekNumber={week.weekNumber}
          weekTitle={week.weekTitle}
          progress={week}
          isSelected={week.weekId === selectedWeekId}
          onClick={() => onSelectWeek(week.weekId)}
        />
      ))}
    </div>
  );
};

export default WeekList;
