
export type BMConfigParamDto = {
  paramId: number;           // map từ cột id (BIGINT)
  paramKey: string;     // map từ cột param_key
  paramValue: any;      // map từ cột param_value (JSONB)
  paramDesc?: string | null; // map từ cột param_desc
  status: number;     // map từ cột is_active (Y/N hoặc kiểu khác do anh quy ước)
  createdAt: Date;      // map từ cột created_at
  updatedAt: Date;      // map từ cột updated_at
};

export type HomePageImageItemDto = {
  title: string;
  linkUrl: string;
  imageUrl: string;
  subtitle?: string;
  display_order: number;
};
export type HomePageImageSlideDto = HomePageImageItemDto[];



export type HomePageQAAnswerDto = {
  title: string;
  bodyMd: string;
  ctaUrl: string;
  ctaText: string;
};
export type HomePageQAItemDto = {
  id: string;
  prompt: string;
  answers: {
    no: HomePageQAAnswerDto;
    yes: HomePageQAAnswerDto;
  };
  display_order: number;
};
export type HomePageQAsDto = HomePageQAItemDto[];


export type HomePageCourseItemDto = {
  grade: number;
  title: string;
  courseCode: string;
  coverUrl: string;
  localPath: string | null;
  display_order: number;
};
export type HomePageCoursesDto = HomePageCourseItemDto[];

export type HomePageAchievementDto = {
  title: string;           // Tiêu đề phần thành tựu ("Thành tựu của Educo")
  intro: string;           // Đoạn mô tả mở đầu
  highlights: string[];    // Danh sách bullet-point thành tựu
  note?: string;           // Ghi chú nhỏ (không bắt buộc)
};
