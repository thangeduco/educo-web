import React from 'react';
import styles from './WeekListItem.module.css';
import { WeekProgressDto } from '../../../services/dtos/student-course-detail.dto';

// Xác định class màu cho tiến độ
const getProgressClass = (percent: number): string => {
  if (percent === 0) return styles.progressFillNone;
  if (percent <= 25) return styles.progressFillStart;
  if (percent <= 50) return styles.progressFillHalf;
  if (percent <= 75) return styles.progressFillMid;
  if (percent < 100) return styles.progressFillAlmost;
  return styles.progressFillDone;
};

// Trả về biểu tượng cảm xúc theo điểm
const getScoreIcon = (score: number | null): string => {
  if (score === null || score < 50) return '🤔';
  if (score >= 90) return '🏆';
  if (score >= 70) return '🎖️';
  return '😊';
};

interface WeekListItemProps {
  weekId: number;
  weekNumber: number;
  weekTitle: string;
  progress: WeekProgressDto;
  isSelected: boolean;
  onClick: () => void;
}

const WeekListItem: React.FC<WeekListItemProps> = ({
  weekId,
  weekNumber,
  weekTitle,
  progress,
  isSelected,
  onClick,
}) => {
  const percent = Math.round((progress?.weekProgress ?? 0) * 100);
  const score = Math.round(progress?.weekScore ?? 0);
  const total = Math.round(progress?.weekTotalScore ?? 0);
  const progressClass = getProgressClass(percent);

  return (
    <div
      className={`${styles.weekRow} ${isSelected ? styles.selectedWeek : ''}`}
      onClick={onClick}
    >
      <div className={styles.weekColumnTitle}>
        <strong>{weekTitle}</strong>
      </div>

      <div className={styles.weekStatusRow}>
        <div className={styles.weekProgressRow}>
          <div className={styles.weekProgressTrack}>
            <div
              className={`${styles.weekProgressFill} ${progressClass}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className={styles.weekBadge}>
          <span className={styles.weekBadgeIcon}>{getScoreIcon(score)}</span>
          <span className={styles.weekBadgeText}>
            {score}/{total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeekListItem;
