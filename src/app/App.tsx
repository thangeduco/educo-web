import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../features/BM/pages/HomePage';
import ProductPreviewPage from '../features/BM/pages/ProductPreviewPage';
import ProductSubscriptionPage from '../features/BM/pages/SubscriptionPage';
import LoginPage from '../features/BM/components/users/LoginForm';
import { UserProvider } from './context/UserContext';
import { CourseWeekPage } from '../features/CM/pages/CourseWeekPage';

const App: React.FC = () => (
  <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/preview/products/:productCode"
          element={<ProductPreviewPage />}
        />
        <Route
          path="/subscription/:productCode"
          element={<ProductSubscriptionPage />}
        />
        {/* thêm route cho CourseWeekPage.tsx */}
        <Route
          path="/courses/:courseCode/weeks/:weekId"
          element={<CourseWeekPage />}
        />

        {/* Trang đăng nhập riêng (ngoài popup) */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  </UserProvider>
);

export default App;
