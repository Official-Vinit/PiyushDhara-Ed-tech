// src/pages/HomeRedirect.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function HomeRedirect() {
  const [firstCourseId, setFirstCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(response => {
        if (response.data && response.data.length > 0) {
          // Found courses, get the ID of the first one
          setFirstCourseId(response.data[0]._id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>; // Show loading
  }

  if (firstCourseId) {
    // We found a course, redirect to it
    return <Navigate to={`/courses/${firstCourseId}`} replace />;
  }

  // No courses found in database
  return <div className="p-8">No courses found.</div>;
}

export default HomeRedirect;