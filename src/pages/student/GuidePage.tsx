import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './GuidePage.module.css';

const GuidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const backPath = (location.state as any)?.from || '/';

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Hướng dẫn học</h1>
        <p className={styles.description}>
          Chào mừng bạn đến với nền tảng học toán EDUCO! Dưới đây là hướng dẫn giúp bạn bắt đầu nhanh chóng:
        </p>
        <ul className={styles.steps}>
          <li><strong>Bước 1:</strong> Đăng ký hoặc đăng nhập tài khoản của bạn.</li>
          <li><strong>Bước 2:</strong> Chọn khoá học phù hợp từ trang chủ.</li>
          <li><strong>Bước 3:</strong> Xem video bài giảng và làm worksheet tương ứng.</li>
          <li><strong>Bước 4:</strong> Theo dõi tiến độ học tập qua hồ sơ cá nhân.</li>
          <li><strong>Bước 5:</strong> Tham gia bảng xếp hạng học tập để thi đua với bạn bè!</li>
        </ul>
        <p className={styles.note}>Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với giáo viên hoặc đội ngũ hỗ trợ kỹ thuật.</p>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button className={styles.backButton} onClick={() => navigate(backPath)}>Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;