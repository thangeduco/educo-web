// src/features/BM/model/homeUserGuideDto.ts

/**
 * DTO Home User Guide trả về từ API educo-backend:
 *   GET /bm/home/user-guide
 *
 * Dùng để hiển thị hướng dẫn sử dụng dịch vụ & hướng dẫn cho người dùng.
 */

export interface HomeUserGuideDto {
  // Hướng dẫn cho dịch vụ (phụ huynh)
  serviceTitle: string;
  serviceSummaryMd: string;
  serviceGuideFileUrl: string;

  // Hướng dẫn cho học sinh/người dùng
  userTitle: string;
  userSummaryMd: string;
  userGuideFileUrl: string;
}
