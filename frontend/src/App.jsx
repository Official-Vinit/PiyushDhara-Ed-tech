// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import CourseDashboard from './pages/CourseDashboard';
import UnitPage from './pages/UnitPage';
import HomeRedirect from './pages/HomeRedirect';

import './index.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeRedirect />} />
          <Route path="courses/:courseId" element={<CourseDashboard />} />
          <Route path="units/:unitId" element={<UnitPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;