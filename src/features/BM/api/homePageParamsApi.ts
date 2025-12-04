import {
  HomePageQAsDto,
  HomePageImageSlideDto,
  HomePageCoursesDto,
  HomePageAchievementDto,
} from '../model/home-page-param.dto';
import { BM_TENANT_ZONE } from '../config/bmConfig';
import apiEducoreBE from '../../../services/apiService';

// Endpoint theo tenant zone
const HOME_QAS_ENDPOINT = `/bm/home-page/qas`;
const HOME_IMAGE_SLIDE_ENDPOINT = `/bm/home-page/image-slide`;
const HOME_COURSES_ENDPOINT = `/bm/home-page/courses`;
const HOME_PAGE_ACHIEVEMENT = `/bm/home-page/archievement`;
export const fetchHomeQAsApi = async (): Promise<HomePageQAsDto> => {
  console.log('[homeQAsApi] Gọi API lấy danh sách Q&A Home Page, zone:', BM_TENANT_ZONE);

  try {
    const res = await apiEducoreBE.get(HOME_QAS_ENDPOINT);

    const data = res.data as HomePageQAsDto;

    // Sort theo display_order
    return [...data].sort((a, b) => a.display_order - b.display_order);
  } catch (error: any) {
    console.error('[homeQAsApi] Lỗi khi lấy dữ liệu Home QAs:', error);
    throw new Error(error?.response?.data?.message || 'Lỗi khi tải danh sách câu hỏi Q&A');
  }
};

export const fetchHomeImageSlideApi = async (): Promise<HomePageImageSlideDto> => {
  console.log(
    '[homePageParamsApi] Gọi API lấy danh sách Home Image Slides, tenant:',
    BM_TENANT_ZONE
  );

  try {
    const res = await apiEducoreBE.get(HOME_IMAGE_SLIDE_ENDPOINT);

    const data = res.data as HomePageImageSlideDto;

    // Sort theo display_order
    return [...data].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
  } catch (error: any) {
    console.error('[homePageParamsApi] Lỗi khi tải Home Image Slides:', error);
    throw new Error(
      error?.response?.data?.message ||
        'Lỗi khi tải danh sách Home Image Slides'
    );
  }
};

export const fetchHomeCoursesApi = async (): Promise<HomePageCoursesDto> => {
  console.log(
    '[homePageParamsApi] Gọi API lấy danh sách Home Courses, tenant:',
    BM_TENANT_ZONE
  );

  try {
    const res = await apiEducoreBE.get(HOME_COURSES_ENDPOINT);

    const data = res.data as HomePageCoursesDto;

    // Sort theo display_order nếu có
    return [...data].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
  } catch (error: any) {
    console.error('[homePageParamsApi] Lỗi khi tải Home Courses:', error);
    throw new Error(
      error?.response?.data?.message ||
        'Lỗi khi tải danh sách khóa học Home Page'
    );
  }
};

//fet HOME_PAGE_ACHIEVEMENT
export const fetchHomeArchievementApi = async (): Promise<HomePageAchievementDto> => {
  console.log(
    '[homePageParamsApi] Gọi API lấy thông tin Home Achievement, tenant:',
    BM_TENANT_ZONE
  );

  try {
    const res = await apiEducoreBE.get(HOME_PAGE_ACHIEVEMENT);

    const data = res.data;

    return data;
  } catch (error: any) {
    console.error('[homePageParamsApi] Lỗi khi tải Home Achievement:', error);
    throw new Error(
      error?.response?.data?.message ||
        'Lỗi khi tải thông tin Home Achievement'
    );
  }
};


