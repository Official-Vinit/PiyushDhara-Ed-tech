// src/pages/ManageUnits.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import API_URL from '../config';

function ManageUnits() {
  // State for dropdowns
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // State for subjects (depends on selected course)
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // State for units (depends on selected subject)
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for the "Create New Unit" form
  const [newUnitName, setNewUnitName] = useState('');

  // 1. Fetch all courses (for the first dropdown)
  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(response => {
        setCourses(response.data);
        if (response.data.length > 0) {
          setSelectedCourseId(response.data[0]._id);
        }
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  // 2. Fetch subjects whenever the selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) {
      setSubjects([]);
      setSelectedSubjectId('');
      return;
    }

    axios.get(`${API_URL}/api/courses/${selectedCourseId}`)
      .then(response => {
        setSubjects(response.data.subjects);
        if (response.data.subjects.length > 0) {
          setSelectedSubjectId(response.data.subjects[0]._id);
        } else {
          setSelectedSubjectId('');
        }
      })
      .catch(error => console.error('Error fetching subjects:', error));
  }, [selectedCourseId]); // Runs when selectedCourseId changes

  // 3. Fetch units whenever the selectedSubjectId changes
  useEffect(() => {
    if (!selectedSubjectId) {
      setUnits([]);
      return;
    }

    setLoading(true);
    // We can't get units from the /api/courses route,
    // so we need to fetch the specific subject
    // Let's reuse the /api/units/:unitId from the student app... oh wait.
    // We don't have a route for "get all units for a subject".
    // Let's just use the subject list we already have.
    // A better API would be /api/subjects/:subjectId/units

    // Simple (but less robust) way:
    const selectedSubject = subjects.find(s => s._id === selectedSubjectId);
    if (selectedSubject && selectedSubject.units) {
       // We need to fetch the full unit details, not just IDs
       // For now, let's just use the names.
       // This is a flaw in our API design, but let's continue for now.

       // Correction: The /api/courses/:courseId route *does* populate units.
       const course = courses.find(c => c._id === selectedCourseId);
       if(course && course.subjects) {
         const subject = course.subjects.find(s => s._id === selectedSubjectId);
         if (subject && subject.units) {
           setUnits(subject.units);
         }
       }
       // We will fix this properly if it doesn't work.
       // Let's try fetching the subject directly...

       // **Proper Fix:** The /api/courses/:courseId route DOES populate units deep.
       // We just need to read the data correctly.
       axios.get(`${API_URL}/api/courses/${selectedCourseId}`)
        .then(res => {
            const subject = res.data.subjects.find(s => s._id === selectedSubjectId);
            if (subject && subject.units) {
                setUnits(subject.units);
            } else {
                setUnits([]);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching units", err);
            setLoading(false);
        })

    } else {
        setUnits([]);
    }
  }, [selectedSubjectId, selectedCourseId, courses, subjects]); // Runs when subject changes

  // 4. Handle the "Create" form submission
  const handleCreateUnit = (e) => {
    e.preventDefault();
    if (!newUnitName) {
      alert('Please enter a unit name.');
      return;
    }

    axios.post(`${API_URL}/api/units`, { name: newUnitName, subjectId: selectedSubjectId })
      .then(response => {
        setUnits([...units, response.data]);
        setNewUnitName('');
      })
      .catch(error => {
        console.error('Error creating unit:', error);
        alert('Failed to create unit.');
      });
  };

  // 5. Handle the "Delete" button click
  const handleDeleteUnit = (unitId) => {
    if (!window.confirm('Are you sure you want to delete this unit?')) {
      return;
    }

    axios.delete(`${API_URL}/api/units/${unitId}`)
      .then(response => {
        setUnits(units.filter(unit => unit._id !== unitId));
      })
      .catch(error => {
        console.error('Error deleting unit:', error);
        alert('Failed to delete unit.');
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Units</h1>

      {/* CASCADING SELECTORS */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md grid grid-cols-2 gap-6">
        {/* 1. Course Selector */}
        <div>
          <label htmlFor="course-select" className="block text-lg font-medium mb-2">
            1. Select Course:
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

        {/* 2. Subject Selector */}
        <div>
          <label htmlFor="subject-select" className="block text-lg font-medium mb-2">
            2. Select Subject:
          </label>
          <select
            id="subject-select"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full p-3 border rounded-md"
            disabled={subjects.length === 0} // Disable if no subjects
          >
            {subjects.length > 0 ? (
              subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))
            ) : (
              <option>No subjects found for this course</option>
            )}
          </select>
        </div>
      </div>

      {/* We only show the forms if a subject is selected */}
      {selectedSubjectId && (
        <>
          {/* CREATE UNIT FORM */}
          <form onSubmit={handleCreateUnit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Add Unit to Selected Subject</h2>
            <div className="flex">
              <input
                type="text"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                placeholder="E.g., CH 01: Water Demand"
                className="flex-grow p-3 border rounded-l-md"
              />
              <button type="submit" className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600">
                Create Unit
              </button>
            </div>
          </form>

          {/* LIST OF UNITS FOR THIS SUBJECT */}
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold p-6 border-b">Existing Units</h2>
            {loading && <p className="p-6">Loading...</p>}

            <ul className="divide-y divide-gray-200">
              {!loading && units.length === 0 && (
                <p className="p-6 text-gray-500">No units found for this subject.</p>
              )}
                {units.map(unit => (
                  <li key={unit._id} className="flex justify-between items-center p-6">
                    <span className="text-lg font-medium">{unit.name}</span>
                    <div className="flex space-x-3">
                      <Link
                        to={`/unit/${unit._id}`} // <-- Links to the new page
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                      >
                        Edit Content
                      </Link>
                      <button
                        onClick={() => handleDeleteUnit(unit._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                      >
                        Delete Unit
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageUnits;