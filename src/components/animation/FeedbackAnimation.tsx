// components/shared/FeedbackAnimation.tsx
import React, { useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import './FeedbackAnimation.css';

interface FeedbackAnimationProps {
  animationType: string | null;
}

export const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({ animationType }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!animationType) return;

    const audio = new Audio(`/sounds/${animationType}.mp3`);
    audioRef.current = audio;

    audio
      .play()
      .catch((err) => {
        console.warn(`Không thể phát audio: ${animationType}.mp3`, err);
      });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [animationType]);

  if (!animationType) return null;

  switch (animationType) {
    case 'confetti':
      return <Confetti numberOfPieces={150} recycle={false} />;

    case 'bounce':
      return (
        <div className="quiz-animation bounce">
          <span role="img" aria-label="bounce">🎉</span>
        </div>
      );

    case 'shake':
      return (
        <div className="quiz-animation shake">
          <span role="img" aria-label="shake">💥</span>
        </div>
      );

    case 'fade-glow':
      return (
        <div className="quiz-animation fade-glow">
          <span role="img" aria-label="fade-glow">✨</span>
        </div>
      );

    case 'zoom-in':
      return <div className={`quiz-animation ${animationType}`}><span>🔥</span></div>;

    case 'framer-pop':
      return (
        <motion.div
          className="quiz-animation framer-style"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.3, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
        >
          🎯
        </motion.div>
      );

    case 'framer-fade-in':
      return (
        <motion.div
          className="quiz-animation framer-style"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌟
        </motion.div>
      );

    default:
      return null;
  }
};
