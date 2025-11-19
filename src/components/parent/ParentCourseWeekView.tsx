import React from 'react';
import styles from './ParentCourseWeekView.module.css';
import { StudentCourseWeekForParent } from '../../services/dtos/student-course-detail.dto';

interface ParentCourseWeekViewProps {
  courseId: string;
  studentCourseWeeksStat: StudentCourseWeekForParent[];
}

const ParentCourseWeekView: React.FC<ParentCourseWeekViewProps> = ({
  courseId,
  studentCourseWeeksStat,
}) => {
  const sortedWeeks = [...studentCourseWeeksStat].sort((a, b) => a.weekNumber - b.weekNumber);

  return (
    <div className={styles.weekList}>
      {sortedWeeks.map((week) => (
        <div key={week.weekId} className={styles.weekItem}>
          {/* Hàng 1: Tiêu đề - progress - điểm TB */}
          <div className={styles.weekHeader}>
            <div className={styles.weekTitle}>
              Tuần {week.weekNumber}: {week.weekTitle}
            </div>
            <div className={styles.weekProgressTrack}>
              <div
                className={styles.weekProgressFill}
                style={{ width: `${(week.weekProgress ?? 0) * 100}%` }}
              />
            </div>
            <div className={styles.weekScore}>
              Điểm TB: <strong>{week.averageBestScore ?? 0}</strong>
            </div>
          </div>

          {/* Hàng 2: Nhận xét giáo viên */}
          <div className={styles.teacherComment}>
            📝 Nhận xét: <i>{week.teacherReviews || 'Chưa có nhận xét.'}</i>
          </div>

          {/* Hàng 3: Danh sách video & worksheet */}
          <div className={styles.contentList}>
            {week.videos.map((video) => (
              <div key={video.content_id} className={styles.contentItem}>
                🎬 <strong>{video.video_title}</strong> – Xem: {video.watched_duration_minutes} phút
              </div>
            ))}
            {week.worksheets.map((ws) => (
              <div key={ws.content_id} className={styles.contentItem}>
                📄 <strong>{ws.worksheet_title}</strong> – Đã nộp: {ws.submission_count} lần – 
                Điểm cao nhất: {ws.highest_score}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParentCourseWeekView;
