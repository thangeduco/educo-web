// src/features/BM/services/chat_ably.service.ts
import Ably from 'ably';

const CHANNEL_NAME = 'educo-chat';
const USER_EVENT = 'user-message';
const SERVER_EVENT = 'server-reply';

// 🔥 Backend URL (dev) – bạn có thể đưa vào env FE sau
const ABLY_AUTH_URL =
  'http://localhost:3100/api/ably/auth';

export type ServerMessageHandler = (text: string) => void;

class ChatAblyService {
  private client: any = null;
  private channel: any = null;

  init() {
    if (this.client) return;

    console.log(
      '[ChatAblyService] Initializing Ably client (frontend, token)...'
    );

    this.client = new Ably.Realtime({
      authUrl: ABLY_AUTH_URL, // 👈 dùng absolute URL
    });

    this.client.connection.on((stateChange: any) => {
      console.log(
        '[ChatAblyService] Connection state:',
        stateChange.current,
        stateChange.reason || ''
      );
    });

    this.channel = this.client.channels.get(CHANNEL_NAME);
    console.log(
      `[ChatAblyService] Using channel "${CHANNEL_NAME}" on FE side`
    );
  }

  subscribeToServerMessages(handler: ServerMessageHandler): () => void {
    if (!this.channel) {
      throw new Error(
        '[ChatAblyService] Channel not initialized. Call init() first.'
      );
    }

    const wrapped = (message: any) => {
      console.log(
        '[ChatAblyService] Received server message:',
        message.data
      );
      handler(String(message.data));
    };

    this.channel.subscribe(SERVER_EVENT, wrapped);

    return () => {
      this.channel?.unsubscribe(SERVER_EVENT, wrapped);
    };
  }

  async sendUserMessage(text: string): Promise<void> {
    if (!this.channel) {
      throw new Error(
        '[ChatAblyService] Channel not initialized. Call init() first.'
      );
    }

    const payload = {
      text,
      sentAt: new Date().toISOString(),
    };

    console.log('[ChatAblyService] Publishing user message:', payload);
    await this.channel.publish(USER_EVENT, payload);
  }

  disconnect() {
    if (this.client) {
      console.log('[ChatAblyService] Closing Ably connection...');
      this.client.connection.close();
      this.client = null;
      this.channel = null;
    }
  }
}

export const chatAblyService = new ChatAblyService();
