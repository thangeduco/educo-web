// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CourseContentPage from './pages/CourseContentPage';
import CoursePreviewPage from './pages/CoursePreviewPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses/:id" element={<CourseContentPage />} />
      <Route path="/preview/:id" element={<CoursePreviewPage />} />
    </Routes>
  </Router>
);

export default App;
