import React, { useState } from 'react';
import styles from './WorksheetItem.module.css';
import { useUser } from '../../../app/context/UserContext';
import { submitWorksheetWithFile } from '../../../services/learningService';
import { WorksheetLearning } from '../../../services/dtos/student-course-detail.dto';

interface WorksheetItemProps {
  courseId: string;
  weekId: number; // ✅ Thêm dòng này
  content: WorksheetLearning;
  isGuest: boolean;
}

const WorksheetItem: React.FC<WorksheetItemProps> = ({ courseId, weekId, content, isGuest }) => {
  const { user } = useUser();
  const {
    content_id,
    content_step,
    worksheet_title,
    worksheet_url,
    submission_count: initialCount = 0,
    highest_score = '-',
  } = content;

  const [submitting, setSubmitting] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(initialCount);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (isGuest) {
      alert('🔐 Vui lòng đăng nhập để nộp bài tập.');
      return;
    }

    if (!file || !user || !worksheet_url || !worksheet_title) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('submission_file', file);
      formData.append('student_id', String(user.id));
      formData.append('worksheet_id', String(content_id));
      formData.append('course_id', String(courseId));
      formData.append('course_week_id', String(weekId)); // ✅ Thêm dòng này

      await submitWorksheetWithFile(formData);

      alert('✅ Nộp bài thành công!');
      setSubmissionCount(prev => prev + 1);
    } catch (err) {
      console.error('[WorksheetItem] ❌ Lỗi khi nộp bài:', err);
      alert('❌ Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
      e.target.value = '';
    }
  };

  if (!worksheet_title || !worksheet_url) return null;

  return (
    <>
      <div className={styles.worksheetLesson}>
        <div className={styles.worksheetTitle}>
          📄 {content_step}: {worksheet_title}
        </div>
        <div className={styles.worksheetActions}>
          <a
            href={isGuest ? undefined : worksheet_url}
            onClick={(e) => {
              if (isGuest) {
                e.preventDefault();
                alert('🔐 Vui lòng đăng nhập để tải bài tập.');
              }
            }}
            download
            className={styles.downloadButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            📥 Tải bài tập tự làm
          </a>

          <label className={styles.uploadLabel}>
            {submitting ? 'Đang nộp...' : '📤 Nộp bài tập'}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className={styles.uploadInput}
              disabled={submitting || isGuest}
            />
          </label>
        </div>
      </div>

      <div className={styles.worksheetMeta}>
        <div className={styles.lessonMetaRow}>📝 Số lần làm: {submissionCount}</div>
        <div className={styles.lessonMetaRow}>🎯 Điểm cao nhất: {highest_score}</div>
      </div>
    </>
  );
};

export default WorksheetItem;
