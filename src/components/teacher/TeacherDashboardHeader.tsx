import React from 'react';
import styles from './TeacherDashboardHeader.module.css';

interface Props {
  totalPendingHomework: number;
  totalPendingReview: number;
  totalPendingUpdateReview: number;
}

const TeacherDashboardHeader: React.FC<Props> = ({
  totalPendingHomework,
  totalPendingReview,
  totalPendingUpdateReview,
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.statBox}>
        📄 Chờ chấm BTVN: <strong>{totalPendingHomework}</strong> học sinh
      </div>
      <div className={styles.statBox}>
        🗒️ Chờ nhận xét tuần: <strong>{totalPendingReview}</strong> học sinh
      </div>
      <div className={styles.statBox}>
        🖊️ Chờ cập nhật nhận xét: <strong>{totalPendingUpdateReview}</strong> học sinh
      </div>
    </div>
  );
};

export default TeacherDashboardHeader;
