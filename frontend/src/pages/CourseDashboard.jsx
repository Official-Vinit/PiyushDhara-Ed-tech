// src/pages/CourseDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config'; // Adjust path as needed

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
      {/* Header Area (matches your screenshot) */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold">Environment by Mrigank Sir</h1>
        {/* We can make this dynamic later */}
      </div>

      {/* Subject Tabs Area */}
      <nav className="flex border-b mb-6">
        {course.subjects.map(subject => (
          <button
            key={subject._id}
            onClick={() => setSelectedSubjectId(subject._id)}
            className={`
              py-3 px-6 font-medium text-lg
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

      {/* Units List Area (matches your second screenshot) */}
      <div className="space-y-4">
        {selectedSubject ? (
          selectedSubject.units.map((unit, index) => (
            <Link
              to={`/units/${unit._id}`} // This links to the next page!
              key={unit._id}
              className="flex justify-between items-center p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{unit.name}</h3>
                <p className="text-sm text-gray-500">
                  {unit.videos.length} Videos · {unit.notes ? '1 Note' : '0 Notes'}
                </p>
              </div>
              <span className="text-lg font-bold text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </span>
            </Link>
          ))
        ) : (
          <p>No subjects selected or this subject has no units.</p>
        )}

        {/* Show message if no units */}
        {selectedSubject && selectedSubject.units.length === 0 && (
          <p className="p-4 text-gray-500">No units found for this subject.</p>
        )}
      </div>
    </div>
  );
}

export default CourseDashboard;