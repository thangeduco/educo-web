// src/features/BM/components/home/home_image_slides.tsx

import React from 'react';
import styles from './home_image_slides.module.css';

import type {
  HomePageImageSlideDto,
  HomePageImageItemDto,
} from '../../model/home-page-param.dto';

interface HomeImageSlidesProps {
  slides: HomePageImageSlideDto;
  loading: boolean;
  error: string | null;
  currentIndex: number;
  goToPrev: () => void;
  goToNext: () => void;
}

const HomeImageSlides: React.FC<HomeImageSlidesProps> = ({
  slides,
  loading,
  error,
  currentIndex,
  goToPrev,
  goToNext,
}) => {
  const total = slides.length;

  let centerSlide: HomePageImageItemDto | null = null;
  let leftSlide: HomePageImageItemDto | null = null;
  let rightSlide: HomePageImageItemDto | null = null;

  if (total > 0) {
    const safeIndex = Math.min(Math.max(currentIndex, 0), total - 1);
    const leftIndex = (safeIndex - 1 + total) % total;
    const rightIndex = (safeIndex + 1) % total;

    centerSlide = slides[safeIndex];
    leftSlide = slides[leftIndex];
    rightSlide = slides[rightIndex];
  }

  return (
    <div className={styles.container}>
      {loading && <p className={styles.statusText}>Đang tải hình ảnh...</p>}

      {error && !loading && (
        <p className={styles.errorText}>Có lỗi xảy ra: {error}</p>
      )}

      {!loading && !error && total === 0 && (
        <p className={styles.statusText}>
          Hiện chưa có hình ảnh nào để hiển thị.
        </p>
      )}

      {!loading && !error && total > 0 && centerSlide && (
        <div className={styles.sliderWrapper}>
          {/* LEFT SIDE */}
          {total > 1 && leftSlide && (
            <button
              type="button"
              className={`${styles.sideSlide} ${styles.sideLeft}`}
              aria-label="Xem slide trước"
              onClick={goToPrev}
            >
              <div className={styles.sideImageMaskLeft}>
                <img
                  src={leftSlide.imageUrl}
                  alt={leftSlide.title}
                  className={styles.sideImage}
                />
              </div>
            </button>
          )}

          {/* MAIN SLIDE */}
          <div className={styles.mainSlide}>
            <div className={styles.mainImageWrapper}>
              <img
                src={centerSlide.imageUrl}
                alt={centerSlide.title}
                className={styles.mainImage}
              />
            </div>

            <div className={styles.mainCaption}>
              <div className={styles.dotRow}>
                {slides.map((slide, idx) => (
                  <span
                    key={`${slide.title}-${idx}`}
                    className={`${styles.dot} ${
                      idx === currentIndex ? styles.dotActive : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          {total > 1 && rightSlide && (
            <button
              type="button"
              className={`${styles.sideSlide} ${styles.sideRight}`}
              aria-label="Xem slide tiếp"
              onClick={goToNext}
            >
              <div className={styles.sideImageMaskRight}>
                <img
                  src={rightSlide.imageUrl}
                  alt={rightSlide.title}
                  className={styles.sideImage}
                />
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeImageSlides;
