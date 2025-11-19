// src/components/teacher/TeacherClassView.tsx
import React from 'react';
import styles from './TeacherClassView.module.css';
import ClassList from './ClassList';
import ClassDetail from './ClassDetail';
import { TeacherClassSummary, StudentTaskItem } from '../../models/teacher.model';

interface Props {
  classSummaries: TeacherClassSummary[];
  students: StudentTaskItem[];
  onSelectClass: (classId: string, filterType?: StudentTaskItem['taskType']) => void;
}

const TeacherClassView: React.FC<Props> = ({
  classSummaries,
  students,
  onSelectClass,
}) => {
  return (
    <div className={styles.container}>
      <ClassList classSummaries={classSummaries} onSelectClass={onSelectClass} />
      <ClassDetail students={students} />
    </div>
  );
};

export default TeacherClassView;
