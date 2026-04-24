// src/pages/HomeRedirect.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function HomeRedirect() {
  const [firstCourseId, setFirstCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFirstCourse = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/api/courses`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setFirstCourseId(response.data[0]._id);
      }
    } catch (requestError) {
      console.error('Error fetching courses:', requestError);
      setError('Unable to load courses right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstCourse();
  }, []);

  if (loading) {
    return (
      <div className="surface-card p-8 text-center text-slate-600">Preparing your dashboard...</div>
    );
  }

  if (firstCourseId) {
    return <Navigate to={`/courses/${firstCourseId}`} replace />;
  }

  if (error) {
    return (
      <div className="surface-card border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={fetchFirstCourse}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="surface-card p-8 text-center text-slate-600">No courses found yet.</div>
  );
}

export default HomeRedirect;