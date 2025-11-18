// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // 'Outlet' is where the child routes (e.g., CourseDashboard) will render
import Sidebar from '../components/Sidebar';

function MainLayout() {
  return (
    <div className="flex">
      {/* Our sidebar is fixed on the left */}
      <Sidebar />

      {/* The main content area grows to fill the rest of the space */}
      <main className="flex-1 h-screen overflow-y-auto p-8 bg-white">
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;