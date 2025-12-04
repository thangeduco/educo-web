import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "./CourseWeekDetailList.module.css";

import type {
  CourseBodyDto,
  BodyWeekDto,
  BodyLessonDto,
  BodyLessonVideoLectureDto,
  BodyLessonWorksheetDto,
} from "../model/CMCourseDto";

import { useLMLearningService } from "../../LM/hooks/useLMLearningService";
import type {
  StartVideoSessionInput,
  StopVideoSessionInput,
} from "../../LM/model/VideoLearningDtos";

interface CourseWeekDetailListProps {
  body: CourseBodyDto | null;
  weekRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  studentId: number;
}

/**
 * Helpers xử lý YouTube
 */
const getYouTubeVideoId = (youtubeUrl: string): string | null => {
  try {
    const url = new URL(youtubeUrl);
    const v = url.searchParams.get("v");
    if (v) return v;
    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.replace("/", "");
      return videoId || null;
    }
    return null;
  } catch {
    return null;
  }
};

const getYouTubeThumbnail = (videoUrl: string): string | null => {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const getYouTubeEmbedUrl = (videoUrl: string): string | null => {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};

const LessonRow: React.FC<{ lesson: BodyLessonDto; studentId: number }> = ({
  lesson,
  studentId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    sessionId,
    startVideoSession,
    stopVideoSession,
    loading,
    error,
  } = useLMLearningService();

  const mainVideo: BodyLessonVideoLectureDto | null =
    lesson.videoLectures && lesson.videoLectures.length > 0
      ? lesson.videoLectures[0]
      : null;

  const mainWorksheet: BodyLessonWorksheetDto | null =
    lesson.worksheets && lesson.worksheets.length > 0
      ? lesson.worksheets[0]
      : null;

  const thumbUrl = mainVideo ? getYouTubeThumbnail(mainVideo.videoUrl) : null;
  const embedUrl = mainVideo ? getYouTubeEmbedUrl(mainVideo.videoUrl) : null;

  const homeworkUrl = mainWorksheet?.questionFileUrl || "";
  const homeworkHintUrl = mainWorksheet?.guideFileUrl || "";
  const answerUrl = mainWorksheet?.answerFileUrl || "";
  const solutionUrl = mainWorksheet?.guideFileUrl || "";

  const statusLabel = (() => {
    if (lesson.lessonType === "VIDEO") return "Bài giảng video";
    if (lesson.lessonType === "WORKSHEET") return "Phiếu bài tập";
    return "Bài học";
  })();

  const homeworkStatusLabel = homeworkUrl ? "Có BTVN" : "Chưa có BTVN";
  const homeworkStatusClass = homeworkUrl
    ? styles.badgeSuccess
    : styles.badgePending;

  const teacherStatusLabel = solutionUrl ? "Có gợi ý/chi tiết" : "Chưa có chữa";
  const teacherStatusClass = solutionUrl
    ? styles.badgeSuccess
    : styles.badgePending;

  const videoId = mainVideo?.id ?? 0;

  const handleStartClick = useCallback(async () => {
    if (isPlaying) return;
    if (!studentId || !videoId || !mainVideo) {
      console.warn(
        "[LessonRow] Thiếu studentId hoặc videoId hoặc videoUrl, không thể start session",
        { studentId, videoId, mainVideo }
      );
      return;
    }

    const payload: StartVideoSessionInput = {
      studentId,
      videoId,
      startSecond: 0, // TODO: sau này lấy từ progress
      deviceType: "WEB",
    };

    try {
      await startVideoSession(payload);
      setIsPlaying(true);
    } catch (err) {
      console.error("[LessonRow][handleStartClick] ❌ Lỗi startVideoSession", err);
    }
  }, [isPlaying, startVideoSession, studentId, videoId, mainVideo]);

  /**
   * Hàm stop session – dùng cả khi unmount & beforeunload.
   * Hiện chưa tracking được thời điểm dừng thật sự (giây bao nhiêu),
   * nên tạm thời gửi stopSecond = 0. Sau này tích hợp player có thể cải tiến.
   */
  const doStopSession = useCallback(async () => {
    if (!sessionId) return;

    const payload: StopVideoSessionInput = {
      sessionId,
      stopSecond: 0, // TODO: sau này cập nhật theo currentTime của video
    };

    try {
      await stopVideoSession(payload);
    } catch (err) {
      console.error("[LessonRow][doStopSession] ❌ Lỗi stopVideoSession", err);
    }
  }, [sessionId, stopVideoSession]);

  // Stop khi component unmount (rời khỏi tuần / rời khỏi trang)
  useEffect(() => {
    return () => {
      void doStopSession();
    };
  }, [doStopSession]);

  // Stop khi tắt trình duyệt / reload tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      void doStopSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [doStopSession]);

  return (
    <div id={`lesson-${lesson.id}`} className={styles.lessonRow}>
      <div className={styles.lessonMain}>
        <h4 className={styles.lessonTitle}>{lesson.title}</h4>

        <div className={styles.videoAndScore}>
          {/* LEFT: Video + links */}
          <div className={styles.videoSection}>
            <div className={styles.videoCard}>
              {!isPlaying || !embedUrl ? (
                <button
                  type="button"
                  className={styles.videoClickArea}
                  onClick={handleStartClick}
                  disabled={loading || !mainVideo}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={lesson.title}
                      className={styles.videoThumbnail}
                    />
                  ) : (
                    <div className={styles.videoThumbnailPlaceholder}>
                      {mainVideo ? "Video bài giảng" : "Chưa có video bài giảng"}
                    </div>
                  )}
                  <div className={styles.videoOverlay}>
                    <span className={styles.playIcon}>▶</span>
                    <span className={styles.videoText}>
                      {loading
                        ? "Đang mở phiên học..."
                        : mainVideo
                        ? "Xem video bài giảng"
                        : "Không có video"}
                    </span>
                  </div>
                </button>
              ) : (
                <iframe
                  className={styles.videoIframe}
                  src={embedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Links dưới video */}
            <div className={styles.linksRow}>
              {/* Bài tập về nhà – căn trái */}
              <div className={styles.linkLeft}>
                {homeworkUrl ? (
                  <a
                    href={homeworkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    <span>Bài tập về nhà</span>
                    <span
                      className={`${styles.statusPill} ${homeworkStatusClass}`}
                    >
                      {homeworkStatusLabel}
                    </span>
                  </a>
                ) : (
                  <div className={styles.linkItemDisabled}>
                    <span>Bài tập về nhà</span>
                    <span
                      className={`${styles.statusPill} ${homeworkStatusClass}`}
                    >
                      {homeworkStatusLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Gợi ý BTVN */}
              <div className={styles.linkHint}>
                {homeworkHintUrl ? (
                  <a
                    href={homeworkHintUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    <span>Gợi ý BTVN</span>
                  </a>
                ) : (
                  <div className={styles.linkItemDisabled}>
                    <span>Gợi ý BTVN</span>
                  </div>
                )}
              </div>

              {/* Đáp án BTVN */}
              <div className={styles.linkCenter}>
                {answerUrl ? (
                  <a
                    href={answerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    <span>Đáp án BTVN</span>
                  </a>
                ) : (
                  <div className={styles.linkItemDisabled}>
                    <span>Đáp án BTVN</span>
                  </div>
                )}
              </div>

              {/* Thầy chữa chi tiết / gợi ý chi tiết */}
              <div className={styles.linkRight}>
                {solutionUrl ? (
                  <a
                    href={solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    <span>Thầy chữa chi tiết</span>
                    <span
                      className={`${styles.statusPill} ${teacherStatusClass}`}
                    >
                      {teacherStatusLabel}
                    </span>
                  </a>
                ) : (
                  <div className={styles.linkItemDisabled}>
                    <span>Thầy chữa chi tiết</span>
                    <span
                      className={`${styles.statusPill} ${teacherStatusClass}`}
                    >
                      {teacherStatusLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className={styles.errorText}>
                Lỗi khi ghi nhận phiên học: {error}
              </div>
            )}
          </div>

          {/* RIGHT: Panel status đơn giản */}
          <div className={styles.scorePanel}>
            <div className={styles.statusBadgeWrapper}>
              <span className={styles.statusBadge}>{statusLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CourseWeekDetailList: React.FC<CourseWeekDetailListProps> = ({
  body,
  weekRefs,
  studentId,
}) => {
  if (!body || !body.weeks || body.weeks.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.statusText}>
          Chưa có dữ liệu chi tiết tuần học để hiển thị.
        </div>
      </div>
    );
  }

  const weeks: BodyWeekDto[] = body.weeks;

  return (
    <div className={styles.wrapper}>
      <div className={styles.weekList}>
        {weeks.map((week, index) => {
          const variantClassName =
            (styles as Record<string, string>)[`weekCardVariant${index % 4}`] ||
            "";

          return (
            <div
              key={week.id}
              ref={(el) => {
                weekRefs.current[index] = el;
              }}
              className={`${styles.weekCard} ${variantClassName}`}
            >
              <div className={styles.weekCardHeader}>
                <div>
                  <h3 className={styles.weekTitle}>
                    Tuần {week.weekNumber}: {week.title}
                  </h3>
                  {week.description && (
                    <p className={styles.weekDescription}>
                      {week.description}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.lessonList}>
                {week.lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    studentId={studentId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseWeekDetailList;
