// src/pages/CourseContentPage.tsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CourseContent from '../components/course/CourseContent';
import styles from './CourseContentPage.module.css';

const CoursePage = () => {
  const { id } = useParams();
  const location = useLocation();

  return (
    <div className={styles.pageContainer}>
      <Header fixed />
      <main className={styles.mainContent}>
        <CourseContent courseId={id!} />
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
