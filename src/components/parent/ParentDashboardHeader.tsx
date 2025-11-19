import React from 'react';
import styles from './ParentDashboardHeader.module.css';

interface ParentDashboardHeaderProps {
  studentName: string;
  studentAvatarUrl: string;
  studentSlogan: string;
  courseTitle: string;
  courseProgress?: number;
  badgeCount: number;
}

const ParentDashboardHeader: React.FC<ParentDashboardHeaderProps> = ({
  studentName,
  studentAvatarUrl,
  studentSlogan,
  courseTitle,
  courseProgress,
  badgeCount
}) => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerGrid}>
        {/* Bên trái: Thông tin học sinh */}
        <div className={styles.studentInfo}>
          <div className={styles.studentName}>{studentName}</div>
          <img src={studentAvatarUrl} alt="avatar" className={styles.avatar} />
          <div className={styles.slogan}>"{studentSlogan}"</div>
        </div>

        {/* Bên phải: Thông tin khoá học */}
        <div className={styles.learningInfo}>
          <div className={styles.title}>{courseTitle}</div>

          <div className={styles.progressWrapper}>
            <span className={styles.progressIcon}>📘</span>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${(courseProgress ?? 0) * 100}%` }}
              />
            </div>
            <span className={styles.progressPercent}>
              {Math.round((courseProgress ?? 0) * 100)}%
            </span>
          </div>

          <div className={styles.badgeStat}>
            <span className={styles.badgeIcon}>🎖️</span>
            <span className={styles.badgeLabel}>Huy hiệu:</span>
            <span className={styles.badgeValue}>{badgeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardHeader;
