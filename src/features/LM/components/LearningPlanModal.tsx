// src/features/LM/components/LearningPlanModal.tsx
import React, { useMemo, useState } from "react";
import styles from "./LearningPlanModal.module.css";

// Cho phép 1–7 buổi / tuần
type WeeklyLessonsOption = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface TimeSlot {
  dayOfWeek: string;
  startTime1: string; // "HH:MM"
  startTime2: string; // "HH:MM"
}

interface LearningPlanModalProps {
  isOpen: boolean;
  onClose: () => void;

  studentName: string; // Ví dụ: "Nguyễn Văn A"
  courseTitle: string; // Title khoá học
  totalLessons: number; // N bài
  estimatedHours: number; // X giờ (tổng thời lượng khoá học)

  startDate?: Date;

  onSubmit?: (data: {
    weeklyLessons: WeeklyLessonsOption | null;
    numberOfWeeks: number | null;
    finishDate: Date | null;
    timeSlots: TimeSlot[];
  }) => void;
}

const daysOfWeek: string[] = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

function formatDate(date: Date | null): string {
  if (!date) return "-";
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  const daysToAdd = (weeks - 1) * 7;
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function calcEndTime(startTime: string, hoursToAdd: number): string {
  if (!startTime) return "";
  const [hh, mm] = startTime.split(":").map((v) => parseInt(v, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return "";
  let newHour = hh + hoursToAdd;
  if (newHour >= 24) {
    newHour = newHour % 24;
  }
  const hhStr = newHour.toString().padStart(2, "0");
  const mmStr = mm.toString().padStart(2, "0");
  return `${hhStr}:${mmStr}`;
}

export const LearningPlanModal: React.FC<LearningPlanModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  totalLessons,
  estimatedHours,
  startDate,
  onSubmit,
}) => {
  const [weeklyLessons, setWeeklyLessons] =
    useState<WeeklyLessonsOption | null>(null);

  // 7 ngày trong tuần, mỗi ngày 2 timeslot
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    () =>
      daysOfWeek.map((day) => ({
        dayOfWeek: day,
        startTime1: "",
        startTime2: "",
      })) as TimeSlot[],
  );

  const { numberOfWeeks, finishDate } = useMemo(() => {
    if (!weeklyLessons || weeklyLessons <= 0 || totalLessons <= 0) {
      return { numberOfWeeks: null, finishDate: null };
    }

    const weeks = Math.ceil(totalLessons / weeklyLessons);
    const baseDate = startDate ?? new Date();
    const finish = addWeeks(baseDate, weeks);

    return {
      numberOfWeeks: weeks,
      finishDate: finish,
    };
  }, [weeklyLessons, totalLessons, startDate]);

  const handleWeeklyLessonsChange = (value: WeeklyLessonsOption) => {
    setWeeklyLessons(value);
  };

  const handleChangeTimeSlotStartTime = (
    dayIndex: number,
    slotIndex: 1 | 2,
    startTime: string,
  ) => {
    setTimeSlots((prev) =>
      prev.map((slot, i) => {
        if (i !== dayIndex) return slot;
        return {
          ...slot,
          startTime1: slotIndex === 1 ? startTime : slot.startTime1,
          startTime2: slotIndex === 2 ? startTime : slot.startTime2,
        };
      }),
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        weeklyLessons,
        numberOfWeeks,
        finishDate,
        timeSlots,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  const weeklyLessonsDisplay = weeklyLessons == null ? "__" : weeklyLessons;
  const configuredSlotsCount = timeSlots.reduce((acc, slot) => {
    let cnt = acc;
    if (slot.startTime1) cnt += 1;
    if (slot.startTime2) cnt += 1;
    return cnt;
  }, 0);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>Chào mừng bạn {studentName}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* KHỐI TRÊN: 4 CỘT (3 : 3 : 1 : 2) - CHUNG BACKGROUND */}
        <div className={styles.topInfoGrid}>
          {/* CỘT 1: COURSE INFO */}
          <div className={styles.courseInfo}>
            <p className={styles.courseInfoCourseTitle}>{courseTitle}</p>

            <p className={styles.courseInfoLine}>
              <span className={styles.courseInfoLabel}>
                1. Số bài học:&nbsp;
              </span>
              <span className={styles.courseInfoValue}>
                {totalLessons} bài
              </span>
            </p>
            <p className={styles.courseInfoLine}>
              <span className={styles.courseInfoLabel}>
                2. Thời lượng học dự kiến:&nbsp;
              </span>
              <span className={styles.courseInfoValue}>
                {estimatedHours} giờ
              </span>
            </p>
          </div>

          {/* CỘT 2: Con sẽ học mấy buổi / tuần ? */}
          <div className={styles.topColumn}>
            <h3 className={styles.columnTitleQuestion}>
              Con sẽ học mấy buổi / tuần ?
            </h3>

            <div className={styles.weeklyOptionsGrid}>
              {/* Hàng 2: 1 & 2 buổi */}
              <div className={styles.weeklyRow}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 1}
                    onChange={() => handleWeeklyLessonsChange(1)}
                  />
                  <span>1 buổi / tuần</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 2}
                    onChange={() => handleWeeklyLessonsChange(2)}
                  />
                  <span>2 buổi / tuần</span>
                </label>
              </div>

              {/* Hàng 3: 3 & 4 buổi */}
              <div className={styles.weeklyRow}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 3}
                    onChange={() => handleWeeklyLessonsChange(3)}
                  />
                  <span>3 buổi / tuần</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 4}
                    onChange={() => handleWeeklyLessonsChange(4)}
                  />
                  <span>4 buổi / tuần</span>
                </label>
              </div>

              {/* Hàng 4: 5 & 6 buổi */}
              <div className={styles.weeklyRow}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 5}
                    onChange={() => handleWeeklyLessonsChange(5)}
                  />
                  <span>5 buổi / tuần</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 6}
                    onChange={() => handleWeeklyLessonsChange(6)}
                  />
                  <span>6 buổi / tuần</span>
                </label>
              </div>

              {/* Hàng 5: 7 buổi / tuần */}
              <div className={styles.weeklyRowSingle}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={weeklyLessons === 7}
                    onChange={() => handleWeeklyLessonsChange(7)}
                  />
                  <span>7 buổi / tuần</span>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT 3: MŨI TÊN */}
          <div className={styles.topArrowColumn}>
            <div className={styles.arrowSpacerTop}></div>
            <div className={styles.arrowRow}>
              <div className={styles.arrowIcon}>➜</div>
            </div>
            <div className={styles.arrowSpacerBottom}></div>
          </div>

          {/* CỘT 4: KẾ HOẠCH HỌC TẬP */}
          <div className={styles.topColumn}>
            <h3 className={styles.columnTitlePlan}>Kế hoạch học tập</h3>

            <div className={styles.planSummaryBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Số tuần học:&nbsp;</span>
                <span className={styles.infoValue}>
                  {numberOfWeeks ?? "-"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Ngày hoàn thành:&nbsp;</span>
                <span className={styles.infoValue}>
                  {formatDate(finishDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN DƯỚI: BẢNG CHỌN KHUNG GIỜ */}
        <div className={styles.scheduleSection}>
          <p className={styles.scheduleSubtitle}>
            Chọn {weeklyLessonsDisplay} khung giờ (2h) mỗi tuần (Đã thiết lập{" "}
            {configuredSlotsCount} / {weeklyLessonsDisplay} buổi)
          </p>

          <div className={styles.scheduleTable}>
            {timeSlots.map((slot, index) => {
              const endTime1 = calcEndTime(slot.startTime1, 2);
              const endTime2 = calcEndTime(slot.startTime2, 2);

              const hasFirstSlot = !!slot.startTime1;
              const hasSecondSlot = !!slot.startTime2;

              return (
                <div key={slot.dayOfWeek} className={styles.scheduleRow}>
                  {/* Cột 1: Thứ */}
                  <div className={styles.scheduleCellDay}>
                    {slot.dayOfWeek}
                  </div>

                  {/* Cột 2: Giờ bắt đầu 1 */}
                  <div
                    className={`${styles.scheduleCell} ${
                      hasFirstSlot ? styles.scheduleCellHighlight : ""
                    }`}
                  >
                    <span className={styles.timeSlotFieldLabel}>
                      Mấy giờ học ?
                    </span>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={slot.startTime1}
                      onChange={(e) =>
                        handleChangeTimeSlotStartTime(
                          index,
                          1,
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  {/* Cột 3: Giờ kết thúc 1 */}
                  <div
                    className={`${styles.scheduleCell} ${
                      hasFirstSlot ? styles.scheduleCellHighlight : ""
                    }`}
                  >
                    <span className={styles.timeEndSlotFieldLabel}>
                      Giờ học xong:
                    </span>
                    <span className={styles.timeSlotEndTime}>
                      {endTime1 || "--:--"}
                    </span>
                  </div>

                  {/* Cột 4: Giờ bắt đầu 2 */}
                  <div
                    className={`${styles.scheduleCell} ${
                      hasSecondSlot ? styles.scheduleCellHighlight : ""
                    }`}
                  >
                    <span className={styles.timeSlotFieldLabel}>
                      Giờ bắt đầu 2:
                    </span>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={slot.startTime2}
                      onChange={(e) =>
                        handleChangeTimeSlotStartTime(
                          index,
                          2,
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  {/* Cột 5: Giờ kết thúc 2 */}
                  <div
                    className={`${styles.scheduleCell} ${
                      hasSecondSlot ? styles.scheduleCellHighlight : ""
                    }`}
                  >
                    <span className={styles.timeEndSlotFieldLabel}>
                      Giờ học xong:
                    </span>
                    <span className={styles.timeSlotEndTime}>
                      {endTime2 || "--:--"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Huỷ
          </button>
          <button className={styles.primaryButton} onClick={handleSubmit}>
            Lưu kế hoạch học tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanModal;
