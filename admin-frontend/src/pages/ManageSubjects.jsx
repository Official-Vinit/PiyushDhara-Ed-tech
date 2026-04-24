// admin-client/src/pages/ManageSubjects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageSubjects() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState({ type: '', text: '' });
  
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID of subject being edited

  // 1. Fetch all courses on load
  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error(err);
        setStatus({ type: 'error', text: 'Failed to load courses.' });
      });
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
          setStatus({ type: '', text: '' });
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          setStatus({ type: 'error', text: 'Failed to load subjects for this course.' });
        });
    } else {
      setSubjects([]);
    }
  }, [selectedCourseId]);

  // 3. Handle Submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert("Please select a course first.");
    setStatus({ type: '', text: '' });

    if (editingId) {
      // --- UPDATE MODE ---
      axios.put(`${API_URL}/api/subjects/${editingId}`, { name })
        .then(res => {
          // Update local list
          setSubjects(subjects.map(sub => 
            sub._id === editingId ? res.data : sub
          ));
          resetForm();
          setStatus({ type: 'success', text: 'Subject updated successfully.' });
        })
        .catch(err => {
          console.error(err);
          setStatus({ type: 'error', text: 'Failed to update subject.' });
        });
    } else {
      // --- CREATE MODE ---
      axios.post(`${API_URL}/api/subjects`, { 
        name, 
        courseId: selectedCourseId 
      })
        .then(res => {
          setSubjects([...subjects, res.data]);
          resetForm();
          setStatus({ type: 'success', text: 'Subject created successfully.' });
        })
        .catch(err => {
          console.error(err);
          setStatus({ type: 'error', text: err?.response?.data?.msg || 'Failed to create subject.' });
        });
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
        setStatus({ type: 'success', text: 'Subject deleted.' });
      })
      .catch(err => {
        console.error(err);
        setStatus({ type: 'error', text: 'Failed to delete subject.' });
      });
  };

  // 6. Reset Form
  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Manage Subjects</h1>
        <p className="mt-1 text-sm text-slate-500">Organize subjects under each course.</p>
      </div>

      {status.text && (
        <div className={`rounded-lg px-4 py-3 text-sm ${
          status.type === 'error'
            ? 'border border-rose-100 bg-rose-50 text-rose-700'
            : 'border border-emerald-100 bg-emerald-50 text-emerald-700'
        }`}>
          {status.text}
        </div>
      )}

      {/* SELECT COURSE DROPDOWN */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Select Course</label>
        <select 
          className="admin-select"
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
          <div className="admin-card border-l-4 border-blue-500 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Subject Name (e.g. Thermodynamics)"
                className="admin-input flex-1"
                required
              />
              <button 
                type="submit"
                className="admin-btn-primary"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* SUBJECTS LIST */}
          <div className="admin-card p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Subjects in this Course</h3>
            
            {loading && <p>Loading subjects...</p>}
            {!loading && subjects.length === 0 && <p className="text-slate-500">No subjects yet.</p>}
            
            <ul className="space-y-3">
              {subjects.map(subject => (
                <li key={subject._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="font-medium text-slate-800">{subject.name}</span>
                  <div className="space-x-2">
                    <button 
                      onClick={() => handleEditClick(subject)}
                      className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subject._id)}
                      className="admin-btn-danger"
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