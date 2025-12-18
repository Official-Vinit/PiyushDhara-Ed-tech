import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import ManageCourses from './pages/ManageCourses';
import ManageSubjects from './pages/ManageSubjects';
import ManageUnits from './pages/ManageUnits';
import EditUnit from './pages/EditUnit';
import Login from './pages/Login'; // Import the new page

function App() {
  // Check if a token already exists in memory
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Whenever the token changes, configure axios to use it
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // 1. If NOT logged in, show ONLY the Login Page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // 2. If logged in, show the Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HEADER */}
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        <div className="space-x-4 flex items-center">
           <span className="text-sm text-gray-500">Logged in as Admin</span>
           <button onClick={handleLogout} className="text-red-500 text-sm hover:underline">Logout</button>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white h-[calc(100vh-64px)] shadow-md hidden md:block sticky top-16">
          <nav className="p-4 space-y-2">
            <Link to="/" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">Manage Courses</Link>
            <Link to="/subjects" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">Manage Subjects</Link>
            <Link to="/units" className="block p-3 rounded hover:bg-blue-50 text-gray-700 font-medium">Manage Units</Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ManageCourses />} />
            <Route path="/subjects" element={<ManageSubjects />} />
            <Route path="/units" element={<ManageUnits />} />
            <Route path="/unit/:unitId" element={<EditUnit />} />
            {/* Redirect any unknown routes back to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;