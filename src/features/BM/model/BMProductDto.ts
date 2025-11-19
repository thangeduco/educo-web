// src/features/BM/model/homeCourseDto.ts

/**
 * Một câu chuyện thành công của học sinh.
 * FE nhận từ API backend (snake_case).
 */
export interface BMProductSuccessStoryDto {
  image_url: string;   // ảnh học sinh (nằm trong avatar tròn)
  title: string;       // tiêu đề ngắn
  story: string;       // câu chuyện chi tiết
}

/**
 * DTO Khóa học trả về từ API educo-backend (snake_case)
 * GET /bm/products/courses
 */
export interface BMProductDto {
  id: number;

  product_code: string;
  product_type: string; // 'COURSE'

  name: string;
  product_title: string | null;
  tagline: string | null;
  description: string | null;
  thumbnail_url: string | null;

  tutorial_video_url: string | null;
  sale_kit_url: string | null;
  user_guide_link: string | null;

  /**
   * ⭐ NEW FIELD: success_stories
   * FE nhận mảng gồm 0..n câu chuyện học sinh đã thành công.
   */
  success_stories: BMProductSuccessStoryDto[] | null;

  grade: number | null;      // Lớp 1–12
  level: number | null;      // Cơ bản / Nâng cao / Chuyên
  category: string | null;   // Tự do
  subject: string | null;    // Toán, Anh, Lý,...

  price_amount: number | null;
  list_price_amount: number | null;
  price_currency: string | null;

  promotion_flag: boolean | null;
  promotion_note: string | null;

  sale_start_at: string | null;  // FE chỉ cần ISO string
  sale_end_at: string | null;
  access_start_at: string | null;
  access_end_at: string | null;

  access_duration_days: number | null;

  status: number;
  is_visible: boolean;
  display_order: number | null;

  target_student_desc: string | null;
  learning_outcome: string | null;

  metadata: any | null;

  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

/**
 * Danh sách khóa học.
 */
export type BMProductDtoList = BMProductDto[];
