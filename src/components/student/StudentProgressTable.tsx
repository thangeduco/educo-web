// src/components/analytics/StudentProgressTable.tsx
import React, { useEffect, useState } from 'react';
import './StudentProgressTable.css';
import { getStudentNearProgressSummary } from '../../services/learningService';
import { StudentNearProgressData as ProgressData } from '../../services/dtos/student-near-progress-data.dto';

interface StudentProgressTableProps {
  studentId: number;
  courseId: number; // phù hợp với API
}

const StudentProgressTable: React.FC<StudentProgressTableProps> = ({ studentId, courseId }) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  // State lưu mục tiêu ngày của học sinh (trong phiên)
  const [dailyGoals, setDailyGoals] = useState({
    highlight: false, // Được thầy khen ngợi
    badges: '',       // số huy hiệu mục tiêu
    quizzes: '',      // số câu trả lời đúng mục tiêu
    homework: '',     // số bài tập về nhà mục tiêu
    rank: false       // Leo lên số 1
  });

  useEffect(() => {
    const loadProgress = async () => {
      if (!studentId || !courseId) return;
      try {
        setLoading(true);
        const data = await getStudentNearProgressSummary(studentId, courseId);
        setProgressData(data || []);
      } catch (err) {
        console.error('❌ Failed to fetch progress summary:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [studentId, courseId]);

  if (loading) {
    return <div className="student-progress-table">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="student-progress-table">
      <h2 className="title">📊 Kết quả học tập gần đây</h2>
      <table>
        <thead>
          <tr>
            <th>Tuần / Thứ</th>
            <th>Thành tích nổi bật</th>
            <th>🎖️ Huy hiệu</th>
            <th>🧠 Quiz đúng</th>
            <th>📘 BTVN đúng</th>
            <th>🏅 Xếp hạng</th>
          </tr>
        </thead>

        <tbody>
          {/* Hàng đăng ký mục tiêu ngày hôm nay */}
          <tr className="daily-goal-row">
            <td className="goal-label">Mục tiêu ngày hôm nay</td>
            <td>
              <label>
                <input
                  type="checkbox"
                  checked={dailyGoals.highlight}
                  onChange={(e) =>
                    setDailyGoals((prev) => ({ ...prev, highlight: e.target.checked }))
                  }
                />
                Được thầy khen ngợi
              </label>
            </td>
            <td>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="50 huy hiệu"
                value={dailyGoals.badges}
                onChange={(e) =>
                  setDailyGoals((prev) => ({ ...prev, badges: e.target.value }))
                }
              />
            </td>
            <td>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="30 câu trả lời đúng"
                value={dailyGoals.quizzes}
                onChange={(e) =>
                  setDailyGoals((prev) => ({ ...prev, quizzes: e.target.value }))
                }
              />
            </td>
            <td>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="3 bài tập về nhà"
                value={dailyGoals.homework}
                onChange={(e) =>
                  setDailyGoals((prev) => ({ ...prev, homework: e.target.value }))
                }
              />
            </td>
            <td>
              <label>
                <input
                  type="checkbox"
                  checked={dailyGoals.rank}
                  onChange={(e) =>
                    setDailyGoals((prev) => ({ ...prev, rank: e.target.checked }))
                  }
                />
                Leo lên số 1
              </label>
            </td>
          </tr>

          {/* Dữ liệu thành tích gần đây */}
          {progressData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.label}</td>
              <td>{item.highlight}</td>
              <td>{item.badges}</td>
              <td>{item.quizzes}</td>
              <td>{item.homework}</td>
              <td>{item.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentProgressTable;
