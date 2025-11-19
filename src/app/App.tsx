import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../features/BM/pages/HomePage';
// import CourseContentPage from './pages/student/CourseContentPage';
import ProductPreviewPage from '../features/BM/pages/ProductPreviewPage';
// import LoginPage from './pages/common/LoginPage';
// import RegisterPage from './pages/common/RegisterPage';
// import GuidePage from './pages/student/GuidePage';
import { UserProvider } from './context/UserContext';

// 👉 Các trang dành riêng cho giáo viên & phụ huynh
// import TeacherDashboard from './pages/teacher/TeacherDashboardPage';
// import ParentDashboard from './pages/parent/ParentDashboardPage';

const App = () => (
  <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/preview/products/:productCode" element={<ProductPreviewPage />} />
        {/* <Route path="/courses/:courseId" element={<CourseContentPage />} />
        <Route path="/preview/:courseId" element={<CoursePreviewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/huong-dan-hoc" element={<GuidePage />} /> */}

        {/* 👉 Bổ sung các route riêng */}
        {/* <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} /> */}
      </Routes>
    </Router>
  </UserProvider>
);

export default App;
