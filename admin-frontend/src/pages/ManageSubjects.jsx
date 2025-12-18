// admin-client/src/pages/ManageSubjects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageSubjects() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID of subject being edited

  // 1. Fetch all courses on load
  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2. Fetch subjects when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      setLoading(true);
      // Find the selected course object to get its subjects
      // Note: This relies on the /courses endpoint returning populated subjects
      // If it doesn't, we might need a specific /courses/:id call.
      // Let's try the safer way: fetching the specific course details.
      axios.get(`${API_URL}/api/courses/${selectedCourseId}`)
        .then(res => {
          setSubjects(res.data.subjects || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setSubjects([]);
    }
  }, [selectedCourseId]);

  // 3. Handle Submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert("Please select a course first.");

    if (editingId) {
      // --- UPDATE MODE ---
      axios.put(`${API_URL}/api/subjects/${editingId}`, { name })
        .then(res => {
          // Update local list
          setSubjects(subjects.map(sub => 
            sub._id === editingId ? res.data : sub
          ));
          resetForm();
        })
        .catch(err => console.error(err));
    } else {
      // --- CREATE MODE ---
      axios.post(`${API_URL}/api/subjects`, { 
        name, 
        courseId: selectedCourseId 
      })
        .then(res => {
          setSubjects([...subjects, res.data]);
          resetForm();
        })
        .catch(err => console.error(err));
    }
  };

  // 4. Handle Edit Click
  const handleEditClick = (subject) => {
    setEditingId(subject._id);
    setName(subject.name);
  };

  // 5. Handle Delete
  const handleDelete = (id) => {
    if(!window.confirm("Delete this subject? All units inside will be lost!")) return;
    axios.delete(`${API_URL}/api/subjects/${id}`)
      .then(() => {
        setSubjects(subjects.filter(sub => sub._id !== id));
      })
      .catch(err => console.error(err));
  };

  // 6. Reset Form
  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Subjects</h1>

      {/* SELECT COURSE DROPDOWN */}
      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-2">Select Course</label>
        <select 
          className="w-full p-3 border rounded shadow-sm focus:ring-2 focus:ring-blue-500"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            resetForm(); // Reset form when changing course
          }}
        >
          <option value="">-- Choose a Course --</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.name}</option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <>
          {/* FORM AREA */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Subject Name (e.g. Thermodynamics)"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <button 
                type="submit"
                className={`px-6 py-2 text-white rounded font-medium
                  ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
                `}
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* SUBJECTS LIST */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Subjects in this Course</h3>
            
            {loading && <p>Loading subjects...</p>}
            {!loading && subjects.length === 0 && <p className="text-gray-500">No subjects yet.</p>}
            
            <ul className="space-y-3">
              {subjects.map(subject => (
                <li key={subject._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                  <span className="font-medium text-gray-800">{subject.name}</span>
                  <div className="space-x-2">
                    <button 
                      onClick={() => handleEditClick(subject)}
                      className="text-blue-600 hover:text-blue-800 font-medium px-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subject._id)}
                      className="text-red-600 hover:text-red-800 font-medium px-2"
                    >
                      Delete
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

export default ManageSubjects;