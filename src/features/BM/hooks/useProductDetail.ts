// src/features/BM/hooks/useProductDetail.ts

import { useEffect, useState } from 'react';
import { fetchProductDetailApi } from '../api/bmProductServiceApi';
import type { BMProductDto } from '../model/BMProductDto';

export type UseProductDetailResult = {
  product: BMProductDto | null;
  loading: boolean;
  error: string | null;
};

export function useProductDetail(productCode: string): UseProductDetailResult {
  const [product, setProduct] = useState<BMProductDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Nếu không có productCode thì không gọi API
    if (!productCode) {
      setProduct(null);
      setLoading(false);
      setError('Thiếu productCode để tải chi tiết sản phẩm.');
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);

        const data = await fetchProductDetailApi(productCode);

        if (!isMounted) return;

        setProduct(data || null);
      } catch (err: any) {
        if (!isMounted) return;

        setError(
          err?.message || 'Có lỗi xảy ra khi tải chi tiết sản phẩm.'
        );
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [productCode]);

  return {
    product,
    loading,
    error,
  };
}
