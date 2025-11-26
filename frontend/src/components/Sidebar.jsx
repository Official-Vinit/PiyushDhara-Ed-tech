import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import API_URL from '../config'; // Ensure you import your API config

function Sidebar({ isOpen, closeSidebar }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses.');
        setLoading(false);
      });
  }, []);

  // Base classes for the sidebar container
  // - fixed: Floats on top for mobile
  // - md:static: Sits normally in the layout for desktop
  // - transform transition-transform: Animates the slide effect
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 bg-gray-50 border-r transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:static
  `;

  return (
    <>
      {/* MOBILE OVERLAY (Backdrop) */}
      {/* Clicking this dark background closes the menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR CONTENT */}
      <nav className={sidebarClasses}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Header with Close Button (Mobile Only) */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">PiyushDhara</h1>
            
            {/* Close 'X' Button - Only visible on Mobile */}
            <button 
              onClick={closeSidebar}
              className="md:hidden text-gray-500 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Study Packs</h2>
          
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-sm text-red-500">Error loading courses</div>}

          <ul className="space-y-2">
            {courses.map(course => (
              <li key={course._id}>
                <Link
                  to={`/courses/${course._id}`}
                  onClick={closeSidebar} // Close menu when a link is clicked on mobile
                  className={`
                    block px-4 py-3 rounded-lg font-medium transition-colors
                    ${course._id === courseId 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {course.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;