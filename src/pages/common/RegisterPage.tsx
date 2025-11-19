import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../app/context/UserContext';
import styles from './RegisterPage.module.css';
import { registerUser } from '../../features/BM/services/authService'; // ✅ thay vì register


export default function RegisterPage() {
  const { setUser } = useUser();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    profile: {
      avatarImage: '',
      dob: '',
      gender: '',
      grade: undefined as number | undefined,
      slogen: ''
    }
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          profile: { ...prev.profile, avatarImage: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await registerUser(form, setUser);
    navigate('/');
  } catch (e: any) {
    console.error('[Register] Error:', e);
    setError(e.message || 'Đăng ký thất bại');
  }
};

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Tạo tài khoản</h1>
        <p className={styles.subtitle}>Điền thông tin để đăng ký tài khoản mới</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>

          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên *"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className={styles.requiredInput}
            required
          />

          <label className={styles.labelHighlight}>Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={styles.input}
          />

          <label className={styles.labelHighlight}>Slogen học tập</label>

          <input
            type="text"
            placeholder="VD: Mỗi ngày tiến bộ một chút"
            value={form.profile.slogen}
            onChange={(e) =>
              setForm({
                ...form,
                profile: { ...form.profile, slogen: e.target.value }
              })
            }
            className={styles.input}
          />
          <p style={{ fontSize: '13px', color: '#e53935', textAlign: 'left' }}>
            * Bắt buộc: Nhập ít nhất một trong hai trường Email hoặc Số điện thoại
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={styles.input}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu *"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={styles.requiredInput}
            required
          />

          {/* ==== PROFILE FIELDS ==== */}


          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Ngày sinh</label>

          <input
            type="date"
            placeholder="Ngày sinh"
            value={form.profile.dob}
            onChange={(e) => setForm({ ...form, profile: { ...form.profile, dob: e.target.value } })}
            className={styles.input}
          />

          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Giới tính</label>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
            <label style={{ fontSize: '16px' }}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.profile.gender === 'male'}
                onChange={(e) =>
                  setForm({ ...form, profile: { ...form.profile, gender: e.target.value } })
                }
              />{' '}
              Nam
            </label>
            <label style={{ fontSize: '16px' }}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.profile.gender === 'female'}
                onChange={(e) =>
                  setForm({ ...form, profile: { ...form.profile, gender: e.target.value } })
                }
              />{' '}
              Nữ
            </label>
            <label style={{ fontSize: '16px' }}>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={form.profile.gender === 'other'}
                onChange={(e) =>
                  setForm({ ...form, profile: { ...form.profile, gender: e.target.value } })
                }
              />{' '}
              Khác
            </label>
          </div>

          <input
            type="number"
            placeholder="Lớp học (VD: 6, 7, 8)"
            value={form.profile.grade ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setForm({
                ...form,
                profile: {
                  ...form.profile,
                  grade: value === '' ? undefined : Number(value)
                }
              });
            }}
            className={styles.input}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.linkBtn} onClick={() => navigate('/login')}>
              Đã có tài khoản?
            </button>
            <button type="submit" className={styles.nextBtn}>Đăng ký</button>
          </div>
        </form>
      </div>
    </div>
  );
}
