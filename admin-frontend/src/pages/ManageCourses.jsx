// src/pages/ManageCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the "Create New Course" form
  const [newCourseName, setNewCourseName] = useState('');

  // 1. Fetch all courses when component loads
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    // We can use '/api' because of our Vite proxy!
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
  };

  // 2. Handle the "Create" form submission
  const handleCreateCourse = (e) => {
    e.preventDefault(); // Stop the form from reloading the page
    if (!newCourseName) {
      alert('Please enter a course name.');
      return;
    }

    axios.post(`${API_URL}/api/courses`, { name: newCourseName })
      .then(response => {
        // Success! Add the new course to our list and clear the form
        setCourses([...courses, response.data]);
        setNewCourseName('');
      })
      .catch(error => {
        console.error('Error creating course:', error);
        alert('Failed to create course.');
      });
  };

  // 3. Handle the "Delete" button click
  const handleDeleteCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    axios.delete(`${API_URL}/api/courses/${courseId}`)
      .then(response => {
        // Success! Filter the deleted course out of our list
        setCourses(courses.filter(course => course._id !== courseId));
      })
      .catch(error => {
        console.error('Error deleting course:', error);
        alert('Failed to delete course.');
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>

      {/* CREATE COURSE FORM */}
      <form onSubmit={handleCreateCourse} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Create New Course</h2>
        <div className="flex">
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="E.g., Mechanical Engineering"
            className="flex-grow p-3 border rounded-l-md"
          />
          <button type="submit" className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600">
            Create
          </button>
        </div>
      </form>

      {/* LIST OF COURSES */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 border-b">Existing Courses</h2>
        {loading && <p className="p-6">Loading...</p>}
        {error && <p className="p-6 text-red-500">{error}</p>}

        <ul className="divide-y divide-gray-200">
          {courses.map(course => (
            <li key={course._id} className="flex justify-between items-center p-6">
              <span className="text-lg font-medium">{course.name}</span>
              <button
                onClick={() => handleDeleteCourse(course._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManageCourses;