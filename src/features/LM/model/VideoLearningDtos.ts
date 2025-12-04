// src/features/LM/model/VideoLearningDtos.ts

/**
 * ===========================
 * Start Video Session DTOs
 * ===========================
 */

/**
 * Dùng để gọi API start video session:
 * POST /lm/video-sessions/start
 */
export interface StartVideoSessionInput {
  studentId: number;
  videoId: number;
  startSecond: number;
  /**
   * optional – FE có thể gửi lên, hoặc bỏ trống,
   * backend vẫn dùng NOW() cho started_at nếu rỗng
   */
  startedAt?: string;
  deviceType?: string;
}

export interface StartVideoSessionOutput {
  success: boolean;
  sessionId?: number;
  message?: string;
}

/**
 * ===========================
 * Stop Video Session DTOs
 * ===========================
 */

/**
 * Dùng để gọi API stop video session:
 * POST /lm/video-sessions/stop
 */
export interface StopVideoSessionInput {
  sessionId: number;
  stopSecond: number;
}

export interface StopVideoSessionOutput {
  success: boolean;
  message?: string;
}

/**
 * ===========================
 * Video Progress DTO
 * (dùng cho API getProgress nếu sau này cần)
 * ===========================
 */

export interface VideoProgressDto {
  videoId: number;
  studentId: number;
  lastWatchSecond: number;
  completionPercent: number;
  timesCompleted: number;
  lastWatchedAt?: string; // ISO datetime
}

export interface GetVideoProgressInput {
  studentId: number;
  videoId: number;
}

export interface GetVideoProgressOutput {
  progress?: VideoProgressDto;
}
