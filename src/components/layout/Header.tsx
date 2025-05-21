import React from 'react';
import styles from './Header.module.css';
import avatarImg from '../../assets/images/avatar.png';

const Header: React.FC<{ fixed?: boolean }> = ({ fixed = false }) => (
    <header className={`${styles.header} ${fixed ? styles.fixed : ''}`}>
      <div className={styles.container}>
        <div className={styles.avatarSloganRow}>
          <div className={styles.leftSection}>
            <img src={avatarImg} alt="avatar" className={styles.avatar} />
            <p className={styles.slogan}>
              Nỗ lực của con - Đồng hành của bố mẹ - Tận tâm của thầy cô !
            </p>
          </div>
          <div className={styles.rightSection}>
            <a href="/huong-dan-hoc" className={styles.guideButton}>Hướng dẫn học</a>
            <div className={styles.authButtons}>
              <button className={styles.login}>Đăng nhập</button>
              <button className={styles.register}>Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
  

export default Header;