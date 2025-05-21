import axios from 'axios';

// Tạo một instance chung cho toàn bộ project
const api = axios.create({
  baseURL: 'https://api.educo.vn', // ✅ Thay bằng URL thật của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: tự động đính kèm token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: xử lý lỗi từ backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ví dụ: Token hết hạn => điều hướng sang trang đăng nhập
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
