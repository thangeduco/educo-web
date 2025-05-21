import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CourseList from '../components/home/CourseList';
import styles from './HomePage.module.css';

const HomePage = () => (
  <div className={styles.pageContainer}>
    <Header />
    <main className={styles.mainContent}>
      <CourseList />
    </main>
    <Footer />
  </div>
);

export default HomePage;