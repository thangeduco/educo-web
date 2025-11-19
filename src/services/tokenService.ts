// src/services/tokenService.ts
import CryptoJS from 'crypto-js';

const TOKEN_KEY = 'access_token';
const SECRET = 'EDUCO_SECRET_KEY_123'; // Đặt ở .env nếu dùng production

export const saveToken = (token: string) => {
  const encrypted = CryptoJS.AES.encrypt(token, SECRET).toString();
  localStorage.setItem(TOKEN_KEY, encrypted);
};

export const getToken = (): string | null => {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  if (!encrypted) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error('[tokenService] Giải mã token lỗi:', e);
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
