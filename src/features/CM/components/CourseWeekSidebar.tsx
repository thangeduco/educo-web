import React from "react";
import styles from "./CourseWeekSidebar.module.css";
import type { SidebarWeekDto } from "../model/CMCourseDto";

interface CourseWeekSidebarProps {
  weeks: SidebarWeekDto[];
  selectedWeekId: number | null;
  onSelectWeek: (weekId: number, lessonId?: number) => void;
}

export const CourseWeekSidebar: React.FC<CourseWeekSidebarProps> = ({
  weeks,
  selectedWeekId,
  onSelectWeek,
}) => {
  const scrollToLesson = (lessonId: number) => {
    const el = document.getElementById(`lesson-${lessonId}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.weekList}>
        {weeks.map((week) => {
          const isSelected = week.id === selectedWeekId;

          return (
            <div
              key={week.id}
              className={`${styles.weekBlock} ${
                isSelected ? styles.weekBlockSelected : ""
              }`}
              onClick={() => onSelectWeek(week.id)} // 👉 click vùng tuần
            >
              <div className={styles.weekHeader}>
                <span className={styles.weekTitle}>Tuần {week.weekNumber}</span>
                <span className={styles.weekSubTitle}>{week.title}</span>
              </div>

              <div className={styles.lessonList}>
                {week.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={styles.lessonItem}
                    onClick={(e) => {
                      // 👉 không cho event nổi lên weekBlock
                      e.stopPropagation();
                      // đảm bảo tuần được chọn
                      onSelectWeek(week.id, lesson.id);
                      // scroll tới đúng bài học
                      scrollToLesson(lesson.id);
                    }}
                  >
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseWeekSidebar;
