import apiEducoreBE from '../../../services/apiService';
import { saveToken, removeToken } from '../../../services/tokenService';
import { User } from '../../../app/context/UserContext';

export const login = async (
  data: { emailOrPhone: string; password: string },
  setUser: React.Dispatch<React.SetStateAction<any>>
) => {
  console.log('[authService] gọi API /login với dữ liệu:', data);
  try {
    const response = await apiEducoreBE.post('/auth/login', data);

    if (!response.data || !response.data.user) {
      throw new Error('Đăng nhập thất bại: không có dữ liệu người dùng');
    }

    const userData = response.data.user;
    console.log('[authService] avatarImage từ server:', userData?.profile?.avatarImage);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    saveToken(response.data.access_token); // ✅ Lưu token

    return response;
  } catch (error: any) {
    console.error('[authService] Đăng nhập thất bại:', error);
    throw new Error(error?.response?.data?.message || error.message || 'Đăng nhập thất bại');
  }
};


export const logout = (
  setUser: React.Dispatch<React.SetStateAction<any>>
) => {
  console.log('[authService] gọi API /logout');
  setUser(null);
  localStorage.removeItem('user');
  removeToken(); // ✅ Xoá token
  return apiEducoreBE.post('/auth/logout');
};

export const isLoggedIn = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('access_token');
  const status = !!user && !!token;
  console.log('[authService] Kiểm tra isLoggedIn:', status);
  return status;
};

export const registerUser = async (
  data: {
    fullName: string;
    email?: string;
    phone?: string;
    password: string;
    profile?: {
      avatarImage?: string;
      dob?: string;
      gender?: string;
      grade?: number;
      slogen?: string;
    };
  },
  setUser: React.Dispatch<React.SetStateAction<any>>
) => {
  console.log('[authService] gọi API /register với dữ liệu:', data);
  try {
    const response = await apiEducoreBE.post('/auth/register', data);

    if (!response.data || !response.data.user) {
      throw new Error('Đăng ký thất bại: không có dữ liệu người dùng');
    }

    const userData = response.data.user;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    saveToken(response.data.access_token); // ✅ Lưu token

    return response;
  } catch (error: any) {
    console.error('[authService] Đăng ký thất bại:', error);
    throw new Error(error?.response?.data?.message || error.message || 'Đăng ký thất bại');
  }
};

export const getUserById = async (userId: number): Promise<User> => {
  console.log('[userService] Gọi API /auth/:id/info để lấy user:', userId);
  try {
    const response = await apiEducoreBE.get(`/auth/${userId}/info`);
    return response.data;
  } catch (error: any) {
    console.error('[userService] Lỗi khi lấy user info:', error);
    throw new Error(error?.response?.data?.message || 'Không thể tải thông tin người dùng');
  }
};
