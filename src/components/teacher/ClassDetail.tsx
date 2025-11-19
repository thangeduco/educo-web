// src/components/teacher/ClassDetail.tsx
import React from 'react';
import styles from './ClassDetail.module.css';
import { StudentTaskItem } from '../../models/teacher.model';

interface Props {
  students: StudentTaskItem[];
}

const ClassDetail: React.FC<Props> = ({ students }) => {
  return (
    <div className={styles.classDetail}>
      <h3>Chi tiết học sinh</h3>
      {students.length === 0 ? (
        <p>Chọn lớp hoặc mục cần xử lý để xem danh sách học sinh.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Học sinh</th>
              <th>Tuần</th>
              <th>Tên tuần</th>
              <th>BTVN</th>
              <th>File</th>
              <th>Loại xử lý</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td>{s.studentName}</td>
                <td>Tuần {s.weekNumber}</td>
                <td>{s.weekTitle}</td>
                <td>{s.homeworkTitle}</td>
                <td>
                  <a href={s.homeworkFileUrl} target="_blank" rel="noopener noreferrer">
                    📎 Tải xuống
                  </a>
                </td>
                <td>{s.taskType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassDetail;
