import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import './VideoChoiceQuizEvents.css';
import { VideoChoiceQuiz } from '../../models/video-events.model';
import { FeedbackAnimation } from '../animation/FeedbackAnimation';
import { logChoiceQuizAnswer } from '../../services/learningService';

interface VideoChoiceQuizProps {
  data: VideoChoiceQuiz[];
  onClose: () => void;
  studentId: number;              // 👈 thêm vào để log
  // thông tin courseId
  courseId: number;
  studentName?: string;
  triggerRefId?: number;
}

// 👇 mở rộng kiểu cho currentStep để hỗ trợ choice_quiz_image_url mà không cần sửa model gốc ngay lập tức
type QuizStepWithImage = VideoChoiceQuiz & {
  choice_quiz_image_url?: string | null;
};

export const VideoChoiceQuizEvents: React.FC<VideoChoiceQuizProps> = ({
  data,
  onClose,
  studentId,
  studentName = 'Con',
  triggerRefId = 0,
  courseId, // 👈 thêm vào để log
}) => {
  const [currentStepId, setCurrentStepId] = useState<number>(() => {
    if (!triggerRefId) return 0;
    const index = data.findIndex(q => q.quiz_id === triggerRefId);
    console.log('🔍 Trigger Ref ID:', triggerRefId, 'Found at index:', index);
    console.log('📊 Data. ----------------- -----------------------------:', data);
    return index !== -1 ? index : 0;
  });

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animationType, setAnimationType] = useState<string | null>(null);

  // ⏱️ đo thời gian trả lời cho mỗi câu hỏi
  const questionShownAtRef = useRef<number>(Date.now());
  const hasLoggedThisStepRef = useRef<boolean>(false);

  const currentStep = data[currentStepId] as QuizStepWithImage | undefined;

  // Reset timer & flag mỗi khi chuyển câu
  useEffect(() => {
    questionShownAtRef.current = Date.now();
    hasLoggedThisStepRef.current = false;
  }, [currentStepId]);

  // Phát audio mở đầu (nếu có) khi bước đầu tiên hiển thị
  useEffect(() => {
    if (
      currentStepId === 0 &&
      currentStep?.first_audio_url &&
      currentStep.first_audio_url.trim() !== ''
    ) {
      console.log('🔊 Playing first_audio_url:', currentStep.first_audio_url);
      const firstSound = new Howl({ src: [currentStep.first_audio_url] });
      firstSound.play();
    }
  }, [currentStepId, currentStep]);

  const handleChoiceClick = async (choiceId: string, correct: boolean) => {
    if (!currentStep) return;
    if (hasLoggedThisStepRef.current) return; // tránh double log khi spam click
    console.log(`📝 Student clicked: ${choiceId}, correct = ${correct}`);

    setSelectedChoiceId(choiceId);
    setIsCorrect(correct);

    // 🎞️ animation + audio feedback
    const audioUrl = correct
      ? currentStep?.correct_feedback_audio_url
      : currentStep?.wrong_feedback_audio_url;

    const animation = correct
      ? currentStep?.correct_feedback_animation
      : currentStep?.wrong_feedback_animation;

    setAnimationType(animation || null);
    // Nếu muốn tắt animation hiển thị UI (nhưng vẫn phát audio), uncomment:
    // setAnimationType(null);

    if (audioUrl && audioUrl.trim() !== '') {
      const feedbackSound = new Howl({
        src: [audioUrl],
        onend: () => {
          const isLast =
            (correct && !currentStep?.next_quiz_on_correct) ||
            (!correct && !currentStep?.next_quiz_on_wrong);

          if (
            isLast &&
            currentStep?.last_audio_url &&
            currentStep.last_audio_url.trim() !== ''
          ) {
            const lastSound = new Howl({ src: [currentStep.last_audio_url] });
            lastSound.play();
          }
        },
      });
      feedbackSound.play();
    }

    // ⏱️ Tính thời gian trả lời (giây, làm tròn)
    const elapsedMs = Date.now() - questionShownAtRef.current;
    const answeredInSeconds = Math.max(0, Math.round(elapsedMs / 1000));

    // 🧾 Ghi log qua learningService
    try {
      await logChoiceQuizAnswer({
        student_id: studentId,
        choice_quiz_id: currentStep.quiz_id, // 👈 id câu hỏi lựa chọn hiện tại
        selected_option: choiceId,
        is_correct: correct,
        answered_in_seconds: answeredInSeconds,
        course_id: courseId, // 👈 thêm course_id để phù hợp với API
      });
      hasLoggedThisStepRef.current = true;
      console.log('[VideoChoiceQuizEvents] ✅ Logged choice quiz answer');
    } catch (err) {
      console.error('[VideoChoiceQuizEvents] ❌ Failed to log choice quiz answer:', err);
      // Không chặn flow học nếu log lỗi
    }
  };

  const handleNextStep = () => {
    setSelectedChoiceId(null);
    setIsCorrect(null);
    setAnimationType(null);

    const nextId = isCorrect
      ? currentStep?.next_quiz_on_correct
      : currentStep?.next_quiz_on_wrong;

    if (!nextId) {
      onClose();
      return;
    }

    const nextIndex = data.findIndex((step) => step.quiz_id === nextId);
    if (nextIndex !== -1) {
      setCurrentStepId(nextIndex);
    } else {
      onClose();
    }
  };

  if (!currentStep) return null;

  const selectedChoice = currentStep.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="video-choice-quiz-overlay">
      {/* 1) Đầu tiên là quiz-popup-content */}
      <div className="quiz-popup-content">
        <div className="quiz-modal">
          <button className="quiz-close-button" onClick={onClose} aria-label="Đóng">×</button>

          {animationType && <FeedbackAnimation animationType={animationType} />}

          <div className="quiz-question-block">
            <p className="quiz-question">{currentStep.content}</p>

            {isCorrect !== null && (
              <div
                className={`question-feedback ${isCorrect ? 'correct-feedback' : 'wrong-feedback'}`}
              >
                {(isCorrect
                  ? currentStep.correct_feedback_text
                  : currentStep.wrong_feedback_text
                )?.replace('{studentName}', studentName)}
              </div>
            )}

            {isCorrect !== null && selectedChoice?.explanation && (
              <div className="choice-explanation explanation-zoom-in">
                💡 {selectedChoice.explanation}
              </div>
            )}
          </div>

          <div className="quiz-choices">
            {currentStep.choices.map((choice, idx) => {
              const isSelected = selectedChoiceId === choice.id;
              const isAnswer = choice.isCorrect;

              let className = 'quiz-choice';
              let icon: string | null = null;

              if (isCorrect !== null) {
                if (isSelected && isAnswer) {
                  className += ' correct-choice';
                  icon = '✅';
                } else if (isSelected && !isAnswer) {
                  className += ' wrong-choice';
                  icon = '❌';
                } else if (!isSelected && isAnswer) {
                  className += ' missed-correct-choice';
                  icon = '✅';
                }
              } else if (isSelected) {
                className += ' selected';
              }

              return (
                <button
                  key={`${currentStep.quiz_id}-${choice.id}-${idx}`}
                  className={className}
                  onClick={() => handleChoiceClick(choice.id, isAnswer)}
                  disabled={isCorrect !== null}
                >
                  <span className="choice-text">{choice.text}</span>
                  {icon && <span className="choice-icon">{icon}</span>}
                </button>
              );
            })}
          </div>

          {isCorrect !== null && (
            <button className="submit-button" onClick={handleNextStep}>
              {(!currentStep.next_quiz_on_correct && isCorrect) ||
              (!currentStep.next_quiz_on_wrong && !isCorrect)
                ? 'Kết thúc'
                : 'Tiếp tục'}
            </button>
          )}
        </div>
      </div>

      {/* 2) Sau đó là choice quiz image url nếu có */}
      {currentStep.choice_quiz_image_url && currentStep.choice_quiz_image_url.trim() !== '' && (
        <div className="quiz-choice-image-wrapper">
          <img
            className="quiz-choice-image"
            src={currentStep.choice_quiz_image_url}
            alt="Hình minh họa câu hỏi"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* 3) Các phần khác như hiện tại (không đổi thêm nội dung ngoài thứ tự) */}
    </div>
  );
};
