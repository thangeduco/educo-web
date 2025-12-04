import React, { useEffect, useMemo, useState } from "react";
import styles from "./HomeChatWidget.module.css";

type Mood =
  | "idle"
  | "happy"
  | "encourage"
  | "sad"
  | "thinking"
  | "celebrate"
  | "warning";

type Sender = "user" | "bot";

type MessageStatus = "normal" | "correct" | "incorrect";

interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  status?: MessageStatus; // dùng để trigger hiệu ứng đúng / sai
  createdAt: Date;
}

type Mode = "full" | "mini";

interface HomeChatWidgetProps {
  mode?: Mode; // full (mặc định) hoặc mini để overlay trên video
  upcomingQuizInSeconds?: number | null; // truyền từ player video nếu có
  onExpandFromMini?: () => void;
}

const QUICK_ACTIONS = [
  "Giải thích bước 1",
  "Cho ví dụ dễ hơn",
  "Cho bài luyện thêm",
  "Tóm tắt lại bài",
];

export const HomeChatWidget: React.FC<HomeChatWidgetProps> = ({
  mode = "full",
  upcomingQuizInSeconds,
  onExpandFromMini,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào! Mình là bạn đồng hành Toán học của bạn 💫. Hôm nay tụi mình cùng chinh phục thêm 1 chút nhé?",
      status: "normal",
      createdAt: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [mood, setMood] = useState<Mood>("idle");
  const [showFireworks, setShowFireworks] = useState(false);

  // mini hint cho chế độ video
  const miniHintText = useMemo(() => {
    if (upcomingQuizInSeconds == null) {
      return "Nhớ bấm pause nếu bạn cần hỏi mình bất kỳ lúc nào nhé! ⏸️✨";
    }
    if (upcomingQuizInSeconds <= 5) {
      return "Sắp đến đoạn có quiz rồi! Tập trung nhé, bạn làm được mà! 💪";
    }
    if (upcomingQuizInSeconds <= 15) {
      return "Chuẩn bị có quiz trong ít phút nữa, mình học tới đó rồi thử sức nha! 🎯";
    }
    return "Học từ từ thôi, tới quiz thì mình sẽ nhắc bạn lần nữa 😉";
  }, [upcomingQuizInSeconds]);

  // đổi mood nhẹ nhàng theo thời gian để avatar "sống"
  useEffect(() => {
    if (mood !== "idle") return;
    const timer = setInterval(() => {
      setMood((current) => (current === "idle" ? "thinking" : "idle"));
    }, 10000);
    return () => clearInterval(timer);
  }, [mood]);

  const scrollToBottom = () => {
    const container = document.getElementById("home-chat-scroll-container");
    if (!container) return;
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  };

  // gọi mỗi lần có message mới
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const addMessage = (msg: Omit<ChatMessage, "id" | "createdAt">) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        createdAt: new Date(),
        ...msg,
      },
    ]);
  };

  const simulateBotReply = (userText: string) => {
    // Demo logic: nếu text chứa "đúng" => coi như trả lời đúng
    // còn lại sẽ là hướng dẫn, khích lệ.
    const lower = userText.toLowerCase();
    let status: MessageStatus = "normal";
    let reply = "";

    if (lower.includes("đúng") || lower.includes("chính xác")) {
      status = "correct";
      reply =
        "Chuẩn luôn! 🎉 Bạn làm chính xác rồi. Thử giải thích lại bằng lời của bạn xem nhé?";
    } else if (lower.includes("sai") || lower.includes("khó")) {
      status = "incorrect";
      reply =
        "Không sao hết nha 😌. Sai chỗ này là bình thường. Mình tách nhỏ từng bước, đi thật chậm cùng nhau nhé.";
    } else if (
      lower.includes("giải thích bước 1") ||
      lower.includes("bước 1")
    ) {
      status = "normal";
      reply =
        "Bước 1, mình cùng xem đề bài yêu cầu gì đã nhé 🧐. Bạn thử đọc lại đề và gạch chân những dữ kiện quan trọng giúp mình.";
    } else if (lower.includes("ví dụ")) {
      status = "normal";
      reply =
        "Ok, mình cho một ví dụ gần gũi hơn nè. Hãy tưởng tượng bạn có 3/4 cái bánh pizza...";
    } else if (lower.includes("bài luyện")) {
      status = "normal";
      reply =
        "Mình sẽ gợi ý cho bạn 3 câu luyện tập tương tự để bạn thử sức nhé! 💪";
    } else if (lower.includes("tóm tắt")) {
      status = "normal";
      reply =
        "Tóm tắt nhanh nè: 1️⃣ Hiểu đề bài. 2️⃣ Xác định dạng toán. 3️⃣ Viết bước giải. 4️⃣ Kiểm tra lại kết quả.";
    } else {
      status = "normal";
      reply =
        "Mình nghe bạn đây 👂. Bạn cho mình biết bạn đang mắc ở bước nào, hay chỗ nào thấy khó nhất?";
    }

    // set mood & hiệu ứng theo status
    if (status === "correct") {
      setMood("celebrate");
      setShowFireworks(true);
      setTimeout(() => {
        setShowFireworks(false);
        setMood("happy");
      }, 1800);
    } else if (status === "incorrect") {
      setMood("encourage");
      setTimeout(() => setMood("thinking"), 2000);
    } else {
      setMood("thinking");
      setTimeout(() => setMood("idle"), 3000);
    }

    addMessage({
      sender: "bot",
      text: reply,
      status,
    });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();

    addMessage({
      sender: "user",
      text,
      status: "normal",
    });
    setInputValue("");
    setMood("thinking");

    // Ở đây bạn có thể thay bằng call API thực tế, sau đó map kết quả -> simulateBotReply
    setTimeout(() => {
      simulateBotReply(text);
    }, 600);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickActionClick = (action: string) => {
    setInputValue(action);
    // Có thể gửi luôn nếu muốn:
    // setTimeout(handleSend, 100);
  };

  const renderAvatarFace = () => {
    // class theo mood để CSS animate khác nhau
    const moodClass = {
      idle: styles.avatarIdle,
      happy: styles.avatarHappy,
      encourage: styles.avatarEncourage,
      sad: styles.avatarSad,
      thinking: styles.avatarThinking,
      celebrate: styles.avatarCelebrate,
      warning: styles.avatarWarning,
    }[mood];

    return (
      <div className={`${styles.avatar} ${moodClass}`}>
        <div className={styles.avatarFace}>
          <div className={styles.avatarEyes}>
            <span className={styles.eyeLeft}></span>
            <span className={styles.eyeRight}></span>
          </div>
          <div className={styles.avatarMouth}></div>
          <div className={styles.avatarBlushLeft}></div>
          <div className={styles.avatarBlushRight}></div>
        </div>
        <div className={styles.avatarBody}></div>
      </div>
    );
  };

  const renderMessageBubble = (message: ChatMessage) => {
    const isBot = message.sender === "bot";

    const bubbleClassNames = [
      styles.chatBubble,
      isBot ? styles.botBubble : styles.userBubble,
    ];

    if (message.status === "correct") {
      bubbleClassNames.push(styles.correctBubble);
    } else if (message.status === "incorrect") {
      bubbleClassNames.push(styles.incorrectBubble);
    }

    return (
      <div
        key={message.id}
        className={
          isBot ? styles.messageRowBot : styles.messageRowUser
        }
      >
        {isBot && (
          <div className={styles.messageAvatar}>
            {/* mini avatar trong chat bubble */}
            <div className={styles.miniAvatar}>
              <span className={styles.miniAvatarEyes}>^ ^</span>
              <span className={styles.miniAvatarMouth}>︶</span>
            </div>
          </div>
        )}
        <div className={bubbleClassNames.join(" ")}>
          {message.status === "correct" && (
            <div className={styles.bubbleTag}>🎉 Chính xác!</div>
          )}
          {message.status === "incorrect" && (
            <div className={styles.bubbleTag}>😌 Không sao đâu</div>
          )}
          <div className={styles.bubbleText}>{message.text}</div>
        </div>
      </div>
    );
  };

  if (mode === "mini") {
    // 💬 Chế độ mini overlay trên video
    return (
      <div className={styles.miniContainer}>
        <button
          type="button"
          className={styles.miniMain}
          onClick={onExpandFromMini}
        >
          <div className={styles.miniAvatarWrapper}>{renderAvatarFace()}</div>
          <div className={styles.miniSpeechBubble}>
            <div className={styles.miniLabel}>Bạn đồng hành Toán học</div>
            <div className={styles.miniHint}>{miniHintText}</div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatarWrapper}>{renderAvatarFace()}</div>
          <div className={styles.headerText}>
            <div className={styles.headerTitle}>Bạn đồng hành Toán học</div>
            <div className={styles.headerSubtitle}>
              Luôn ở đây để giúp bạn hiểu bài dễ hơn ✨
            </div>
          </div>
        </div>
      </div>

      <div
        id="home-chat-scroll-container"
        className={styles.messagesContainer}
      >
        {messages.map(renderMessageBubble)}
        {showFireworks && (
          <div className={styles.fireworksLayer}>
            <div className={`${styles.firework} ${styles.firework1}`} />
            <div className={`${styles.firework} ${styles.firework2}`} />
            <div className={`${styles.firework} ${styles.firework3}`} />
          </div>
        )}
      </div>

      <div className={styles.quickActions}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            className={styles.quickActionButton}
            onClick={() => handleQuickActionClick(action)}
          >
            {action === "Giải thích bước 1" && "🪜 "}
            {action === "Cho ví dụ dễ hơn" && "🌈 "}
            {action === "Cho bài luyện thêm" && "🎯 "}
            {action === "Tóm tắt lại bài" && "🧠 "}
            {action}
          </button>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          type="text"
          placeholder="Hãy nói cho mình biết bạn đang vướng ở đâu nhé…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={styles.sendButton}
          onClick={handleSend}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default HomeChatWidget;
