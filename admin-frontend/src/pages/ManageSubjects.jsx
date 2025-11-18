// src/pages/ManageSubjects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageSubjects() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for the "Create New Subject" form
  const [newSubjectName, setNewSubjectName] = useState('');

  // 1. Fetch all courses (for the dropdown)
  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(response => {
        setCourses(response.data);
        // If there are courses, select the first one by default
        if (response.data.length > 0) {
          setSelectedCourseId(response.data[0]._id);
        }
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  // 2. Fetch subjects whenever the selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) {
      setSubjects([]); // Clear subjects if no course is selected
      return;
    }

    setLoading(true);
    // We fetch the full course details, which includes its subjects
    axios.get(`${API_URL}/api/courses/${selectedCourseId}`)
      .then(response => {
        // The 'subjects' array in the response is already populated!
        setSubjects(response.data.subjects);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, [selectedCourseId]); // This is the dependency

  // 3. Handle the "Create" form submission
  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName) {
      alert('Please enter a subject name.');
      return;
    }

    axios.post(`${API_URL}/api/subjects`, { name: newSubjectName, courseId: selectedCourseId })
      .then(response => {
        // Add the new subject to our list and clear the form
        setSubjects([...subjects, response.data]);
        setNewSubjectName('');
      })
      .catch(error => {
        console.error('Error creating subject:', error);
        alert('Failed to create subject.');
      });
  };

  // 4. Handle the "Delete" button click
  const handleDeleteSubject = (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    axios.delete(`${API_URL}/api/subjects/${subjectId}`)
      .then(response => {
        // Filter the deleted subject out of our list
        setSubjects(subjects.filter(subject => subject._id !== subjectId));
      })
      .catch(error => {
        console.error('Error deleting subject:', error);
        alert('Failed to delete subject.');
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Subjects</h1>

      {/* COURSE SELECTOR DROPDOWN */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <label htmlFor="course-select" className="block text-lg font-medium mb-2">
          Select Course:
        </label>
        <select
          id="course-select"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full p-3 border rounded-md"
        >
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* We only show the forms if a course is selected */}
      {selectedCourseId && (
        <>
          {/* CREATE SUBJECT FORM */}
          <form onSubmit={handleCreateSubject} className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Add Subject to {courses.find(c => c._id === selectedCourseId)?.name}</h2>
            <div className="flex">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="E.g., Environment"
                className="flex-grow p-3 border rounded-l-md"
              />
              <button type="submit" className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600">
                Create Subject
              </button>
            </div>
          </form>

          {/* LIST OF SUBJECTS FOR THIS COURSE */}
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold p-6 border-b">Existing Subjects</h2>
            {loading && <p className="p-6">Loading...</p>}

            <ul className="divide-y divide-gray-200">
              {!loading && subjects.length === 0 && (
                <p className="p-6 text-gray-500">No subjects found for this course.</p>
              )}
              {subjects.map(subject => (
                <li key={subject._id} className="flex justify-between items-center p-6">
                  <span className="text-lg font-medium">{subject.name}</span>
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageSubjects;