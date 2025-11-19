import React from 'react';
import styles from './WeekDetail.module.css';
import {
  VideoLearning,
  WorksheetLearning,
} from '../../../services/dtos/student-course-detail.dto';
import VideoLessonItem from './VideoLessonItem';
import WorksheetItem from './WorksheetItem';

interface WeekDetailProps {
  courseId: string;
  weekId: number; // ✅ mới
  weekNumber: number;
  weekDescription: string;
  videos: VideoLearning[];
  worksheets: WorksheetLearning[];
  isGuest: boolean;
  studentId: number; // ✅ mới
  userName?: string; // ✅ mới nếu cần
}

// Union type có thêm content_type để phân biệt
type DisplayContent = (VideoLearning | WorksheetLearning) & {
  content_type: 'video' | 'worksheet';
};

const WeekDetail: React.FC<WeekDetailProps> = ({
  courseId,
  weekId,
  weekNumber,
  weekDescription,
  videos,
  worksheets,
  isGuest,
  studentId,
  userName, // ✅ mới nếu cần
}) => {
  const combinedContents: DisplayContent[] = [
    ...videos.map((video) => ({ ...video, content_type: 'video' as const })),
    ...worksheets.map((ws) => ({ ...ws, content_type: 'worksheet' as const })),
  ].sort((a, b) => a.content_step - b.content_step);

  return (
    <div className={styles.weekDetailColumn}>
      {weekDescription && (
        <div className={styles.weekDescription}>
          {weekDescription.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      <div className={styles.weekContentLayout}>
        {combinedContents.map((content) => {
          if (content.content_type === 'video') {
            const video = content as VideoLearning;
            return (
              <div key={video.content_id} className={styles.lessonRowItem}>
                <VideoLessonItem
                  content={video}
                  isGuest={isGuest}
                  studentId={studentId}
                  userName={userName} // ✅ truyền vào nếu cần
                  courseId={Number(courseId)}
                  weekId={weekId}
                />
              </div>
            );
          }

          if (content.content_type === 'worksheet') {
            const worksheet = content as WorksheetLearning;
            return (
              <div key={worksheet.content_id} className={styles.lessonRowItem}>
                <WorksheetItem content={worksheet} courseId={courseId} isGuest={isGuest} weekId = {weekId} />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default WeekDetail;
