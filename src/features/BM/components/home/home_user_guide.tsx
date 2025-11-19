// src/features/BM/components/home/home_user_guide.tsx
import React from 'react';
import styles from './home_user_guide.module.css';
import type { HomeUserGuideDto } from '../../model/HomeUserGuideDto';

interface HomeUserGuideProps {
  data: HomeUserGuideDto | null;
  loading: boolean;
  error: string | null;
}

const HomeUserGuide: React.FC<HomeUserGuideProps> = ({
  data,
  loading,
  error,
}) => {
  return (
    <section className={styles.container}>
      <header className={styles.headerRow}>
        <h2 className={styles.title}>Hướng dẫn sử dụng Educo</h2>
      </header>

      {/* TRẠNG THÁI LOADING / ERROR / EMPTY */}
      {loading && (
        <p className={styles.statusText}>Đang tải hướng dẫn từ hệ thống...</p>
      )}

      {error && !loading && (
        <p className={styles.errorText}>Có lỗi xảy ra: {error}</p>
      )}

      {!loading && !error && !data && (
        <p className={styles.statusText}>
          Hiện chưa có hướng dẫn nào để hiển thị.
        </p>
      )}

      {!loading && !error && data && (
        <div className={styles.guideGrid}>
          {/* KHỐI 1: HƯỚNG DẪN CHO PHỤ HUYNH / DỊCH VỤ */}
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{data.serviceTitle}</h3>
              <span className={`${styles.badge} ${styles.badgeParent}`}>
                Phụ huynh
              </span>
            </header>
            {data.serviceSummaryMd && (
              <p className={styles.itemDescription}>{data.serviceSummaryMd}</p>
            )}
            {data.serviceGuideFileUrl && (
              <a
                href={data.serviceGuideFileUrl}
                className={styles.linkButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 Xem tài liệu hướng dẫn dịch vụ
              </a>
            )}
          </article>

          {/* KHỐI 2: HƯỚNG DẪN CHO HỌC SINH */}
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{data.userTitle}</h3>
              <span className={`${styles.badge} ${styles.badgeStudent}`}>
                Học sinh
              </span>
            </header>
            {data.userSummaryMd && (
              <p className={styles.itemDescription}>{data.userSummaryMd}</p>
            )}
            {data.userGuideFileUrl && (
              <a
                href={data.userGuideFileUrl}
                className={styles.linkButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                🎓 Xem tài liệu dành cho học sinh
              </a>
            )}
          </article>
        </div>
      )}
    </section>
  );
};

export default HomeUserGuide;
