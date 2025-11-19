import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import './VideoLecture.css';
import {
  VideoEvent,
  VideoChoiceQuiz,
  VideoAudioEventData,
  VideoVideoEventData,
  VideoImageEventData,
} from '../../models/video-events.model';
import { getVideoEvents } from '../../services/videoLectureService';
import { startVideoSession, stopVideoSession } from '../../services/learningService';
import { VideoChoiceQuizEvents } from './VideoChoiceQuizEvents';
import { VideoAudioEvents } from './VideoAudioEvents';
import { VideoVideoEvents } from './VideoVideoEvents';
import { VideoImageEvents } from './VideoImageEvents';

interface VideoLectureProps {
  videoId: number;
  videoUrl: string;
  thumbnailUrl: string;
  studentId: number;
  userName?: string;
  courseId: number;
  weekId: number;
  onStart?: (videoId: number) => void;
  disabled?: boolean;
}

export const VideoLecture: React.FC<VideoLectureProps> = ({
  videoId,
  videoUrl,
  thumbnailUrl,
  studentId,
  userName,
  courseId,
  weekId,
  onStart,
  disabled = false,
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<VideoEvent | null>(null);
  const [shownEventIds, setShownEventIds] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Gọi API khởi tạo session học video
  const handleStartSession = async () => {
    if (studentId === -1) return;
    try {
      const currentTime = playerRef.current?.getCurrentTime?.() || 0;
      const res = await startVideoSession({
        student_id: studentId,
        video_lecture_id: videoId,
        course_week_id: weekId,
        course_id: courseId,
        start_second: Math.floor(currentTime),
      });
      setSessionId(res.id);
      setSessionStartTime(Date.now());
    } catch (err) {
      console.error('❌ Lỗi khởi tạo session:', err);
    }
  };

  const handleStopSession = async () => {
    if (studentId === -1 || !sessionId) return;
    try {
      const currentTime = playerRef.current?.getCurrentTime?.() || 0;
      const stopSec = Math.floor(currentTime);
      const watchTime = Math.floor((Date.now() - sessionStartTime) / 1000);
      await stopVideoSession(sessionId, {
        stop_second: stopSec,
        actual_duration: watchTime,
      });
    } catch (err) {
      console.error('❌ Lỗi ghi nhận kết thúc session:', err);
    }
  };

  // Lấy sự kiện video khi mở player
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getVideoEvents(studentId, videoId);
        console.log('📊 Video events fetched: =======================', data);
        setEvents(data);
      } catch (error) {
        console.error('❌ Lỗi lấy video events:', error);
      }
    };

    if (showPlayer) {
      fetchEvents();
      onStart?.(videoId);
      handleStartSession();
    }
  }, [showPlayer]);

  useEffect(() => {
    const handleBeforeUnload = () => handleStopSession();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleStopSession();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId, sessionStartTime]);

  // Kiểm tra thời điểm hiển thị sự kiện tương tác
  useEffect(() => {
    if (!showPlayer || events.length === 0) return;

    const interval = setInterval(() => {
      const currentTime = playerRef.current?.getCurrentTime?.() || 0;
      const nextEvent = events.find(
        (e) => !shownEventIds.has(e.event_id) && Math.abs(e.start_time - currentTime) < 0.5
      );
      if (nextEvent) {
        setActiveEvent(nextEvent);
        setShownEventIds((prev) => new Set(prev).add(nextEvent.event_id));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [events, shownEventIds, showPlayer]);

  useEffect(() => {
    if (activeEvent) setIsPlaying(false);
  }, [activeEvent]);

  const handleCloseOverlay = () => {
    setActiveEvent(null);
    setIsPlaying(true);
  };

  const handleThumbnailClick = () => {
    if (disabled) {
      alert('🔐 Vui lòng đăng nhập để xem video bài giảng.');
      return;
    }
    setShowPlayer(true);
    onStart?.(videoId);
  };

  // Sắp xếp câu hỏi quiz theo quiz_id === trigger_ref_id lên đầu
  const renderQuizOverlay = (event: VideoEvent) => {
    const quizData = event.event_data as VideoChoiceQuiz[];
    // ghi console event giúp tôi
    console.log('📋 Rendering quiz overlay for event: ===========', event);
    // ghi console log event.event_data
    console.log('📊 Event Data: =========== ===========', event.event_data);
    const triggerId = event.trigger_ref_id;
    const sortedQuiz = triggerId
      ? [
          ...quizData.filter((q) => q.quiz_id === triggerId),
          ...quizData.filter((q) => q.quiz_id !== triggerId),
        ]
      : quizData;

    return (
      <VideoChoiceQuizEvents
        data={sortedQuiz}
        studentName={userName}
        triggerRefId={triggerId}
        studentId={studentId}
        courseId={courseId} // 👈 thêm courseId để phù hợp với API
        onClose={handleCloseOverlay}
      />
    );
  };

  const renderOverlay = () => {
    if (!activeEvent) return null;

    switch (activeEvent.event_type) {
      case 'quiz':
        return renderQuizOverlay(activeEvent);
      case 'audio':
        return (
          <VideoAudioEvents
            data={activeEvent.event_data as VideoAudioEventData}
            onClose={handleCloseOverlay}
          />
        );
      case 'video':
        return (
          <VideoVideoEvents
            data={activeEvent.event_data as VideoVideoEventData}
            onClose={handleCloseOverlay}
          />
        );
      case 'image':
        return (
          <VideoImageEvents
            data={activeEvent.event_data as VideoImageEventData}
            onClose={handleCloseOverlay}
          />
        );
      default:
        return null;
    }
  };

  if (!showPlayer) {
    return (
      <div className="video-lecture-wrapper">
        <div
          className={`video-lecture-thumbnail ${disabled ? 'video-disabled' : ''}`}
          onClick={handleThumbnailClick}
        >
          <img src={thumbnailUrl} alt="Video Thumbnail" />
          <div className="play-button">▶</div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-lecture-container">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
        width="100%"
        height="100%"
        playing={isPlaying}
      />
      {activeEvent && (
        <div className="quiz-popup-backdrop">
          <div className="quiz-popup-modal">{renderOverlay()}</div>
        </div>
      )}
    </div>
  );
};
