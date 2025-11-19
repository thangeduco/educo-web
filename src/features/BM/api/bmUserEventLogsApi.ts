// src/features/BM/api/bmUserEventLogsApi.ts

import apiEducoreBE from '../../../services/apiService';
import type { UserEventLogPayload } from '../model/UserEventLogPayload';

// Endpoint ghi log user event (tenant_code nằm trong payload)
const USER_EVENT_LOGS_ENDPOINT = '/bm/user-event-logs';

/**
 * Gọi API POST /bm/user-event-logs để ghi log sự kiện người dùng.
 * Sử dụng apiEducoreBE để thống nhất với các API khác.
 */
export const postUserEventLogApi = async (
  payload: UserEventLogPayload
): Promise<void> => {
  try {
    await apiEducoreBE.post(USER_EVENT_LOGS_ENDPOINT, payload);
  } catch (error: any) {
    console.error(
      '[postUserEventLogApi] ❌ Lỗi khi ghi log user-event-logs:',
      error?.response?.data || error
    );
    // ở đây không throw để tránh làm vỡ trải nghiệm UI chỉ vì log fail
  }
};
