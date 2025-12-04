// src/features/BM/components/home/home_qas.tsx

import React, { useEffect, useState, useMemo } from 'react';
import styles from './home_qas.module.css';

import RoleGreeting, { UserRole } from './RoleGreeting';

import {
  logHomeQasYesNoEvent,
  YesNoAnswerType,
} from '../../services/bmUserEventLogs.service';




import type {
  HomePageQAsDto,
  HomePageQAItemDto,
} from '../../model/home-page-param.dto';

interface HomeQAsProps {
  role: UserRole;
  qas: HomePageQAsDto | null | undefined;
  loading: boolean;
  error: string | null;
}

const HomeQAs: React.FC<HomeQAsProps> = ({ role, qas, loading, error }) => {
  // Lưu trạng thái đã chọn Có/Không cho từng câu hỏi
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, YesNoAnswerType | null>
  >({});

  // Khởi tạo state khi có danh sách câu hỏi
  useEffect(() => {
    if (!qas || qas.length === 0) return;

    setSelectedAnswers((prev) => {
      const next = { ...prev };
      qas.forEach((q) => {
        if (!(q.id in next)) {
          next[q.id] = null;
        }
      });
      return next;
    });
  }, [qas]);

  const handleSelectAnswer = (
    questionId: string | number,
    answer: YesNoAnswerType
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleClickAnswer = (item: HomePageQAItemDto, answer: YesNoAnswerType) => {
    handleSelectAnswer(item.id, answer);

    // Gọi service ghi log
    logHomeQasYesNoEvent({
      qaId: item.id,
      qaPrompt: item.prompt,
      answerType: answer,
      userRole: role || null,
    });
  };

  const hasQAs = !!qas && qas.length > 0;

  // Tính toán số câu đã trả lời & số câu trả lời "Có"
  const { answeredCount, yesCount } = useMemo(() => {
    const values = Object.values(selectedAnswers).filter(Boolean) as YesNoAnswerType[];
    const yes = values.filter((v) => v === 'yes').length;
    return {
      answeredCount: values.length,
      yesCount: yes,
    };
  }, [selectedAnswers]);

  const renderAnswerEmotionLabel = (answerType: YesNoAnswerType | null) => {
    if (!answerType) return null;

    if (answerType === 'yes') {
      return (
        <div className={styles.answerEmotionTag}>
          <span className={styles.answerEmotionDot} />
          <span>
            Đúng rồi, đây cũng là trăn trở của rất nhiều bố mẹ giống bạn.
          </span>
        </div>
      );
    }

    return (
      <div className={styles.answerEmotionTagNeutral}>
        <span className={styles.answerEmotionDotNeutral} />
        <span>
          Thật tuyệt, nhưng Educo vẫn có thể giúp con tiến bộ đều đặn hơn mỗi ngày.
        </span>
      </div>
    );
  };

  const renderAnswerHeading = (answerType: YesNoAnswerType | null) => {
    if (!answerType) return null;

    if (answerType === 'yes') {
      return (
        <p className={styles.answerHeading}>
          Educo có cách giúp bố mẹ tháo gỡ nỗi lo này:
        </p>
      );
    }

    return (
      <p className={styles.answerHeading}>
        Educo vẫn đồng hành để con giữ và nâng tầm kết quả:
        </p>
    );
  };

  return (
    <div className={styles.container}>
      {/* ==== TIÊU ĐỀ ==== */}
      <div className={styles.sectionHeader}>
        Bố mẹ đang trăn trở điều gì về việc học của con?
      </div>
      {/* ==== TRẠNG THÁI ==== */}
      {loading && <p className={styles.statusText}>Đang tải câu hỏi...</p>}
      {error && <p className={styles.errorText}>Có lỗi xảy ra: {error}</p>}
      {!loading && !error && !hasQAs && (
        <p className={styles.statusText}>
          Hiện chưa có câu hỏi nào để hiển thị.
        </p>
      )}

      {/* ==== DANH SÁCH Q&A ==== */}
      {!loading && !error && hasQAs && (
        <>
          <div className={styles.content}>
            {qas!.map((item) => {
              const selected = selectedAnswers[item.id];
              const answer =
                selected && item.answers ? item.answers[selected] : null;

              const hasSelected = !!selected;

              return (
                <div
                  key={item.id}
                  className={`${styles.qaRow} ${
                    hasSelected ? styles.qaRowAnswered : ''
                  }`}
                >
                  {/* Cột trái: CÂU HỎI */}
                  <section
                    className={`${styles.leftPane} ${
                      hasSelected ? styles.leftPaneActive : ''
                    }`}
                  >
                    <div className={styles.questionRow}>
                      <span className={styles.questionOrder}>
                        {item.display_order}.
                      </span>
                      <span className={styles.questionText}>
                        {item.prompt}
                      </span>
                    </div>
                  </section>

                  {/* Cột giữa: chỉ 2 nút CÓ / KHÔNG */}
                  <section className={styles.centerPane}>
                    <div className={styles.actionsRow}>
                      <button
                        className={`${styles.answerButton} ${
                          selected === 'yes'
                            ? styles.answerButtonActiveYes
                            : styles.answerButtonYes
                        }`}
                        onClick={() => handleClickAnswer(item, 'yes')}
                      >
                        Có
                      </button>
                      <button
                        className={`${styles.answerButton} ${
                          selected === 'no'
                            ? styles.answerButtonActiveNo
                            : styles.answerButtonNo
                        }`}
                        onClick={() => handleClickAnswer(item, 'no')}
                      >
                        Không
                      </button>
                    </div>
                  </section>

                  {/* Cột phải: câu trả lời tương ứng với câu hỏi & lựa chọn */}
                  <section className={styles.rightPane}>
                    {answer ? (
                      <div className={styles.answerCard}>
                        {renderAnswerEmotionLabel(selected || null)}
                        {renderAnswerHeading(selected || null)}
                        <p
                          className={`${styles.answerBody} ${
                            selected === 'yes'
                              ? styles.answerBodyYes
                              : selected === 'no'
                              ? styles.answerBodyNo
                              : ''
                          }`}
                        >
                          {answer.bodyMd}
                        </p>
                      </div>
                    ) : (
                      <div className={styles.answerPlaceholder}>
                        Hãy chọn <strong>Có</strong> hoặc{' '}
                        <strong>Không</strong> để xem Educo thấu hiểu và có thể
                        giúp gì trong tình huống này.
                      </div>
                    )}
                  </section>
                </div>
              );
            })}
          </div>

          {/* ==== BLOCK GREETING ==== */}
          {role && (
            <div className={styles.roleWrapper}>
              <RoleGreeting role={role} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeQAs;
