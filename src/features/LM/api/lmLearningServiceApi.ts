// src/features/LM/api/lmLearningServiceApi.ts

import apiEducoreBE from '../../../services/apiService';

import type {
  StartVideoSessionInput,
  StartVideoSessionOutput,
  StopVideoSessionInput,
  StopVideoSessionOutput,
} from '../model/VideoLearningDtos';

/**
 * Endpoint backend LM:
 * POST /lm/video-sessions/start
 * POST /lm/video-sessions/stop
 *
 * Backend mounted at:
 *   app.use('/api/lm', lmRouter)
 */

// =====================
// ENDPOINT BUILDERS
// =====================

const LM_VIDEO_SESSION_START_ENDPOINT = `/lm/video-sessions/start`;
const LM_VIDEO_SESSION_STOP_ENDPOINT = `/lm/video-sessions/stop`;

// =====================
// API CALLERS
// =====================

/**
 * Gọi API Start Video Session:
 * POST /lm/video-sessions/start
 */
export const startVideoSessionApi = async (
  payload: StartVideoSessionInput
): Promise<StartVideoSessionOutput> => {
  try {
    const response = await apiEducoreBE.post(
      LM_VIDEO_SESSION_START_ENDPOINT,
      payload
    );

    return response.data as StartVideoSessionOutput;
  } catch (error: any) {
    console.error(
      '[startVideoSessionApi] ❌ Lỗi khi gọi API start video session:',
      error?.response?.data || error
    );
    throw error;
  }
};

/**
 * Gọi API Stop Video Session:
 * POST /lm/video-sessions/stop
 */
export const stopVideoSessionApi = async (
  payload: StopVideoSessionInput
): Promise<StopVideoSessionOutput> => {
  try {
    const response = await apiEducoreBE.post(
      LM_VIDEO_SESSION_STOP_ENDPOINT,
      payload
    );

    return response.data as StopVideoSessionOutput;
  } catch (error: any) {
    console.error(
      '[stopVideoSessionApi] ❌ Lỗi khi gọi API stop video session:',
      error?.response?.data || error
    );
    throw error;
  }
};
