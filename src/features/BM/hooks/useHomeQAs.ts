// src/features/BM/hooks/useHomeQAs.ts
import { useEffect, useState } from 'react';
import { fetchHomeQAsApi } from '../api/homePageParamsApi';
import { HomePageQAsDto, HomePageQAItemDto } from '../model/home-page-param.dto';

type UseHomeQAsResult = {
  qas: HomePageQAsDto;
  loading: boolean;
  error: string | null;
  activeQuestion: HomePageQAItemDto | null;
  setActiveQuestionId: (id: string) => void;
  selectedAnswerType: 'yes' | 'no' | null;
  selectAnswer: (type: 'yes' | 'no') => void;
};

export function useHomeQAs(): UseHomeQAsResult {
  const [qas, setQas] = useState<HomePageQAsDto>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Câu hỏi đang được focus
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Câu trả lời đã chọn cho câu hỏi đang active: 'yes' | 'no'
  const [selectedAnswerType, setSelectedAnswerType] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const data = await fetchHomeQAsApi();

        if (!isMounted) return;

        setQas(data);
        // mặc định chọn câu hỏi đầu tiên nếu có
        if (data.length > 0) {
          setActiveQuestionId(data[0].id);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Có lỗi xảy ra khi tải danh sách câu hỏi.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const setActiveQuestionIdSafe = (id: string) => {
    setActiveQuestionId(id);
    // khi đổi câu hỏi, reset lựa chọn Có/Không
    setSelectedAnswerType(null);
  };

  const selectAnswer = (type: 'yes' | 'no') => {
    setSelectedAnswerType(type);
  };

  const activeQuestion =
    qas.find((item) => item.id === activeQuestionId) ?? (qas.length > 0 ? qas[0] : null);

  return {
    qas,
    loading,
    error,
    activeQuestion,
    setActiveQuestionId: setActiveQuestionIdSafe,
    selectedAnswerType,
    selectAnswer,
  };
}
