// src/components/course/CoursePreview.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CoursePreview.module.css';

interface CoursePreviewProps {
  courseId: string;
  query?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  roadmapImageUrl?: string; // nếu có ảnh lộ trình trong DB
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ courseId}) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    navigate(`/courses/${courseId}`);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log('Prepare get data:');
        const response = await fetch(`http://localhost:3100/courses/${courseId}`);
        if (!response.ok) throw new Error('Không thể tải thông tin khóa học');
        const data = await response.json();
        console.log('Fetched course data:', data);
        setCourse(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p>Đang tải khóa học...</p>;
  if (error || !course) return <p>Lỗi: {error || 'Không tìm thấy khóa học'}</p>;

  return (
    <div className={styles.container}>
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
