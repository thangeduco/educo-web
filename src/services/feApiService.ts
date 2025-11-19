import axios from 'axios';

// ✅ Instance dùng để gọi API backend nội bộ của edu-web (ví dụ: /api/edu-web)
const feApiService = axios.create({
  baseURL: 'http://localhost:3000/api/edu-web',
  timeout: 15000,
});

// ✅ Ghi log request
feApiService.interceptors.request.use(
  (config) => {
    console.log('[feApiService] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Ghi log response và lỗi
feApiService.interceptors.response.use(
  (res) => {
    console.log('[feApiService] Response:', res.status, res.config.url);
    return res;
  },
  (err) => {
    console.error('[feApiService] Lỗi:', err);
    return Promise.reject(err);
  }
);

export default feApiService;
