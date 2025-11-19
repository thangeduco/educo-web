import React, { useEffect } from 'react';
import { Howl } from 'howler';
import { VideoAudioEventData } from '../../models/video-events.model';
import { FeedbackAnimation } from '../animation/FeedbackAnimation';
import './VideoAudioEvents.css';

interface VideoAudioEventsProps {
  data: VideoAudioEventData;
  onClose: () => void;
}

export const VideoAudioEvents: React.FC<VideoAudioEventsProps> = ({ data, onClose }) => {
  const {
    audio_url,
    display_text,
    animation_type,
  } = data;

  useEffect(() => {
    const sound = new Howl({
      src: [audio_url],
      onend: () => {
        // Đóng modal khi audio kết thúc
        onClose();
      },
    });

    sound.play();

    return () => {
      sound.stop();
    };
  }, [audio_url, onClose]);

  return (
    <div className="video-audio-overlay">
      <div className="video-audio-modal">
        {animation_type && <FeedbackAnimation animationType={animation_type} />}
        {display_text && <p className="video-audio-text">{display_text}</p>}
      </div>
    </div>
  );
};
