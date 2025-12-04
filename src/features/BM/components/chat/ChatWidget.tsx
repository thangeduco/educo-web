import React, { useEffect, useState, KeyboardEvent } from 'react';
import styles from './ChatWidget.module.css';
import { chatAblyService } from '../../services/chat_ably.service';

type ChatEntry = {
  id: string;
  from: 'user' | 'server';
  text: string;
};

type ChatWidgetProps = {
  studentName?: string;
  avatarName?: string;
};

const ChatWidget: React.FC<ChatWidgetProps> = ({
  studentName,
  avatarName = 'Miu',
}) => {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // chỉ bật 1 lần khi chat đầu
  const [isMinimized, setIsMinimized] = useState(false); // thu nhỏ cửa sổ chat

  const displayStudentName =
    studentName?.trim()?.length ? studentName.trim() : 'Bạn';

  const displayAvatarName =
    avatarName?.trim()?.length ? avatarName.trim() : 'Miu';

  useEffect(() => {
    chatAblyService.init();

    const unsubscribe = chatAblyService.subscribeToServerMessages((text) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          from: 'server',
          text,
        },
      ]);
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // ⭐ Chỉ lần chat đầu tiên mới mở rộng kích thước
    if (!isExpanded) {
      setIsExpanded(true);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        from: 'user',
        text: trimmed,
      },
    ]);
    setInput('');

    try {
      await chatAblyService.sendUserMessage(trimmed);
    } catch (err) {
      console.error('[ChatWidget] Error sending message:', err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div
      className={[
        styles.chatWidget,
        isExpanded ? styles.chatWidgetLarge : '',
        isMinimized ? styles.chatWidgetMinimized : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderAvatar}>
          <div className={styles.avatarBubble}>
            <div className={styles.avatarFace}>^‿^</div>
            <div className={styles.avatarName}>{displayAvatarName}</div>
            <div className={styles.avatarGlow} />
          </div>
        </div>

        <div className={styles.chatHeaderText}>
          <span className={styles.headerAvatar}>
            {`${displayStudentName} có hỏi gì ${displayAvatarName} không ?`}
          </span>
        </div>

        {/* Nút thu nhỏ / mở rộng */}
        <button
          type="button"
          className={styles.chatMinimizeBtn}
          onClick={handleToggleMinimize}
        >
          {isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
        </button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.chatMessage} ${
              m.from === 'user'
                ? styles.chatMessageUser
                : styles.chatMessageServer
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className={styles.chatInputRow}>
        <input
          className={styles.chatInput}
          placeholder="Nhập câu hỏi của bạn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.chatSendBtn} onClick={handleSend}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
