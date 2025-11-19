import React, { useEffect, useRef, useState } from 'react';
import styles from './CourseHeader.module.css';
import { FeedbackAnimation } from '../animation/FeedbackAnimation';
import Confetti from 'react-confetti';

interface CourseHeaderProps {
  courseTitle: string;
  badgeCount: number;
  courseProgress?: number;
  triggerCelebration?: boolean;
}

const soundList = [
  '/sounds/pop1.mp3',
  '/sounds/kids_clap.mp3',
  '/sounds/wow_bell.mp3',
  '/sounds/success_ding.mp3'
];

const CourseHeader: React.FC<CourseHeaderProps> = ({
  courseTitle,
  badgeCount,
  courseProgress,
  triggerCelebration
}) => {
  const [prevBadgeCount, setPrevBadgeCount] = useState(badgeCount);
  const [showCelebration, setShowCelebration] = useState(false);
  const [effectStyle, setEffectStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const badgeIconRef = useRef<HTMLSpanElement>(null);

  // Gọi hiệu ứng khi số lượng badge tăng lên
  useEffect(() => {
    if (badgeCount > prevBadgeCount) {
      triggerEffect();
      setPrevBadgeCount(badgeCount);
    }
  }, [badgeCount, prevBadgeCount]);

  // Gọi hiệu ứng khi có trigger từ socket
  useEffect(() => {
    if (triggerCelebration) {
      triggerEffect();
    }
  }, [triggerCelebration]);

  const triggerEffect = () => {
    // Lấy toạ độ icon để popup hiệu ứng tại đó
    if (badgeIconRef.current) {
      const rect = badgeIconRef.current.getBoundingClientRect();
      setEffectStyle({
        top: rect.top + rect.height,
        left: rect.left + rect.width / 2
      });
    }

    // Phát âm thanh ngẫu nhiên
    const randomSound = soundList[Math.floor(Math.random() * soundList.length)];
    const audio = new Audio(randomSound);
    audio.play();

    // Hiển thị hiệu ứng
    setShowCelebration(true);

    // Tự động ẩn sau 4s
    setTimeout(() => setShowCelebration(false), 4000);
  };

  return (
    <div className={styles.courseHeader}>
      <div className={styles.headerGrid}>
        {/* Cột 1: Tiêu đề */}
        <div className={styles.headerCol}>
          <h2 className={styles.title}>{courseTitle}</h2>
        </div>

        {/* Cột 2: Để trống */}
        <div className={styles.headerCol}></div>

        {/* Cột 3: Tiến độ */}
        <div className={styles.headerCol}>
          <div className={styles.courseProgressRow}>
            <span className={`${styles.courseProgressIcon} ${styles.rotatedRight}`}>🏃‍♂️</span>
            <div className={styles.courseProgressTrack}>
              <div
                className={styles.courseProgressFill}
                style={{ width: `${(courseProgress ?? 0) * 100}%` }}
              />
              <div className={styles.courseProgressMarks}>
                <span style={{ left: '0%' }}></span>
                <span style={{ left: '33%' }}>📘</span>
                <span style={{ left: '66%' }}>📗</span>
                <span style={{ left: '90%' }}>🎓</span>
              </div>
            </div>
            <span className={styles.courseProgressIcon}>🚀</span>
          </div>
        </div>

        {/* Cột 4: Để trống */}
        <div className={styles.headerCol}></div>

        {/* Cột 5: Huy hiệu */}
        <div className={styles.headerCol}>
          <div className={styles.courseStatItem}>
            <span ref={badgeIconRef} className={styles.statIcon}>🎖️</span>
            <span className={styles.statLabel}>Huy hiệu:</span>
            <span className={styles.statValue}>{badgeCount}</span>
          </div>
        </div>
      </div>

      {/* 🎉 Hiệu ứng tặng huy hiệu */}
      {showCelebration && (
        <>
          {/* Confetti toàn màn hình */}
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={120} />

          {/* Hiệu ứng animation nổi bật */}
          <div
            style={{
              position: 'absolute',
              top: effectStyle.top,
              left: effectStyle.left,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          >
            <FeedbackAnimation animationType="framer-pop" />
          </div>

          {/* Popup văn bản */}
          <div
            style={{
              position: 'absolute',
              top: effectStyle.top + 30,
              left: effectStyle.left,
              transform: 'translate(-50%, 0)',
              background: '#fff8e1',
              padding: '10px 16px',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              fontSize: '14px',
              color: '#444'
            }}
          >
            🎉 Bạn vừa nhận huy hiệu mới!
          </div>
        </>
      )}
    </div>
  );
};

export default CourseHeader;
