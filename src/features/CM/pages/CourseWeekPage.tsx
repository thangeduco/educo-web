import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CourseWeekPage.module.css";

import { CourseInfoHeader } from "../components/CourseInfoHeader";
import { CourseWeekSidebar } from "../components/CourseWeekSidebar";
import { CourseWeekDetailList } from "../components/CourseWeekDetailList";

import Header from "../../../app/layout/Header";
import LearningPlanModal from "../../LM/components/LearningPlanModal";

import { useCMCourseService } from "../hooks/useCMCourseService";
import type { BodyWeekDto, SidebarWeekDto } from "../model/CMCourseDto";

const FAKE_STUDENT_NAME = "Nguyễn Văn A";
// TODO: Sau này lấy từ UserContext hoặc API
const FAKE_STUDENT_ID = 1;

export const CourseWeekPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();

  const weekRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);
  const [isLearningPlanOpen, setIsLearningPlanOpen] = useState(false);

  const { course, loading, error } = useCMCourseService(courseCode || "");

  const bodyWeeks: BodyWeekDto[] = course?.body?.weeks ?? [];
  const sidebarWeeks: SidebarWeekDto[] = course?.sidebar?.weeks ?? [];

  // Set tuần được chọn mặc định = tuần đầu tiên khi load xong dữ liệu
  useEffect(() => {
    if (bodyWeeks.length > 0) {
      setSelectedWeekId(bodyWeeks[0].id);
    }
  }, [bodyWeeks]);

  const handleSelectWeek = (weekId: number, lessonId?: number) => {
    setSelectedWeekId(weekId);

    const weekIndex = bodyWeeks.findIndex((w) => w.id === weekId);
    if (weekIndex !== -1 && weekRefs.current[weekIndex]) {
      weekRefs.current[weekIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (lessonId) {
      const node = document.getElementById(`lesson-${lessonId}`);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleOpenLearningPlan = () => {
    setIsLearningPlanOpen(true);
  };

  const handleCloseLearningPlan = () => {
    setIsLearningPlanOpen(false);
  };

  const handleSubmitLearningPlan = (data: any) => {
    // TODO: Gọi API lưu mục tiêu & kế hoạch học tập
    console.log("Learning plan submitted:", data);
    setIsLearningPlanOpen(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.headerSpacer} />

      <main className={styles.mainContent}>
        {/* Section 1: Thông tin chung khoá học */}
        <section className={styles.sectionCourseInfo}>
          {loading && <div>Đang tải thông tin khoá học...</div>}
          {error && !loading && (
            <div className={styles.errorText}>
              Có lỗi khi tải dữ liệu khoá học: {error}
            </div>
          )}
          {!loading && !error && course && (
            <CourseInfoHeader
              courseTitle={course.header.title}
              courseDescription={course.header.description || ""}
              // Tạm thời: mục tiêu & tiến độ chưa có từ backend => để default
              targetFinishDate={"Chưa thiết lập"}
              completedLectures={0}
              totalLectures={course.header.totalVideoLessonsCount}
              completedHomeworks={0}
              totalHomeworks={course.header.totalWorksheetLessonsCount}
              remainingDays={0}
              onSetupLearningGoal={handleOpenLearningPlan}
            />
          )}
        </section>

        {/* Section 2 + 3: Layout 2 cột */}
        <section className={styles.sectionBody}>
          <aside className={styles.sidebarWrapper}>
            {loading && <div>Đang tải cấu trúc tuần/bài học...</div>}
            {error && !loading && (
              <div className={styles.errorText}>
                Không tải được cấu trúc tuần: {error}
              </div>
            )}
            {!loading && !error && sidebarWeeks.length > 0 && (
              <CourseWeekSidebar
                weeks={sidebarWeeks}
                selectedWeekId={selectedWeekId}
                onSelectWeek={handleSelectWeek}
              />
            )}
          </aside>

          <section className={styles.weekDetailWrapper}>
            {loading && <div>Đang tải nội dung chi tiết khoá học...</div>}
            {error && !loading && (
              <div className={styles.errorText}>
                Không tải được nội dung chi tiết: {error}
              </div>
            )}
            {!loading && !error && bodyWeeks.length > 0 && (
              <CourseWeekDetailList
                body={{ weeks: bodyWeeks }}
                weekRefs={weekRefs}
                studentId={FAKE_STUDENT_ID}
              />
            )}
          </section>
        </section>
      </main>

      <footer className={styles.appFooterPlaceholder}>
        FOOTER chung của educo-web
      </footer>

      {/* POPUP LẬP KẾ HOẠCH HỌC TẬP */}
      <LearningPlanModal
        isOpen={isLearningPlanOpen}
        onClose={handleCloseLearningPlan}
        studentName={FAKE_STUDENT_NAME}
        courseTitle={course?.header.title || ""}
        totalLessons={course?.header.totalVideoLessonsCount || 0}
        estimatedHours={0} // TODO: map từ estimatedLearningTime nếu muốn
        onSubmit={handleSubmitLearningPlan}
      />
    </div>
  );
};

export default CourseWeekPage;
