import React, { useEffect, useState } from 'react';
import styles from './CourseWeek.module.css';

interface Video {
  id: number;
  title: string;
  url: string;
}

interface Worksheet {
  id: number;
  title: string;
}

interface Lesson {
  id: number;
  step: number;
  title: string;
  videos?: Video[];
  worksheets?: Worksheet[];
}

interface Week {
  id: number;
  week_number: number;
  title: string;
  description: string;
  lessons?: Lesson[];
}

const CourseWeek: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        const res = await fetch(`http://localhost:3100/courses/${courseId}/weeks`);
        if (!res.ok) throw new Error('Lỗi khi tải dữ liệu tuần học');
        const data = await res.json();
        setWeeks(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeks();
  }, [courseId]);

  if (loading) return <p>Đang tải dữ liệu tuần học...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.courseWeeks}>
      {weeks.map((week) => (
        <div key={week.id} className={`${styles.weekContainer} ${styles[`weekColor${(week.week_number - 1) % 4}`]}`}
>
          <div className={styles.description}>
            <h3 className={styles.title}>Tuần {week.week_number}: {week.title}</h3>
            <p>{week.description}</p>
          </div>

          <div className={styles.lesson}>
            {(week.lessons || []).map((lesson) => (
              <div key={lesson.id} className={styles.lessonBlock}>
                <p><strong>Bài học {lesson.step}:</strong> {lesson.title}</p>

                <div className={styles.lessonDetails}>
                  <p><strong>Video bài giảng:</strong></p>
                  <ul>
                    {lesson.videos?.length && lesson.videos.length > 0 ? lesson.videos.map(video => (
                      <li key={video.id}>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          {video.title}
                        </a>
                      </li>
                    )) : <li>Không có video bài giảng</li>}
                  </ul>

                  <p><strong>Phiếu bài tập:</strong></p>
                  <ul>
                    {(lesson.worksheets?.length ?? 0) > 0 ? lesson.worksheets!.map(ws => (
                      <li key={ws.id}>{ws.title}</li>
                    )) : <li>Không có phiếu bài tập</li>}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.statistics}>
            <p>Thống kê tuần học...</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseWeek;
