import React, { useEffect, useRef } from 'react';
import { VideoVideoEventData } from '../../models/video-events.model';
import { FeedbackAnimation } from '../animation/FeedbackAnimation';
import './VideoVideoEvents.css';

interface VideoVideoEventsProps {
  data: VideoVideoEventData;
  onClose: () => void;
}

export const VideoVideoEvents: React.FC<VideoVideoEventsProps> = ({ data, onClose }) => {
  const {
    video_url,
    display_text,
    animation_type,
  } = data;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;

    const handleEnded = () => {
      onClose();
    };

    if (videoEl) {
      videoEl.play().catch((err) => {
        console.warn('⚠️ Không thể tự động phát video:', err);
      });
      videoEl.addEventListener('ended', handleEnded);
    }

    return () => {
      if (videoEl) {
        videoEl.pause();
        videoEl.removeEventListener('ended', handleEnded);
      }
    };
  }, [video_url, onClose]);

  return (
    <div className="video-inserted-wrapper">
      <div className="video-inserted-modal">
        {animation_type && <FeedbackAnimation animationType={animation_type} />}
        {display_text && <p className="video-inserted-text">{display_text}</p>}
        <video
          ref={videoRef}
          src={video_url}
          controls
          className="video-inserted-player"
        />
      </div>
    </div>
  );
};
