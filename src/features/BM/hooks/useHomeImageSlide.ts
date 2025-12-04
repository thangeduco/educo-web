// src/features/BM/hooks/useHomeImageSlides.ts
import { useEffect, useState } from 'react';
import { fetchHomeImageSlideApi } from '../api/homePageParamsApi';
import {
  HomePageImageSlideDto,
} from '../model/home-page-param.dto';

type UseHomeImageSlidesResult = {
  slides: HomePageImageSlideDto;   // 👈 chỉ là 1 mảng item, không phải mảng của mảng
  loading: boolean;
  error: string | null;
  currentIndex: number;
  goToPrev: () => void;
  goToNext: () => void;
};

export function useHomeImageSlide(): UseHomeImageSlidesResult {
  // 👇 khởi tạo là mảng rỗng các item
  const [slides, setSlides] = useState<HomePageImageSlideDto>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const data = await fetchHomeImageSlideApi(); // Promise<HomePageImageSlideDto>

        if (!isMounted) return;

        setSlides(data);

        // Nếu có >= 3 slide thì đặt trung tâm là slide thứ 3 (index 2)
        if (data.length > 2) {
          setCurrentIndex(2);
        } else {
          setCurrentIndex(0);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Có lỗi xảy ra khi tải danh sách hình ảnh.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = slides.length;

  const goToPrev = () => {
    if (!total) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToNext = () => {
    if (!total) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return {
    slides,
    loading,
    error,
    currentIndex,
    goToPrev,
    goToNext,
  };
}
