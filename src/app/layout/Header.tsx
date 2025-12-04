import React, { useState } from 'react';
import styles from './Header.module.css';
import avatarImg from '../../assets/images/avatar.png';
import { logout } from '../../features/BM/api/authServiceApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../app/context/UserContext';

type HeaderProps = {
  fixed?: boolean;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  fixed = false,
  onLoginClick,
  onRegisterClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const fullName = user?.fullName || (user as any)?.username;
  const avatarSrc = user?.profile?.avatarImage || avatarImg;

  const handleLogout = async () => {
    try {
      await logout(setUser);
    } catch (e) {
      console.error('Lỗi đăng xuất', e);
    } finally {
      //window.location.reload(); // Reload để giữ nguyên URL
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick(); // mở popup login từ HomePage
    } else {
      // fallback: điều hướng sang trang /login
      navigate('/login', { state: { from: location } });
    }
  };

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick(); // mở popup register từ HomePage
    } else {
      // fallback: điều hướng sang trang /register
      navigate('/register', { state: { from: location } });
    }
  };

  return (
    <>
      <header className={`${styles.header} ${fixed ? styles.fixed : ''}`}>
        <div className={styles.container}>
          <div className={styles.avatarSloganRow}>
            {/* Bên trái: avatar công ty + slogan hệ thống */}
            <div className={styles.leftSection}>
              <img
                src={avatarImg}
                alt="logo công ty"
                className={styles.avatar}
              />
              <p className={styles.systemSlogan}>
                Nỗ lực của con - Đồng hành của bố mẹ - Tận tâm của thầy cô !
              </p>
            </div>

            {/* Giữa: nút đăng nhập / đăng ký / avatar + fullName + slogan */}
            <div className={styles.rightSection}>
              <div className={styles.authButtons}>
                {user ? (
                  // ĐÃ ĐĂNG NHẬP: Hiển thị avatar + fullName + slogan ở giữa
                  <div className={styles.userInlineBlock}>
                    <div
                      className={styles.userAvatarWrapper}
                      onClick={() => setShowAvatarModal(true)}
                    >
                      <img
                        src={avatarSrc}
                        alt="Avatar người dùng"
                        className={styles.userAvatar}
                      />
                    </div>
                    <div className={styles.userText}>
                      {fullName && (
                        <div className={styles.fullName}>{fullName}</div>
                      )}
                      {user.profile?.slogen && (
                        <p className={styles.userSlogan}>
                          {user.profile.slogen}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // CHƯA ĐĂNG NHẬP: giữ nguyên login/register
                  <>
                    <button className={styles.login} onClick={handleLogin}>
                      Đăng nhập
                    </button>
                    <button
                      className={styles.register}
                      onClick={handleRegister}
                    >
                      Đăng ký
                    </button>
                  </>
                )}
              </div>

              {/* Bỏ hiển thị role – không render nữa */}
            </div>

            {/* Bên phải nhất: ĐỔI CHỖ -> giờ là nút Đăng xuất */}
            {user && (
              <div className={styles.userAvatarContainer}>
                <button className={styles.logout} onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal phóng to ảnh avatar */}
      {showAvatarModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAvatarModal(false)}
        >
          <img
            src={avatarSrc}
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
