// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import API_URL from '../config';

function Sidebar() {
  const [courses, setCourses] = useState([]); // To store our list of courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams(); // To know which course is active

  useEffect(() => {
    // Fetch data from our API
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
  }, []); // The empty array means this runs only once on mount

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <nav className="w-64 h-screen bg-gray-50 p-4 border-r">
      <div className="mb-8">
        {/* You can put your PiyushDhara logo here */}
        <h1 className="text-2xl font-bold">PiyushDhara</h1>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Study Packs</h2>
      <ul>
        {/* We map over the 'courses' state and create a link for each one */}
        {courses.map(course => (
          <li key={course._id} className="mb-2">
            <Link
              to={`/courses/${course._id}`}
              className={`
                block p-3 rounded-lg font-medium
                ${course._id === courseId ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}
              `}
            >
              {course.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;