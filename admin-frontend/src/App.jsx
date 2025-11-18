// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ManageCourses from './pages/ManageCourses'; 
import ManageSubjects from './pages/ManageSubjects';
import ManageUnits from './pages/ManageUnits';
import EditUnit from './pages/EditUnit';
import './index.css'; // Make sure Tailwind is imported

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Simple Sidebar */}
        <nav className="w-64 bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-6">PiyushDhara Admin</h1>
          <ul>
            <li>
              <Link to="/" className="block py-2 px-3 rounded hover:bg-gray-700">
                Manage Courses
              </Link>
            </li>
            <li>
              <Link to="/subjects" className="block py-2 px-3 rounded hover:bg-gray-700">
                Manage Subjects
              </Link>
            </li>
            <li> 
              <Link to="/units" className="block py-2 px-3 rounded hover:bg-gray-700">
                Manage Units
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-gray-100">
          <Routes>
            <Route path="/" element={<ManageCourses />} />
            <Route path="/subjects" element={<ManageSubjects />} />
            <Route path="/units" element={<ManageUnits />} />
            <Route path="/unit/:unitId" element={<EditUnit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;