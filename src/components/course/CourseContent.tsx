import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CourseHeader from './CourseHeader';
import CourseWeek from './CourseWeek';
import styles from './CourseContent.module.css';

interface Course {
  id: number;
  title: string;
  description: string;
}

const CourseContent: React.FC<{ courseId: string }> = ({ courseId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);


  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const startDate = '11/05/2025';
  const endDate = '11/12/2025';
  const completedCount = 20;
  const totalCount = 100;
  const numOfWeek = 6;
  const mockWeeks = [1, 2, 3];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3100/courses/${courseId}`);
        if (!response.ok) throw new Error('Không thể tải khóa học');
        const data = await response.json();
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
  if (error) return <p>Lỗi: {error}</p>;
  if (!course) return <p>Không tìm thấy khóa học</p>;

  const title = `${course.title}`;
  const description = `${course.description}`;

  return (
    <div className={styles.wrapper}>
      <CourseHeader
        courseTitle={title}
        courseDescription = {description}
        startDate={startDate}
        endDate={endDate}
        completedCount={completedCount}
        totalCount={totalCount}
        numOfWeek={numOfWeek}
      />
      {mockWeeks.map((week) => (
        <CourseWeek key={week} courseId={Number(courseId)} />
      ))}
    </div>
  );
};

export default CourseContent;
