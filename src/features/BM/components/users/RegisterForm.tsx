import React, { useState } from 'react';
import { useUser } from '../../../../app/context/UserContext';
import { registerUser } from '../../../BM/api/authServiceApi';
import styles from './RegisterForm.module.css';

type Role = 'parent' | 'student' | 'teacher';
type Gender = 'male' | 'female' | 'other' | '';

// Props
interface RegisterFormProps {
  defaultRole?: Role;
  onRegisterSuccess?: () => void;
}

// Helper: kiểm tra email
const isEmail = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
};

// Helper: kiểm tra số điện thoại (VN cơ bản)
const isPhone = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  // Bỏ khoảng trắng, dấu . , -, ...
  const digitsOnly = trimmed.replace(/[^\d]/g, '');

  // Cho phép 9–11 số sau khi loại ký tự khác
  return digitsOnly.length >= 9 && digitsOnly.length <= 11;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  defaultRole = 'parent',
  onRegisterSuccess,
}) => {
  const { setUser } = useUser();

  const [form, setForm] = useState({
    fullName: '',
    emailOrPhone: '', // gộp email / phone vào 1 field hiển thị
    password: '',
    role: defaultRole as Role,
    profile: {
      avatarImage: '',
      dob: '',
      gender: '' as Gender,
      grade: undefined as number | undefined,
      slogen: '',
    },
  });

  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatarImage: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ===== VALIDATION CƠ BẢN =====
    if (!form.fullName.trim()) {
      setError('Vui lòng nhập Họ và tên.');
      return;
    }

    if (!form.password.trim()) {
      setError('Vui lòng nhập Mật khẩu.');
      return;
    }

    const contact = form.emailOrPhone.trim();
    if (!contact) {
      setError('Vui lòng nhập Số điện thoại hoặc email.');
      return;
    }

    if (!isEmail(contact) && !isPhone(contact)) {
      setError('Vui lòng nhập đúng định dạng Số điện thoại hoặc email.');
      return;
    }

    // Xác định sẽ gửi lên BE là email hay phone
    let email: string | undefined;
    let phone: string | undefined;

    if (isEmail(contact)) {
      email = contact;
    } else if (isPhone(contact)) {
      // Có thể chuẩn hoá digitsOnly nếu muốn
      phone = contact;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName: form.fullName.trim(),
        email,
        phone,
        password: form.password,
        role: form.role,
        profile: {
          avatarImage: form.profile.avatarImage || undefined,
          dob: form.profile.dob || undefined,
          gender: form.profile.gender || undefined,
          grade:
            typeof form.profile.grade === 'number'
              ? form.profile.grade
              : undefined,
          slogen: form.profile.slogen || undefined,
        },
      };

      await registerUser(payload, setUser);

      // Thành công
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err: any) {
      console.error('[RegisterForm] Error:', err);

      // err.message ở đây CHÍNH LÀ message đã được authServiceApi "extract" từ edu-be
      let message =
        err?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.';

      // Nếu vì lý do nào đó vẫn lọt generic Axios message thì chặn lại
      if (/Request failed with status code/i.test(message)) {
        message = 'Đăng ký thất bại. Vui lòng thử lại sau.';
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      {error && <p className={styles.error}>{error}</p>}

      {/* noValidate để tắt HTML5 validation mặc định của browser */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* ===== KHUNG TRÊN: THÔNG TIN TÀI KHOẢN ===== */}
        <div className={styles.topFrame}>
          <div className={styles.topFrameTitle}>Thông tin tài khoản</div>

          <div className={styles.topSection}>
            {/* Hàng 1 – Số điện thoại hoặc email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Số điện thoại hoặc email {' '}
                <span className={styles.requiredMark}>*</span>
              </label>
              <input
                type="text" // KHÔNG dùng type="email" để cho phép phone
                value={form.emailOrPhone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, emailOrPhone: e.target.value }))
                }
                placeholder="Email (ví dụ me@family.vn) hoặc số điện thoại"
                className={styles.input}
              />
            </div>

            {/* Hàng 2 – (để trống hoặc dùng cho field khác sau này) */}
            <div className={styles.fieldGroup}></div>

            {/* Hàng 3 – Mật khẩu* */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Mật khẩu <span className={styles.requiredMark}>*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Tối thiểu 6 ký tự"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* ===== PHẦN DƯỚI: KHUNG THÔNG TIN CÁ NHÂN ===== */}
        <div className={styles.bottomFrame}>
          <div className={styles.bottomFrameTitle}>Thông tin cá nhân</div>

          <div className={styles.twoColumnGrid}>
            {/* Hàng 1: Họ và tên (full width) */}
            <div className={`${styles.fieldGroup} ${styles.fullNameField}`}>
              <label className={styles.label}>
                Họ và tên <span className={styles.requiredMark}>*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="VD: Nguyễn Văn A"
                className={styles.input}
              />
            </div>

            {/* Hàng 2: Ảnh đại diện – Slogan */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.inputFile}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Slogan học tập</label>
              <input
                type="text"
                value={form.profile.slogen}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      slogen: e.target.value,
                    },
                  }))
                }
                placeholder="VD: Mỗi ngày tiến bộ một chút"
                className={styles.input}
              />
            </div>

            {/* Hàng 3: Ngày sinh – Lớp học */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ngày sinh</label>
              <input
                type="date"
                value={form.profile.dob}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      dob: e.target.value,
                    },
                  }))
                }
                className={styles.input}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Lớp học (tùy chọn)</label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.profile.grade ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    profile: {
                      ...prev.profile,
                      grade: value === '' ? undefined : Number(value),
                    },
                  }));
                }}
                placeholder="VD: 6, 7, 8..."
                className={styles.input}
              />
            </div>

            {/* Hàng 4: Giới tính – Bạn là */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Giới tính</label>
              <div className={styles.radioRow}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={form.profile.gender === 'male'}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        profile: {
                          ...prev.profile,
                          gender: e.target.value as Gender,
                        },
                      }))
                    }
                  />
                  Nam
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.profile.gender === 'female'}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        profile: {
                          ...prev.profile,
                          gender: e.target.value as Gender,
                        },
                      }))
                    }
                  />
                  Nữ
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={form.profile.gender === 'other'}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        profile: {
                          ...prev.profile,
                          gender: e.target.value as Gender,
                        },
                      }))
                    }
                  />
                  Không chia sẻ
                </label>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Bạn là</label>
              <div className={styles.radioRow}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value="parent"
                    checked={form.role === 'parent'}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, role: 'parent' }))
                    }
                  />
                  Phụ huynh
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={form.role === 'student'}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, role: 'student' }))
                    }
                  />
                  Học sinh
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
