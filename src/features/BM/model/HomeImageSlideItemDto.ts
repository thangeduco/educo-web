// src/features/BM/model/homeImageSlideDto.ts

export type HomeImageSlideItemDto = {
  title: string;
  linkUrl: string;
  imageUrl: string;
  subtitle?: string;
  display_order: number;
};

export type HomeImageSlidesDto = HomeImageSlideItemDto[];
