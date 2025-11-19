import React from 'react';
import styles from './VideoLessonItem.module.css';
import { VideoLearning } from '../../../services/dtos/student-course-detail.dto';
import { VideoLecture } from '../../video-lecture/VideoLecture';

interface VideoLessonItemProps {
  content: VideoLearning;
  isGuest: boolean;
  studentId: number;
  userName?: string; // ✅ mới nếu cần
  courseId: number;
  weekId: number; // đã đổi tên từ courseWeekId
}

// Hàm lấy thumbnail từ YouTube URL
const getYoutubeThumbnail = (videoUrl: string): string => {
  const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
};

const VideoLessonItem: React.FC<VideoLessonItemProps> = ({
  content,
  isGuest,
  studentId,
  userName,
  courseId,
  weekId,
}) => {
  const { content_id, content_step, video_title, video_url } = content;

  if (!video_title || !video_url) return null;

  const handleStart = () => {
    if (isGuest) {
      alert('🔐 Vui lòng đăng nhập để xem video bài giảng.');
      return;
    }
    // Xử lý thêm nếu cần khi bắt đầu video
  };

  return (
    <div className={styles.videoLesson}>
      <div className={styles.videoTitle}>
        🎬 {content_step}: {video_title}
      </div>
      <VideoLecture
        videoId={content_id}
        videoUrl={isGuest ? '' : video_url}
        thumbnailUrl={getYoutubeThumbnail(video_url)}
        onStart={handleStart}
        disabled={isGuest}
        studentId={studentId}
        userName={userName} // ✅ truyền vào nếu cần
        courseId={courseId}
        weekId={weekId} // ✅ truyền đúng tên prop mới
      />
    </div>
  );
};

export default VideoLessonItem;
