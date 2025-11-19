// src/features/BM/components/home/home_image_slides.tsx

import React from 'react';
import styles from './home_image_slides.module.css';

import type {
  HomeImageSlideItemDto,
} from '../../model/HomeImageSlideItemDto';

interface HomeImageSlidesProps {
  slides: HomeImageSlideItemDto[];
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

  let centerSlide: HomeImageSlideItemDto | null = null;
  let leftSlide: HomeImageSlideItemDto | null = null;
  let rightSlide: HomeImageSlideItemDto | null = null;

  if (total > 0) {
    const leftIndex = (currentIndex - 1 + total) % total;
    const rightIndex = (currentIndex + 1) % total;

    centerSlide = slides[currentIndex];
    leftSlide = slides[leftIndex];
    rightSlide = slides[rightIndex];
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        Educo đồng hành cùng bố mẹ, biến trăn trở thành tiến bộ mỗi ngày của con
      </div>

      {/* TRẠNG THÁI LOADING / ERROR / EMPTY */}
      {loading && (
        <p className={styles.statusText}>
          Đang tải hình ảnh...
        </p>
      )}

      {error && !loading && (
        <p className={styles.errorText}>
          Có lỗi xảy ra: {error}
        </p>
      )}

      {!loading && !error && total === 0 && (
        <p className={styles.statusText}>
          Hiện chưa có hình ảnh nào để hiển thị.
        </p>
      )}

      {/* SLIDER CHỈ HIỂN THỊ KHI CÓ ÍT NHẤT 1 SLIDE */}
      {!loading && !error && total > 0 && centerSlide && (
        <div className={styles.sliderWrapper}>
          {/* PHẦN TRÁI: nếu có từ 2 slide */}
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

          {/* PHẦN GIỮA */}
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

          {/* PHẦN PHẢI: nếu có từ 2 slide */}
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
