// src/pages/CourseContentPage.tsx
import React from 'react';
import Header from '../../app/layout/Header';
import Footer from '../../app/layout/Footer';
import CourseContent from '../../components/course/CourseContent';
import styles from './CourseContentPage.module.css';

const CoursePage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.headerSpacer} /> {/* ✅ Spacer tránh che nội dung */}
      <main className={styles.mainContent}>
        <CourseContent />
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
