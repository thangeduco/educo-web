import React, { useEffect } from 'react';
import { VideoImageEventData } from '../../models/video-events.model';
import { FeedbackAnimation } from '../animation/FeedbackAnimation';
import './VideoImageEvents.css';

interface VideoImageEventsProps {
  data: VideoImageEventData;
  onClose: () => void;
}

export const VideoImageEvents: React.FC<VideoImageEventsProps> = ({ data, onClose }) => {
  const {
    image_url,
    display_text,
    animation_type,
  } = data;

  // Đóng sau 5 giây mặc định
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="video-image-overlay">
      <div className="video-image-modal">
        {animation_type && <FeedbackAnimation animationType={animation_type} />}
        {display_text && <p className="video-image-text">{display_text}</p>}
        <img
          src={image_url}
          alt="Video Event"
          className="video-image-content"
        />
      </div>
    </div>
  );
};
