import React, { useState } from 'react';
import { useUser } from '../../../../app/context/UserContext';
import { login } from '../../../BM/api/authServiceApi';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const isEmail = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
};

const isPhone = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  // Cho phép nhập kiểu: 0123456789, 0987 654 321, +84 912 345 678 ...
  const digitsOnly = trimmed.replace(/[^\d]/g, '');
  // Số điện thoại VN thường 9–11 số sau khi bỏ ký tự đặc biệt
  return digitsOnly.length >= 9 && digitsOnly.length <= 11;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { setUser } = useUser();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const identifier = emailOrPhone.trim();

    if (!identifier) {
      setError('Vui lòng nhập Số điện thoại hoặc email.');
      return;
    }

    if (!isEmail(identifier) && !isPhone(identifier)) {
      setError('Vui lòng nhập đúng định dạng Số điện thoại hoặc email.');
      return;
    }

    if (!password.trim()) {
      setError('Vui lòng nhập Mật khẩu.');
      return;
    }

    try {
      setSubmitting(true);
      await login(
        {
          emailOrPhone: identifier,
          password,
        },
        setUser
      );

      // Thành công: callback về HomePage / SubscriptionPage để đóng popup
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('[LoginForm] Lỗi đăng nhập:', err);

      // err.message ở đây CHÍNH LÀ message đã được authServiceApi "extract" từ edu-be
      let message: string =
        err?.message || 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau.';

      // Nếu vì lý do nào đó vẫn lọt message generics của Axios thì chặn lại
      if (/Request failed with status code/i.test(message)) {
        message = 'Có lỗi trong quá trình xử lý. Vui lòng thử lại sau.';
      }

      // Ví dụ: BE trả "Tài khoản hoặc mật khẩu không đúng." → hiển thị nguyên văn
      // Ví dụ: BE trả "Có lỗi trong quá trình xử lý." → hiển thị nguyên văn
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Số điện thoại hoặc email</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="Nhập Số điện thoại hoặc email (vd: me@family.vn)"
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu tài khoản"
            className={styles.input}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
