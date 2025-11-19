// src/features/BM/model/homeQAs.ts

export type HomeQAAnswerDto = {
  title: string;
  bodyMd: string;
  ctaUrl: string;
  ctaText: string;
};

export type HomeQAItemDto = {
  id: string;
  prompt: string;
  answers: {
    no: HomeQAAnswerDto;
    yes: HomeQAAnswerDto;
  };
  display_order: number;
};

export type HomeQAsDto = HomeQAItemDto[];
