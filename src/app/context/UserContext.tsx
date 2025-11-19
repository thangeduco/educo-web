// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById } from '../../features/BM/services/authService';

/** Hồ sơ người dùng */
export interface UserProfile {
  avatarImage?: string;
  grade?: number;
  gender?: string;
  dob?: string;
  slogen?: string;
}

/** Người dùng */
export interface User {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  role: string; // 👈 Vai trò chính (có thể dùng từ root)
  status: string;
  createdAt: string;
  profile?: UserProfile;

  badgeCount?: number;
  rank?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserData: (userId: number) => void;
}

/** Context khởi tạo */
const UserContext = createContext<UserContextType | undefined>(undefined);

/** Hook sử dụng user */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/** Provider bọc toàn bộ ứng dụng */
export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /** Load user từ localStorage khi khởi động */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('[UserContext] Lỗi khi parse user từ localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  /** Ghi user vào localStorage khi thay đổi */
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  /** Lấy dữ liệu user từ API backend */
  const fetchUserData = async (userId: number) => {
    try {
      const userData = await getUserById(userId);

      // Đồng bộ role profile → user nếu thiếu
      if (
        userData?.role &&
        userData.role !== userData.role
      ) {
        userData.role = userData.role;
      }

      setUser(userData);
    } catch (error) {
      console.error('[UserContext] Lỗi khi fetchUserData:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
