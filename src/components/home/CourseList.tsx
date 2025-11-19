// src/components/home/CourseList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CourseList.module.css';
import { useUser } from '../../app/context/UserContext';
import StudentProgressTable from '../student/StudentProgressTable';

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
  { id: '34', grade: 'Toán 9', type: 'Bổ trợ', subTypes: ['Chân trời sáng tạo'] },
  { id: '35', grade: 'Toán 9', type: 'Cơ bản', subTypes: ['Cánh diều vàng'] },
  { id: '36', grade: 'Toán 9', type: 'Bổ trợ', subTypes: ['Cánh diều vàng'] }
];

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Modal state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  // Đồng bộ studentId theo cách của CourseContent.tsx
  useEffect(() => {
    const id = user?.id ?? null;
    setStudentId(id);
  }, [user]);

  const handleCourseClick = (courseId: number) => {
    if (user && studentId) {
      // Đã đăng nhập → bật popup StudentProgressTable
      setSelectedCourseId(courseId);
      setShowProgressModal(true);
    } else {
      // Chưa đăng nhập → đi trang preview
      navigate(`/preview/${courseId}`);
    }
  };

  // Đóng popup rồi điều hướng sang CourseContentPage
  const closeModalAndGo = () => {
    const id = selectedCourseId; // giữ lại trước khi reset state
    setShowProgressModal(false);
    setSelectedCourseId(null);
    if (id != null) {
      // Thay đường dẫn nếu route của bạn khác
      navigate(`/courses/${id}`);
    }
  };

  const leftGroups = [
    mockCourses.slice(0, 2),  mockCourses.slice(2, 4),  mockCourses.slice(4, 6),
    mockCourses.slice(6, 8),  mockCourses.slice(8, 10), mockCourses.slice(10, 12),
    mockCourses.slice(12, 14),mockCourses.slice(14, 16),mockCourses.slice(16, 18),
  ];
  const rightGroups = [
    mockCourses.slice(18, 20),mockCourses.slice(20, 22),mockCourses.slice(22, 24),
    mockCourses.slice(24, 26),mockCourses.slice(26, 28),mockCourses.slice(28, 30),
    mockCourses.slice(30, 32),mockCourses.slice(32, 34),mockCourses.slice(34, 36),
  ];

  return (
    <>
      <div className={styles.columnsWrapper}>
        <div className={styles.column}>
          {leftGroups.map((group, i) => (
            <div key={i} className={styles.row}>
              {group.map((course) => {
                const index = i; // dùng cho basicCard-*
                return (
                  <div
                    key={course.id}
                    className={`${styles.card} ${styles[`basicCard-${index}`]}`}
                    onClick={() => handleCourseClick(Number(course.id))}
                  >
                    <div className={styles.cardSplit}>
                      <div className={styles.cardLeft}>{course.grade}</div>
                      <div className={styles.cardRight}>
                        <div className={styles.cardSubtype}>
                          {course.subTypes.map((b, idx) => (<div key={idx}>{b}</div>))}
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
              {group.map((course) => (
                <div
                  key={course.id}
                  className={`${styles.card} ${styles[`advancedCard-${i}`]}`}
                  onClick={() => handleCourseClick(Number(course.id))}
                >
                  <div className={styles.cardSplit}>
                    <div className={styles.cardLeft}>{course.grade}</div>
                    <div className={styles.cardRight}>
                      <div className={styles.cardSubtype}>
                        {course.subTypes.map((b, idx) => (<div key={idx}>{b}</div>))}
                      </div>
                      <div className={styles.cardTitle}>{course.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal StudentProgressTable */}
      {showProgressModal && selectedCourseId !== null && studentId !== null && (
        // click nền tối cũng sẽ đóng + điều hướng
        <div className={styles.modalBackdrop} onClick={closeModalAndGo}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>🎯 Mục tiêu & Kết quả học tập</h3>
              {/* nút × cũng đóng + điều hướng */}
              <button className={styles.modalClose} onClick={closeModalAndGo} aria-label="Đóng">×</button>
            </div>
            <div className={styles.modalBody}>
              <StudentProgressTable
                studentId={studentId}
                courseId={selectedCourseId}
              />
              {/* (tuỳ chọn) bạn có thể thêm nút 'Bắt đầu học' để chủ động vào nội dung */}
              {/* <div className={styles.modalFooter}>
                <button className={styles.primaryBtn} onClick={closeModalAndGo}>Bắt đầu học</button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseList;
