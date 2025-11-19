// src/pages/CoursePage.tsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../../app/layout/Header';
import Footer from '../../app/layout/Footer';
import CoursePreview from '../../components/course/CoursePreview';
import styles from './CoursePreviewPage.module.css';

const CoursePage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  return (
    <div className={styles.pageContainer}>
      <Header fixed />
      <main className={styles.mainContent}>
        <CoursePreview courseId={courseId!} query={location.search} />
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
