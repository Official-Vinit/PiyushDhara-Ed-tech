import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import ManageCourses from './pages/ManageCourses';
import ManageSubjects from './pages/ManageSubjects';
import ManageUnits from './pages/ManageUnits';
import EditUnit from './pages/EditUnit';
import Login from './pages/Login'; // Import the new page

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  const navLinkClass = ({ isActive }) => (
    `block rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
    }`
  );

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PiyushDhara" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 md:text-xl">PiyushDhara Admin</h1>
              <p className="text-xs text-slate-500">Content management workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 md:inline-flex">
              Logged in as Admin
            </span>
            <button type="button" onClick={handleLogout} className="admin-btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 md:px-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <nav className="admin-card sticky top-24 space-y-1 p-3">
            <NavLink to="/" end className={navLinkClass}>Manage Courses</NavLink>
            <NavLink to="/subjects" className={navLinkClass}>Manage Subjects</NavLink>
            <NavLink to="/units" className={navLinkClass}>Manage Units</NavLink>
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <nav className="admin-card flex gap-2 overflow-x-auto p-2 md:hidden">
            <NavLink to="/" end className={navLinkClass}>Courses</NavLink>
            <NavLink to="/subjects" className={navLinkClass}>Subjects</NavLink>
            <NavLink to="/units" className={navLinkClass}>Units</NavLink>
          </nav>

          <main className="admin-card p-4 md:p-6">
            <Routes>
              <Route path="/" element={<ManageCourses />} />
              <Route path="/subjects" element={<ManageSubjects />} />
              <Route path="/units" element={<ManageUnits />} />
              <Route path="/unit/:unitId" element={<EditUnit />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;