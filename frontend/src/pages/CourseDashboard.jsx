// src/pages/CourseDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config'; 

function CourseDashboard() {
  const { courseId } = useParams(); 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/courses/${courseId}`)
      .then(response => {
        setCourse(response.data);
        if (response.data.subjects && response.data.subjects.length > 0) {
          setSelectedSubjectId(response.data.subjects[0]._id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course data:', error);
        setError('Failed to load course data.');
        setLoading(false);
      });
  }, [courseId]); 

  const getSelectedSubject = () => {
    if (!course || !course.subjects) return null;
    return course.subjects.find(s => s._id === selectedSubjectId);
  };

  if (loading) return <div className="p-4">Loading course...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!course) return <div className="p-4">Course not found.</div>;

  const selectedSubject = getSelectedSubject();

  return (
    <div>
      {/* --- DYNAMIC HEADER AREA --- */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm flex justify-between items-center">
        <div>
          {/* 1. Dynamic Course Name */}
          <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
          
          {/* 2. Dynamic Teacher Name (with fallback) */}
          <p className="text-xl text-gray-500 mt-2 font-medium">
            By {course.teacher} 
          </p>
        </div>

        {/* 3. Teacher Image (Right Side) */}
        <div className="flex-shrink-0 ml-4">
          <img 
            // Use course.teacherImage if it exists, otherwise generate an avatar
            src={course.teacherImage || `https://ui-avatars.com/api/?name=${course.teacher || 'Teacher'}&background=random`} 
            alt="Teacher" 
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-md"
          />
        </div>
      </div>

      {/* Subject Tabs Area */}
      <nav className="flex border-b mb-6 overflow-x-auto">
        {course.subjects.map(subject => (
          <button
            key={subject._id}
            onClick={() => setSelectedSubjectId(subject._id)}
            className={`
              py-3 px-6 font-medium text-lg whitespace-nowrap
              ${selectedSubjectId === subject._id
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 hover:text-gray-800'
              }
            `}
          >
            {subject.name}
          </button>
        ))}
      </nav>

      {/* Units List Area */}
      <div className="space-y-4">
        {selectedSubject ? (
          selectedSubject.units.map((unit, index) => (
            <Link
              to={`/units/${unit._id}`}
              key={unit._id}
              className="flex justify-between items-center p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {unit.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {unit.videos.length} Videos · {unit.notes ? unit.notes.length : 0} Notes
                </p>
              </div>
              <span className="text-2xl font-bold text-gray-200 group-hover:text-blue-100 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
            </Link>
          ))
        ) : (
          <p className="p-4 text-gray-500">No subjects available.</p>
        )}

        {selectedSubject && selectedSubject.units.length === 0 && (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">No units added to this subject yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDashboard;