// src/features/LM/hook/useLMLearningService.ts

import { useState, useCallback } from 'react';
import {
  startVideoSessionApi,
  stopVideoSessionApi,
} from '../api/lmLearningServiceApi';

import type {
  StartVideoSessionInput,
  StartVideoSessionOutput,
  StopVideoSessionInput,
  StopVideoSessionOutput,
} from '../model/VideoLearningDtos';

export interface UseLMLearningServiceResult {
  sessionId: number | null;
  loading: boolean;
  error: string | null;

  startVideoSession: (
    payload: StartVideoSessionInput
  ) => Promise<StartVideoSessionOutput | null>;

  stopVideoSession: (
    payload: StopVideoSessionInput
  ) => Promise<StopVideoSessionOutput | null>;
}

/**
 * useLMLearningService
 * Hook gọi API start/stop video learning từ backend LM.
 */
export function useLMLearningService(): UseLMLearningServiceResult {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gọi API startVideoSession
   * - Tạo phiên xem mới
   * - Lưu sessionId vào state
   */
  const startVideoSession = useCallback(
    async (payload: StartVideoSessionInput): Promise<StartVideoSessionOutput | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await startVideoSessionApi(payload);

        if (result.success && result.sessionId) {
          setSessionId(result.sessionId);
        } else {
          setError(result.message ?? 'Không thể bắt đầu phiên xem video.');
        }

        return result;
      } catch (err: any) {
        console.error('[useLMLearningService][startVideoSession] ❌ Error', err);
        setError(err?.message || 'Lỗi khi gọi API startVideoSession.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Gọi API stopVideoSession
   * - Kết thúc phiên xem đã bắt đầu
   */
  const stopVideoSession = useCallback(
    async (payload: StopVideoSessionInput): Promise<StopVideoSessionOutput | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await stopVideoSessionApi(payload);

        if (!result.success) {
          setError(result.message ?? 'Không thể kết thúc phiên xem video.');
        }

        return result;
      } catch (err: any) {
        console.error('[useLMLearningService][stopVideoSession] ❌ Error', err);
        setError(err?.message || 'Lỗi khi gọi API stopVideoSession.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    sessionId,
    loading,
    error,
    startVideoSession,
    stopVideoSession,
  };
}
