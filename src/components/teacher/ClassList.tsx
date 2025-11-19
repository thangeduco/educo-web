// src/components/teacher/ClassList.tsx
import React from 'react';
import styles from './ClassList.module.css';
import { TeacherClassSummary, StudentTaskItem } from '../../models/teacher.model';

interface Props {
  classSummaries: TeacherClassSummary[];
  onSelectClass: (classId: string, filterType?: StudentTaskItem['taskType']) => void;
}

const ClassList: React.FC<Props> = ({ classSummaries, onSelectClass }) => {
  return (
    <div className={styles.classList}>
      <h3>Lớp học của bạn</h3>
      {classSummaries.map((classItem) => (
        <div key={classItem.classId} className={styles.classItem}>
          <div
            className={styles.className}
            onClick={() => onSelectClass(classItem.classId)}
          >
            {classItem.className}
          </div>
          <div className={styles.classStats}>
            <span onClick={() => onSelectClass(classItem.classId, 'Chờ chấm BTVN')}>
              📄 {classItem.pendingHomework} chờ chấm
            </span>
            <span onClick={() => onSelectClass(classItem.classId, 'Chờ nhận xét tuần')}>
              🗒️ {classItem.pendingReview} chờ nhận xét
            </span>
            <span
              onClick={() => onSelectClass(classItem.classId, 'Chờ cập nhật nhận xét tuần')}
            >
              🖊️ {classItem.pendingUpdateReview} chờ cập nhật
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassList;
