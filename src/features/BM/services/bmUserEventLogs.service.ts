// src/features/BM/services/bmUserEventLogs.service.ts

import { BM_TENANT_ZONE } from '../config/bmConfig';
import { postUserEventLogApi } from '../api/bmUserEventLogsApi';
import type { UserEventLogPayload } from '../model/UserEventLogPayload';
import { getClientContext } from './middware.service';

export type YesNoAnswerType = 'yes' | 'no';

interface LogHomeQasYesNoParams {
  qaId: string | number;
  qaPrompt: string;
  answerType: YesNoAnswerType;
  userRole: string | null;
}

/**
 * Dịch vụ ghi log sự kiện click Có/Không ở màn Home QAs.
 */
export async function logHomeQasYesNoEvent(
  params: LogHomeQasYesNoParams
): Promise<void> {
  try {
    const ctx = getClientContext();

    const payload: UserEventLogPayload = {
      tenant_code: BM_TENANT_ZONE,

      user_id: null,
      user_role: params.userRole,

      session_id: null,
      event_name: 'bm_home_qas_click_yes_no',
      event_type: 'click',
      event_category: 'BM_HOME_QAS',
      event_label: params.qaPrompt,
      event_value: params.answerType,

      object_type: 'bm_home_qa',
      object_id: Number(params.qaId) || null,

      page_url: ctx.page_url,
      referrer_url: ctx.referrer_url,

      client_ip: null, // backend tự lấy từ header
      client_user_agent: ctx.client_user_agent,
      client_device_type: ctx.client_device_type,
      client_device_id: null,

      client_os_name: ctx.client_os_name,
      client_os_version: ctx.client_os_version,

      client_browser_name: ctx.client_browser_name,
      client_browser_version: ctx.client_browser_version,

      client_app_name: 'educo-web',
      client_app_version: ctx.client_app_version,

      client_language: ctx.client_language,
      client_timezone: ctx.client_timezone,
      client_screen_width: ctx.client_screen_width,
      client_screen_height: ctx.client_screen_height,

      metadata_json: {
        source: 'home_qas',
      },

      event_time: new Date().toISOString(),
    };

    void postUserEventLogApi(payload);
  } catch (err) {
    console.error('[logHomeQasYesNoEvent] ❌ Unexpected error:', err);
  }
}
