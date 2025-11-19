import { useState } from 'react';
import { login } from '../../features/BM/services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../app/context/UserContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { setUser } = useUser();
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form, setUser);
      localStorage.setItem('access_token', res.data.token);
      navigate(from, { replace: true });  // 🔁 Trả về đúng trang trước đó
    } catch (e: any) {
      setError(e.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Đăng nhập</h1>
        <p className={styles.subtitle}>Sử dụng tài khoản của bạn để tiếp tục</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email hoặc số điện thoại"
            value={form.emailOrPhone}
            onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.input}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.linkBtn} onClick={() => navigate('/register')}>
              Tạo tài khoản
            </button>
            <button type="submit" className={styles.nextBtn}>Tiếp theo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
