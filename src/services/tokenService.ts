// src/services/tokenService.ts

const TOKEN_KEY = 'access_token';

// Lưu token dạng plain string vào localStorage
export const saveToken = (token: string) => {
  console.log('[tokenService] saveToken, length =', token?.length);
  localStorage.setItem(TOKEN_KEY, token);
};

// Lấy token để gắn vào header Authorization
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.log('[tokenService] Không tìm thấy access_token trong localStorage');
    return null;
  }
  console.log('[tokenService] getToken OK, length =', token.length);
  return token;
};

export const removeToken = () => {
  console.log('[tokenService] removeToken');
  localStorage.removeItem(TOKEN_KEY);
};
