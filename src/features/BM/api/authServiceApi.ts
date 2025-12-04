import apiEducoreBE from '../../../services/apiService';
import { saveToken, removeToken, getToken } from '../../../services/tokenService';
import { User } from '../../../app/context/UserContext';

const LOGIN_ENDPOINT = '/bm/auth/login';
const LOGOUT_ENDPOINT = '/bm/auth/logout';
const REGISTER_ENDPOINT = '/bm/auth/register';

const USER_KEY = 'user';

// Helper: luôn cố gắng lấy message từ BE, không dùng error.message của Axios cho UI
const extractBackendMessage = (error: any, fallback: string): string => {
  try {
    console.error(
      '[authService][extractBackendMessage] raw error:',
      error?.response?.status,
      error?.response?.data || error
    );

    const data = error?.response?.data;

    // Trường hợp BE trả JSON có field "message"
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as any).message;
      if (typeof msg === 'string' && msg.trim()) {
        return msg;
      }
    }

    // Trường hợp BE trả thẳng string
    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    // Không tìm được message từ BE → dùng fallback thân thiện
    return fallback;
  } catch (e) {
    console.error('[authService][extractBackendMessage] error when parsing:', e);
    return fallback;
  }
};

export const login = async (
  data: { emailOrPhone: string; password: string },
  setUser: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await apiEducoreBE.post(LOGIN_ENDPOINT, data);

    if (!response.data || !response.data.user) {
      throw new Error('Đăng nhập thất bại: không có dữ liệu người dùng');
    }

    const userData = response.data.user as User;

    // Cập nhật context + localStorage
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData)); // lưu user
    saveToken(response.data.access_token); // lưu token

    return response;
  } catch (error: any) {
    console.error('[authService] Đăng nhập thất bại:', error);

    const beMessage = extractBackendMessage(
      error,
      'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau.'
    );

    // Ném ra Error với message đã chuẩn hoá, để LoginForm hiển thị
    throw new Error(beMessage);
  }
};

export const logout = async (
  setUser: React.Dispatch<React.SetStateAction<any>>
) => {
  console.log('[authService] gọi API /logout');

  const tokenBefore = getToken();
  console.log('[authService] Token hiện tại (trước khi logout):', tokenBefore);

  try {
    const res = await apiEducoreBE.post(LOGOUT_ENDPOINT, {});
    console.log('[authService] Logout thành công từ BE:', res.status, res.data);
    return res;
  } catch (error: any) {
    console.error(
      '[authService] Lỗi khi gọi API logout:',
      error?.response?.status,
      error?.response?.data || error.message
    );
    // Không cần ném lỗi ra ngoài, vì dù sao cũng xoá session local ở finally
  } finally {
    // Xoá session local
    setUser(null);
    localStorage.removeItem(USER_KEY);
    removeToken();
    console.log('[authService] Session cục bộ đã được xóa.');
  }
};

export const isLoggedIn = () => {
  const user = localStorage.getItem(USER_KEY);
  const token = getToken();
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
    role: 'parent' | 'student' | 'teacher' | string;
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
  console.log('[authService] gọi API /register với dữ liệu (thô):', data);

  // Chuẩn hoá metadata cho RegisterInput ở BE
  const device = 'web';
  const userAgent =
    typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';

  const payload = {
    ...data,
    device,
    ipAddress: undefined,
    userAgent,
  };

  console.log('[authService] payload gửi BE /register:', payload);

  try {
    const response = await apiEducoreBE.post(REGISTER_ENDPOINT, payload);

    if (!response.data || !response.data.user) {
      throw new Error('Đăng ký thất bại: không có dữ liệu người dùng');
    }

    const userData = response.data.user as User;

    // Auto-login sau khi đăng ký
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    saveToken(response.data.access_token);

    return response;
  } catch (error: any) {
    console.error('[authService] Đăng ký thất bại:', error);

    const beMessage = extractBackendMessage(
      error,
      'Đăng ký thất bại. Vui lòng thử lại sau.'
    );

    throw new Error(beMessage);
  }
};

// Các hàm dưới giữ nguyên logic, chỉ dùng extractBackendMessage cho message đẹp hơn nếu muốn

export const getUserById = async (userId: number): Promise<User> => {
  console.log('[userService] Gọi API /auth/:id/info để lấy user:', userId);
  try {
    const response = await apiEducoreBE.get(`/auth/${userId}/info`);
    return response.data as User;
  } catch (error: any) {
    console.error('[userService] Lỗi khi lấy user info:', error);
    const msg = extractBackendMessage(
      error,
      'Không thể tải thông tin người dùng'
    );
    throw new Error(msg);
  }
};

export const fetchChildrenOfParent = async (
  parentId: number
): Promise<User[]> => {
  console.log(
    '[authService] Gọi API lấy danh sách con của phụ huynh:',
    parentId
  );
  try {
    const res = await apiEducoreBE.get(`/edu/parents/${parentId}/children`);
    return (res.data?.children as User[]) || (res.data as User[]) || [];
  } catch (error: any) {
    console.error(
      '[authService] Lỗi khi lấy danh sách con của phụ huynh:',
      error
    );
    const msg = extractBackendMessage(
      error,
      'Không thể tải danh sách con của phụ huynh'
    );
    throw new Error(msg);
  }
};

export const fetchParentsOfStudent = async (
  studentId: number
): Promise<User[]> => {
  console.log(
    '[authService] Gọi API lấy danh sách phụ huynh của học sinh:',
    studentId
  );
  try {
    const res = await apiEducoreBE.get(`/edu/students/${studentId}/parents`);
    return (res.data?.parents as User[]) || (res.data as User[]) || [];
  } catch (error: any) {
    console.error(
      '[authService] Lỗi khi lấy danh sách phụ huynh của học sinh:',
      error
    );
    const msg = extractBackendMessage(
      error,
      'Không thể tải danh sách phụ huynh của học sinh'
    );
    throw new Error(msg);
  }
};
