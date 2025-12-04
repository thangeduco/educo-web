// src/services/apiService.ts
import axios from 'axios';
import { getToken, removeToken } from './tokenService';

// Định nghĩa endpoint Login
const LOGIN_ENDPOINT_PATTERN = /\/bm\/auth\/login$/; // Hoặc /auth/login tùy BE

// Tạo một instance chung cho toàn bộ project
const apiEducoreBE = axios.create({
  baseURL: 'http://localhost:3100/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... (Interceptor request giữ nguyên)

// Interceptor: xử lý lỗi từ backend
apiEducoreBE.interceptors.response.use(
  (response) => {
    console.log('[apiService] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[apiService] Response Error:', error);

    // Lấy URL của request bị lỗi
    const requestUrl = error.config?.url || '';

    // 🛑 THAY ĐỔI TẠI ĐÂY: Chỉ điều hướng khi KHÔNG phải là request Login 🛑
    if (
      error.response?.status === 401 &&
      !LOGIN_ENDPOINT_PATTERN.test(requestUrl) // KIỂM TRA: KHÔNG phải là endpoint Login
    ) {
      // Đây là lỗi 401 do token hết hạn hoặc không hợp lệ (từ request khác)
      removeToken();
      localStorage.removeItem('user');
      window.location.href = '/login'; // Chuyển về trang login
    } else if (error.response?.status === 401 && LOGIN_ENDPOINT_PATTERN.test(requestUrl)) {
      // Lỗi 401 là do đăng nhập sai. KHÔNG điều hướng.
      // Chỉ log ra và để error được catch ở LoginForm.tsx
      console.log('[apiService] Lỗi 401 từ API Login. Đã bỏ qua điều hướng.');
    }
    
    return Promise.reject(error);
  }
);


apiEducoreBE.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      // Đảm bảo token được đính kèm với định dạng 'Bearer '
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as any;

      // ✅ BỔ SUNG LOG NÀY ĐỂ XÁC NHẬN TRƯỚC KHI GỌI API LOGOUT
      console.log(
        '[apiService] Request WITH TOKEN:',
        config.method?.toUpperCase(),
        config.url,
        '| Authorization =',
        (config.headers as any).Authorization
      );
    } else {
      console.log(
        '[apiService] Request (KHÔNG CÓ TOKEN):',
        config.method?.toUpperCase(),
        config.url
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default apiEducoreBE;