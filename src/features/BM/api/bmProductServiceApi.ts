// src/features/BM/api/bmProductServiceApi.ts

import apiEducoreBE from '../../../services/apiService';
import type { BMProductDtoList, BMProductDto } from '../model/BMProductDto';

const PRODUCTS_TYPE_ENDPOINT = '/bm/products/courses';

/**
 * Gọi API GET /bm/products/courses
 * Backend trả:
 * {
 *   success: true,
 *   data: BMProductDto[]
 * }
 */
export const fetchProductsTypeCourseApi = async (): Promise<BMProductDtoList> => {
  try {
    const response = await apiEducoreBE.get(PRODUCTS_TYPE_ENDPOINT);

    console.log('[fetchProductsTypeCourseApi] ✔ Raw response.data:', response.data);

    const raw = response.data;

    // Kiểm tra cấu trúc { success, data }
    if (!raw || typeof raw !== 'object') {
      console.error(
        '[fetchProductsTypeCourseApi] ❌ response.data không phải object:',
        raw
      );
      throw new Error('API /bm/products/courses must return { success, data }');
    }

    const { success, data } = raw as {
      success?: boolean;
      data?: unknown;
    };

    if (success !== true) {
      console.error(
        '[fetchProductsTypeCourseApi] ❌ success !== true trong response:',
        raw
      );
      throw new Error('API /bm/products/courses trả về success !== true');
    }

    if (!Array.isArray(data)) {
      console.error(
        '[fetchProductsTypeCourseApi] ❌ data không phải là mảng:',
        data
      );
      throw new Error('API /bm/products/courses: `data` must be an array');
    }

    const typed: BMProductDtoList = data as BMProductDtoList;

    // Validation nhẹ: success_stories phải là array hoặc null
    typed.forEach((p: BMProductDto) => {
      if (p.success_stories !== null && !Array.isArray(p.success_stories)) {
        console.warn(
          `[fetchProductsTypeCourseApi] ⚠ Field success_stories của product_code=${p.product_code} không phải array`,
          p.success_stories
        );
      }
    });

    console.log(
      '[fetchProductsTypeCourseApi] ✔ Parsed products count:',
      typed.length
    );
    return typed;
  } catch (error: any) {
    console.error(
      '[fetchProductsTypeCourseApi] ❌ Lỗi khi lấy danh sách khóa học:',
      error?.response?.data || error
    );
    throw error;
  }
};
