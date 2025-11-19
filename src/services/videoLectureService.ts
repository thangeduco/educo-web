// src/services/courseService.ts
import apiEducoreBE from './apiService';
import { VideoEvent } from '../models/video-events.model';

export const getVideoEvents = async (studentId: number, videoId: number): Promise<VideoEvent[]> => {
  console.log('[videoService] Gọi API lấy video quiz events:', videoId);
  try {
    const res = await apiEducoreBE.get(`/courses/${studentId}/${videoId}/video-events`);
    return res.data;
  } catch (error: any) {
    console.error('[videoService] Lỗi khi lấy video events:', error);
    throw new Error('Không thể tải video events');
  }
};

