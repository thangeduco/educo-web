import { HomeQAsDto } from '../model/HomeQAAnswerDto';
import {
  HomeImageSlideItemDto,
  HomeImageSlidesDto,
} from '../model/HomeImageSlideItemDto';
import { HomeUserGuideDto } from '../model/HomeUserGuideDto';
import { BM_TENANT_ZONE } from '../config/bmConfig';
import apiEducoreBE from '../../../services/apiService';

// Endpoint theo tenant zone
const HOME_QAS_ENDPOINT = `/bm/${BM_TENANT_ZONE}/home-page-qas`;
const HOME_IMAGE_SLIDES_ENDPOINT = `/bm/${BM_TENANT_ZONE}/home-page-image-slides`;
const HOME_USER_GUIDE_ENDPOINT = `/bm/${BM_TENANT_ZONE}/home-page-user-guide`;
export const fetchHomeQAsApi = async (): Promise<HomeQAsDto> => {
  console.log('[homeQAsApi] Gọi API lấy danh sách Q&A Home Page, zone:', BM_TENANT_ZONE);

  try {
    const res = await apiEducoreBE.get(HOME_QAS_ENDPOINT);

    const data = res.data as HomeQAsDto;

    // Sort theo display_order
    return [...data].sort((a, b) => a.display_order - b.display_order);
  } catch (error: any) {
    console.error('[homeQAsApi] Lỗi khi lấy dữ liệu Home QAs:', error);
    throw new Error(error?.response?.data?.message || 'Lỗi khi tải danh sách câu hỏi Q&A');
  }
};

export const fetchHomeImageSlidesApi = async (): Promise<HomeImageSlidesDto> => {
  console.log(
    '[homePageParamsApi] Gọi API lấy danh sách Home Image Slides, tenant:',
    BM_TENANT_ZONE
  );

  try {
    const res = await apiEducoreBE.get(HOME_IMAGE_SLIDES_ENDPOINT);

    const data = res.data as HomeImageSlidesDto;

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

// Lấy thông tin user guide
export const fetchHomeUserGuideApi = async (): Promise<HomeUserGuideDto> => {
  console.log(
    '[homePageParamsApi] Gọi API lấy Home User Guide, tenant:',
    BM_TENANT_ZONE
  );

  try {
    const res = await apiEducoreBE.get(HOME_USER_GUIDE_ENDPOINT);

    const data = res.data as HomeUserGuideDto;
    return data;
  } catch (error: any) {
    console.error('[homePageParamsApi] Lỗi khi tải Home User Guide:', error);
    throw new Error(
      error?.response?.data?.message || 'Lỗi khi tải Home User Guide'
    );
  }
};
