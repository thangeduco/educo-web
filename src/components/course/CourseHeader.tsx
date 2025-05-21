import React from 'react';
import styles from './CourseHeader.module.css';

interface CourseHeaderProps {
  courseTitle: string;
  courseDescription: string;
  startDate: string;
  endDate: string;
  completedCount: number;
  totalCount: number;
  numOfWeek: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseTitle, courseDescription, startDate, endDate, completedCount, totalCount, numOfWeek }) => (
  <div className={styles.courseHeader}>
    <div className={styles.left}>
      <h2 className={styles.title}>{courseTitle}</h2>
    </div>
    <div className={styles.infoGrid}>
      <div className={styles.infoItem}>Ngày bắt đầu: <strong className={styles.highlight}>{startDate}</strong></div>
      <div className={styles.infoItem}>Đã hoàn thành: <strong className={styles.highlight}>{completedCount}</strong> / <strong className={styles.highlight}>{totalCount} phần</strong> </div>
    </div>
  </div>
);
export default CourseHeader;
