import React from 'react';
import Header from '../../app/layout/Header';
import Footer from '../../app/layout/Footer';
import TeacherDashboardContent from '../../components/teacher/TeacherDashboardContent'; // ✅ Tách phần nội dung chính
import styles from './TeacherDashboardPage.module.css';

const TeacherDashboardPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.headerSpacer} /> {/* ✅ Spacer tránh che nội dung dưới Header */}
      <main className={styles.mainContent}>
        <TeacherDashboardContent />
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboardPage;
