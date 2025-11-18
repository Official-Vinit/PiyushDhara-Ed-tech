// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// We will create these components in the next steps
import MainLayout from './layouts/MainLayout';
import CourseDashboard from './pages/CourseDashboard';
import UnitPage from './pages/UnitPage';
import HomeRedirect from './pages/HomeRedirect';

// We'll use Tailwind CSS for basic styling
import './index.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This MainLayout will contain our Sidebar */}
        <Route path="/" element={<MainLayout />}>
          {/* The "index" route, redirects to a default course */}
          <Route index element={<HomeRedirect />} />
          {/* This is the page from your first screenshot */}
          <Route path="courses/:courseId" element={<CourseDashboard />} />

          {/* This is the page from your second screenshot */}
          <Route path="units/:unitId" element={<UnitPage />} />
        </Route>

        {/* You could add 404 pages or other routes here */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;