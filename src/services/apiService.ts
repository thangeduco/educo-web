// src/services/apiService.ts
import axios from 'axios';
import { getToken, removeToken } from './tokenService'; // ✅ Sử dụng tokenService

// Tạo một instance chung cho toàn bộ project
const apiEducoreBE = axios.create({
  baseURL: 'http://localhost:3100/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: tự động đính kèm token đã giải mã nếu có
apiEducoreBE.interceptors.request.use(
  (config) => {
    const token = getToken(); // ✅ Lấy và giải mã token từ localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[apiService] Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: xử lý lỗi từ backend
apiEducoreBE.interceptors.response.use(
  (response) => {
    console.log('[apiService] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[apiService] Response Error:', error);
    if (error.response?.status === 401) {
      // Token không hợp lệ hoặc đã hết hạn
      removeToken();                   // ✅ Xóa token mã hoá
      localStorage.removeItem('user'); // Xóa thông tin user
      window.location.href = '/login'; // Chuyển về trang login
    }
    return Promise.reject(error);
  }
);

export default apiEducoreBE;
