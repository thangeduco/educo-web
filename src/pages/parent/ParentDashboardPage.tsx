// src/pages/ParentDashboard.tsx
import React from 'react';
import Header from '../../app/layout/Header';
import Footer from '../../app/layout/Footer';
import ParentDashboardContent from '../../components/parent/ParentDashboardContent'; // ✅ Bạn nên tách phần chính thành 1 component
import styles from './ParentDashboardPage.module.css';

const ParentDashboardPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.headerSpacer} /> {/* ✅ Spacer tránh che nội dung */}
      <main className={styles.mainContent}>
        <ParentDashboardContent />
      </main>
      <Footer />
    </div>
  );
};

export default ParentDashboardPage;
