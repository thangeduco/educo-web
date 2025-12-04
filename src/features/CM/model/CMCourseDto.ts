// src/features/CM/model/CMCourseDto.ts

/**
 * DTO gốc trả về cho màn CourseWeekDetailList.tsx (public view).
 * Mapping từ backend: CourseWeekDetailResponseDTO
 */
export interface CourseWeekDetailResponseDto {
  header: CourseHeaderDto;
  sidebar: CourseSidebarDto;
  body: CourseBodyDto;
}

/* -------------------------------------------------------------------------- */
/*                               1. COURSE HEADER                             */
/* -------------------------------------------------------------------------- */

/**
 * Thông tin dùng cho vùng course header.
 * Mapping: CourseHeaderDTO
 */
export interface CourseHeaderDto {
  /**
   * ID khoá học (cm_courses.id)
   */
  id: number;

  /**
   * Tiêu đề khoá học (cm_courses.title)
   */
  title: string;

  /**
   * Ước lượng thời lượng học cần thiết
   * (cm_courses.estimated_learning_time)
   */
  estimatedLearningTime: string;

  /**
   * Số lượng bài giảng video
   */
  totalVideoLessonsCount: number;

  /**
   * Số lượng phiếu bài tập về nhà
   */
  totalWorksheetLessonsCount: number;

  /**
   * Ảnh cover khoá học (cm_courses.cover_image_url)
   */
  coverImageUrl?: string | null;

  /**
   * Mô tả chi tiết khoá học (cm_courses.description)
   */
  description?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                               2. COURSE SIDEBAR                            */
/* -------------------------------------------------------------------------- */

/**
 * DTO cho vùng course sidebar.
 * Mapping: CourseSidebarDTO
 */
export interface CourseSidebarDto {
  weeks: SidebarWeekDto[];
}

/**
 * Thông tin 1 tuần học dùng cho sidebar.
 * Mapping: SidebarWeekDTO
 */
export interface SidebarWeekDto {
  id: number;
  weekNumber: number;
  title: string;
  lessons: SidebarLessonDto[];
}

/**
 * Thông tin 1 bài học trong sidebar.
 * Mapping: SidebarLessonDTO
 */
export interface SidebarLessonDto {
  id: number;
  title: string;
  orderIndex: number;
}

/* -------------------------------------------------------------------------- */
/*                             3. COURSE BODY DETAIL                          */
/* -------------------------------------------------------------------------- */

/**
 * DTO cho vùng body chi tiết khoá học.
 * Mapping: CourseBodyDTO
 */
export interface CourseBodyDto {
  weeks: BodyWeekDto[];
}

/**
 * Thông tin chi tiết 1 tuần học trong body.
 * Mapping: BodyWeekDTO
 */
export interface BodyWeekDto {
  id: number;
  weekNumber: number;
  title: string;
  description: string | null;
  objective?: string | null;
  lessons: BodyLessonDto[];
}

/**
 * Thông tin chi tiết 1 bài học trong body.
 * Mapping: BodyLessonDTO
 */
export interface BodyLessonDto {
  id: number;
  title: string;
  description: string | null;
  lessonType: string;
  isOptional: boolean;
  orderIndex: number;
  videoLectures: BodyLessonVideoLectureDto[];
  worksheets: BodyLessonWorksheetDto[];
}

/**
 * Thông tin 1 video bài giảng trong body.
 * Mapping: BodyLessonVideoLectureDTO
 */
export interface BodyLessonVideoLectureDto {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
}

/**
 * Thông tin 1 worksheet (phiếu bài tập về nhà) trong body.
 * Mapping: BodyLessonWorksheetDTO
 */
export interface BodyLessonWorksheetDto {
  id: number;
  title: string;
  description: string | null;
  questionFileUrl: string | null;
  answerFileUrl: string | null;
  guideFileUrl?: string | null;
}

/**
 * Alias để tương thích code cũ:
 * CMCourseDto = toàn bộ cấu trúc chi tiết tuần/bài học của khoá.
 */
export type CMCourseDto = CourseWeekDetailResponseDto;
