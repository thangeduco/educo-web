// application/BM/dtos/public-user.dto.ts

/**
 * PublicUser là DTO trả ra ngoài API
 * Được tạo từ sanitizeUser() → đảm bảo không bao giờ chứa passwordHash
 */
export interface PublicUser {
  id: number;
  fullName: string;

  email?: string;
  phone?: string;

  status: string;
  role: string;

  createdAt: string;

  profile?: BMUserProfile;

  // Mở rộng dành cho hệ thống học tập (optional)
  badgeCount?: number;
  rank?: string;
}

export interface BMUserProfile {
  avatarImage?: string;   // avatar_image
  dob?: string;           // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other' | string;
  grade?: number;         // Lớp (1–12)
  slogen?: string;
}

