// src/features/api/BM/bmProductServiceApi.ts

import type { BMProductDto } from '../model/BMProductDto';
import apiEducoreBE from '../../../services/apiService';
import { BM_TENANT_ZONE } from '../config/bmConfig';

// Endpoint mẫu: /bm/products/:productCode
const PRODUCT_DETAIL_ENDPOINT = (productCode: string) =>
  `/bm/products/${productCode}`;

/**
 * Gọi API lấy chi tiết product (bao gồm saleKit)
 */
export const fetchProductDetailApi = async (
  productCode: string
): Promise<BMProductDto> => {
  console.log(
    `[bmProductServiceApi] Gọi API lấy chi tiết sản phẩm "${productCode}", tenant zone:`,
    BM_TENANT_ZONE
  );

  if (!productCode) {
    throw new Error('Thiếu productCode khi gọi API chi tiết sản phẩm');
  }

  try {
    const res = await apiEducoreBE.get(PRODUCT_DETAIL_ENDPOINT(productCode));

    const data = res.data as BMProductDto;

    return data;
  } catch (error: any) {
    console.error(
      `[bmProductServiceApi] Lỗi khi tải chi tiết sản phẩm "${productCode}":`,
      error
    );

    throw new Error(
      error?.response?.data?.message ||
        'Lỗi khi tải thông tin chi tiết sản phẩm'
    );
  }
};
