// src/components/course/CoursePreview.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CoursePreview.module.css';
import { getCourseById } from '../../services/courseService';
import { FeedbackAnimation } from '../animation/FeedbackAnimation';

interface CoursePreviewProps {
  courseId: string;
  query?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  roadmapImageUrl?: string;
}

const animationOptions = [
  'confetti',
  'bounce',
  'shake',
  'fade-glow',
  'zoom-in',
  'framer-pop',
  'framer-fade-in'
];

const getRandomAnimation = (): string => {
  const index = Math.floor(Math.random() * animationOptions.length);
  return animationOptions[index];
};

const CoursePreview: React.FC<CoursePreviewProps> = ({ courseId }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<string | null>(null);

  const handleContinue = () => {
    navigate(`/courses/${courseId}`);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('[CoursePreview] Chuẩn bị tải dữ liệu khoá học:', courseId);
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();

    // 👇 Hiển thị hiệu ứng animation khi vào trang
    const random = getRandomAnimation();
    setAnimationType(random);

    // ⏱️ Tắt animation sau 2.5 giây
    const timer = setTimeout(() => setAnimationType(null), 2500);
    return () => clearTimeout(timer);
  }, [courseId]);

  if (loading) return <p>Đang tải khóa học...</p>;
  if (error || !course) return <p>Lỗi: {error || 'Không tìm thấy khóa học'}</p>;

  return (
    <div className={styles.container}>
      {/* 🎉 Hiển thị animation */}
      <FeedbackAnimation animationType={animationType} />

      <div className={styles.main}>
        <div className={styles.imageSection}>
          <img
            src={course.roadmapImageUrl || require('../../assets/images/MathProcess.png')}
            alt={`Lộ trình: ${course.title}`}
            className={styles.previewImage}
          />
        </div>

        <div className={styles.descriptionSection}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <button className={styles.continueButton} onClick={handleContinue}>
            Vào học
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
