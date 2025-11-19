// src/features/BM/hooks/useProductService.ts

import { useEffect, useState } from 'react';
import { fetchProductsTypeCourseApi } from '../api/bmProductServiceApi';
import type {BMProductDtoList } from '../model/BMProductDto';

export interface UseProductServiceResult {
  products: BMProductDtoList;
  loading: boolean;
  error: string | null;
}

/**
 * useProductService
 * Gọi API lấy danh sách sản phẩm thuộc khoá học (COURSE) từ educo-backend.
 */
export function useProductService(): UseProductServiceResult {
  const [products, setProducts] = useState<BMProductDtoList>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const data = await fetchProductsTypeCourseApi(); // trả về BMProductDtoList

        if (!isMounted) return;
        setProducts(data);
      } catch (err: any) {
        if (!isMounted) return;
        setError(
          err?.message || 'Có lỗi xảy ra khi tải danh sách sản phẩm/khoá học.'
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
  }, []);

  return {
    products,
    loading,
    error,
  };
}
