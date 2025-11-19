// src/features/BM/components/RoleGreeting.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoleGreeting.module.css';

export type UserRole = 'teacher' | 'parent' | string | null;

interface RoleGreetingProps {
  role: UserRole;
}

/** 
 * Config lời chào theo role – dễ mở rộng
 */
const ROLE_CONFIG: Record<
  string,
  { title: string; message: string; buttonText: string; navigateTo: string; emoji: string }
> = {
  teacher: {
    emoji: '👩‍🏫',
    title: 'Xin chào giáo viên!',
    message: 'Bạn có thể truy cập bảng giảng dạy để theo dõi học sinh.',
    buttonText: '➡️ Vào bảng giảng dạy',
    navigateTo: '/teacher',
  },
  parent: {
    emoji: '👨‍👩‍👧',
    title: 'Xin chào phụ huynh!',
    message: 'Hãy chọn học sinh để xem tiến độ học tập và đánh giá từ thầy cô.',
    buttonText: '➡️ Xem học tập của con',
    navigateTo: '/parent',
  },
};

const RoleGreeting: React.FC<RoleGreetingProps> = ({ role }) => {
  const navigate = useNavigate();

  // Không có role hoặc role không được định nghĩa → không hiển thị
  if (!role || !ROLE_CONFIG[role]) return null;

  const cfg = ROLE_CONFIG[role];

  return (
    <div className={styles.roleContainer}>
      <h2 className={styles.roleHeading}>
        {cfg.emoji} {cfg.title}
      </h2>

      <p className={styles.roleMessage}>{cfg.message}</p>

      <button
        className={styles.roleButton}
        onClick={() => navigate(cfg.navigateTo)}
      >
        {cfg.buttonText}
      </button>
    </div>
  );
};

export default RoleGreeting;
