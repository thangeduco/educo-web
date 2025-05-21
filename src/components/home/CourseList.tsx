// src/components/home/CourseList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CourseList.module.css';
import { isLoggedIn } from '../../services/auth';

const mockCourses = [
  { id: '1', grade: 'Toán 4', type: 'Cơ bản', subTypes: ['Kết nối tri thức'] },
  { id: '2', grade: 'Toán 4', type: 'Bổ trợ', subTypes: ['Kết nối tri thức'] },
  { id: '3', grade: 'Toán 4', type: 'Cơ bản', subTypes: ['Chân trời sáng tạo'] },
  { id: '4', grade: 'Toán 4', type: 'Bổ trợ', subTypes: ['Chân trời sáng tạo'] },
  { id: '5', grade: 'Toán 4', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '6', grade: 'Toán 4', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] },

  { id: '7', grade: 'Toán 5', type: 'Cơ bản', subTypes: ['Kết nối tri thức'] },
  { id: '8', grade: 'Toán 5', type: 'Bổ trợ', subTypes: ['Kết nối tri thức'] },
  { id: '9', grade: 'Toán 5', type: 'Cơ bản', subTypes: ['Chân trời sáng tạo'] },
  { id: '10', grade: 'Toán 5', type: 'Bổ trợ', subTypes: ['Chân trời sáng tạo'] },
  { id: '11', grade: 'Toán 5', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '12', grade: 'Toán 5', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] },


  { id: '13', grade: 'Toán 6', type: 'Cơ bản', subTypes: ['Kết nối tri thức'] },
  { id: '14', grade: 'Toán 6', type: 'Bổ trợ', subTypes: ['Kết nối tri thức'] },
  { id: '15', grade: 'Toán 6', type: 'Cơ bản', subTypes: ['Chân trời sáng tạo'] },
  { id: '16', grade: 'Toán 6', type: 'Bổ trợ', subTypes: ['Chân trời sáng tạo'] },
  { id: '17', grade: 'Toán 6', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '18', grade: 'Toán 6', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] },

  { id: '19', grade: 'Toán 7', type: 'Cơ bản', subTypes: ['Kết nối tri thức'] },
  { id: '20', grade: 'Toán 7', type: 'Bổ trợ', subTypes: ['Kết nối tri thức'] },
  { id: '21', grade: 'Toán 7', type: 'Cơ bản', subTypes: ['Chân trời sáng tạo'] },
  { id: '22', grade: 'Toán 7', type: 'Bổ trợ', subTypes: ['Chân trời sáng tạo'] },
  { id: '23', grade: 'Toán 7', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '24', grade: 'Toán 7', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] },

  { id: '25', grade: 'Toán 8', type: 'Cơ bản', subTypes: ['Kết nối tri thức'] },
  { id: '26', grade: 'Toán 8', type: 'Bổ trợ', subTypes: ['Kết nối tri thức'] },
  { id: '27', grade: 'Toán 8', type: 'Cơ bản', subTypes: ['Chân trời sáng tạo'] },
  { id: '28', grade: 'Toán 8', type: 'Bổ trợ', subTypes: ['Chân trời sáng tạo'] },
  { id: '29', grade: 'Toán 8', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '30', grade: 'Toán 8', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] },

  { id: '31', grade: 'Toán 9', type: 'Cơ bản', subTypes: ['Kết nối tri thức'] },
  { id: '32', grade: 'Toán 9', type: 'Bổ trợ', subTypes: ['Kết nối tri thức'] },
  { id: '33', grade: 'Toán 9', type: 'Cơ bản', subTypes: ['Chân trời sáng tạo'] },
  { id: '34', grade: 'Toán 9', type: 'Bổ trợ', subTypes: ['CChân trời sáng tạo'] },
  { id: '35', grade: 'Toán 9', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '36', grade: 'Toán 9', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] }
];

const CourseList = () => {
  const navigate = useNavigate();

  const handleCourseClick = (courseId: number) => {
    if (isLoggedIn()) {
      navigate(`/courses/${courseId}`); // đã đăng nhập
    } else {
      navigate(`/preview/${courseId}`); // chưa đăng nhập
    }

  };

  const leftGroups = [ // Cơ bản
    mockCourses.slice(0, 2), // Toán 4 Kết nối tri thức
    mockCourses.slice(2, 4), // Toán 4 Chân trời sáng tạo
    mockCourses.slice(4, 6),  // Toán 4 Cánh diều vàng

    mockCourses.slice(6, 8), // Toán 5 Kết nối tri thức
    mockCourses.slice(8, 10), // Toán 5 Chân trời sáng tạo
    mockCourses.slice(10, 12),  // Toán 5 Cánh diều vàng

    mockCourses.slice(12, 14), // Toán 6 Kết nối tri thức
    mockCourses.slice(14, 16), // Toán 6 Chân trời sáng tạo
    mockCourses.slice(16, 18)  // Toán 6 Cánh diều vàng
  ];

  const rightGroups = [ // Bổ trợ
    mockCourses.slice(18, 20), // Toán 7 Kết nối tri thức
    mockCourses.slice(20, 22), // Toán 7 Chân trời sáng tạo
    mockCourses.slice(22, 24),  // Toán 7 Cánh diều vàng

    mockCourses.slice(24, 26), // Toán 8 Kết nối tri thức
    mockCourses.slice(26, 28), // Toán 8 Chân trời sáng tạo
    mockCourses.slice(28, 30),  // Toán 8 Cánh diều vàng

    mockCourses.slice(30, 32), // Toán 9 Kết nối tri thức
    mockCourses.slice(32, 34), // Toán 9 Chân trời sáng tạo
    mockCourses.slice(34, 36)
  ];

  return (
    <div className={styles.columnsWrapper}>
      <div className={styles.column}>
        {leftGroups.map((group, i) => (
          <div key={i} className={styles.row}>
            {group.map((course, j) => {
              const isBasic = course.id.includes('basic');
              const index = i;

              return (
                <div
                  key={course.id}
                  className={`${styles.card} ${isBasic ? styles[`basicCard-${index}`] : styles[`advancedCard-${index}`]}`}
                  onClick={() => handleCourseClick(Number(course.id))}
                >
                  <div className={styles.cardSplit}>
                    <div className={styles.cardLeft}>{course.grade}</div>
                    <div className={styles.cardRight}>

                      <div className={styles.cardSubtype}>
                        {course.subTypes.map((b, idx) => (
                          <div key={idx}>{b}</div>
                        ))}
                      </div>
                      <div className={styles.cardTitle}>{course.type}</div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.column}>
        {rightGroups.map((group, i) => (
          <div key={i} className={styles.row}>
            {group.map((course, j) => {
              const isBasic = course.id.includes('basic');
              const index = i + 3;
              return (
                <div
                  key={course.id}
                  className={`${styles.card} ${isBasic ? styles[`basicCard-${index}`] : styles[`advancedCard-${i}`]}`}
                  onClick={() => handleCourseClick(Number(course.id))}
                >
                  <div className={styles.cardSplit}>
                    <div className={styles.cardLeft}>{course.grade}</div>
                    <div className={styles.cardRight}>

                      <div className={styles.cardSubtype}>
                        {course.subTypes.map((b, idx) => (
                          <div key={idx}>{b}</div>
                        ))}
                      </div>
                      <div className={styles.cardTitle}>{course.type}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
