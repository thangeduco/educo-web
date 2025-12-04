import React from "react";
import styles from "./CourseInfoHeader.module.css";

interface CourseInfoHeaderProps {
  courseTitle: string;        // Tên khoá học (dòng 1, bôi đậm, highlight)
  courseDescription: string;  // Mô tả khoá học (dòng 2)

  targetFinishDate: string;

  completedLectures: number;
  totalLectures: number;

  completedHomeworks: number;
  totalHomeworks: number;

  remainingDays: number;

  onSetupLearningGoal?: () => void;
}

export const CourseInfoHeader: React.FC<CourseInfoHeaderProps> = ({
  courseTitle,
  courseDescription,
  targetFinishDate,
  completedLectures,
  totalLectures,
  completedHomeworks,
  totalHomeworks,
  remainingDays,
  onSetupLearningGoal,
}) => {
  const remainingLectures = Math.max(totalLectures - completedLectures, 0);
  const remainingHomeworks = Math.max(totalHomeworks - completedHomeworks, 0);

  return (
    <div className={styles.headerWrapper}>
      {/* CỘT 1: Title + Description khoá học */}
      <div className={styles.colCourseInfo}>
        <h1 className={styles.courseName}>{courseTitle}</h1>
        <p className={styles.courseDescription}>{courseDescription}</p>
      </div>

      {/* CỘT 2: Nút Thiết lập mục tiêu (dòng trên cùng, sát lề phải) */}
      <div className={styles.colGoalButton}>
        <button
          type="button"
          className={styles.goalButton}
          onClick={() => onSetupLearningGoal?.()}
        >
          <span className={styles.goalButtonIcon}>🎯</span>
          <span>Thiết lập mục tiêu</span>

          {/* Tooltip hiển thị khi hover */}
          <div className={styles.goalTooltip}>
            <div>1. Thiết lập mục tiêu học tập.</div>
            <div>2. Xây dựng kế hoạch học tập.</div>
          </div>
        </button>
      </div>

      {/* CỘT 3: 3 dòng thông tin mục tiêu / hoàn thành hiện tại */}
      <div className={styles.colInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            1. Mục tiêu hoàn thành:&nbsp;
          </span>
          <span className={styles.infoValue}>{targetFinishDate}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            2. Số bài giảng hoàn thành:&nbsp;
          </span>
          <span className={styles.infoValue}>
            {completedLectures}/{totalLectures}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            3. Số bài tập về nhà hoàn thành:&nbsp;
          </span>
          <span className={styles.infoValue}>
            {completedHomeworks}/{totalHomeworks}
          </span>
        </div>
      </div>

      {/* CỘT 4: 3 dòng thông tin số ngày & số bài cần hoàn thành */}
      <div className={styles.colInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            1. Số ngày còn lại để hoàn thành mục tiêu:&nbsp;
          </span>
          <span className={styles.infoValue}>{remainingDays} ngày</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            2. Số bài giảng cần hoàn thành:&nbsp;
          </span>
          <span className={styles.infoValue}>
            {remainingLectures}/{totalLectures}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>
            3. Số bài tập về nhà cần hoàn thành:&nbsp;
          </span>
          <span className={styles.infoValue}>
            {remainingHomeworks}/{totalHomeworks}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoHeader;
