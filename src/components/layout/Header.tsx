import React, { useState } from 'react';
import styles from './Header.module.css';
import avatarImg from '../../assets/images/avatar.png';
import { logout } from '../../features/BM/services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../app/context/UserContext';

const Header: React.FC<{ fixed?: boolean }> = ({ fixed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const role = user?.role || 'student';

  const handleLogout = async () => {
    try {
      await logout(setUser);
    } catch (e) {
      console.error('Lỗi đăng xuất', e);
    } finally {
      window.location.reload(); // ✅ Reload để giữ nguyên URL
    }
  };

  return (
    <>
      <header className={`${styles.header} ${fixed ? styles.fixed : ''}`}>
        <div className={styles.container}>
          <div className={styles.avatarSloganRow}>
            {/* Bên trái: avatar công ty + slogan hệ thống */}
            <div className={styles.leftSection}>
              <img src={avatarImg} alt="logo công ty" className={styles.avatar} />
              <p className={styles.systemSlogan}>
                Nỗ lực của con - Đồng hành của bố mẹ - Tận tâm của thầy cô !
              </p>
            </div>

            {/* Giữa: nút hướng dẫn + đăng xuất/đăng nhập + vai trò */}
            <div className={styles.rightSection}>
              <a
                href="/huong-dan-hoc"
                className={styles.guideButton}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/huong-dan-hoc';
                }}
              >
                Hướng dẫn học
              </a>

              <div className={styles.authButtons}>
                {user ? (
                  <button className={styles.logout} onClick={handleLogout}>
                    Đăng xuất
                  </button>
                ) : (
                  <>
                    <button
                      className={styles.login}
                      onClick={() => navigate('/login', { state: { from: location } })}
                    >
                      Đăng nhập
                    </button>
                    <button className={styles.register} onClick={() => navigate('/register')}>
                      Đăng ký
                    </button>
                  </>
                )}
              </div>

              {/* Hiển thị vai trò */}
              {user && (
                <div className={styles.roleBox}>
                  {role === 'parent' && <span className={styles.roleParent}>👨‍👩‍👧 Phụ huynh</span>}
                  {role === 'teacher' && <span className={styles.roleTeacher}>👩‍🏫 Giáo viên</span>}
                  {role === 'student' && <span className={styles.roleStudent}>👦 Học sinh</span>}
                </div>
              )}
            </div>

            {/* Bên phải nhất: Avatar + Slogan người dùng */}
            {user?.profile?.avatarImage && (
              <div className={styles.userAvatarContainer}>
                <div className={styles.userAvatarWrapper}>
                  <img
                    src={user.profile.avatarImage}
                    alt="Avatar người dùng"
                    className={styles.userAvatar}
                    onClick={() => setShowAvatarModal(true)}
                  />
                </div>
                {user.profile?.slogen && (
                  <p className={styles.userSlogan}>{user.profile.slogen}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal phóng to ảnh avatar */}
      {showAvatarModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAvatarModal(false)}>
          <img
            src={user?.profile?.avatarImage}
            alt="Avatar phóng to"
            className={styles.modalAvatar}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default Header;
