// admin-client/src/pages/ManageCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState({ type: '', text: '' });
  
  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teacher, setTeacher] = useState('');
  const [teacherImage, setTeacherImage] = useState('');
  
  // EDIT MODE STATE
  const [editingId, setEditingId] = useState(null); // Stores ID of course being edited

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Failed to load courses.' });
    }
  };

  // --- HANDLE FORM SUBMIT (Create OR Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    const courseData = { name, description, teacher, teacherImage };

    try {
      if (editingId) {
        const res = await axios.put(`${API_URL}/api/courses/${editingId}`, courseData);
        setCourses(courses.map((course) => (
          course._id === editingId ? res.data : course
        )));
        setStatus({ type: 'success', text: 'Course updated successfully.' });
      } else {
        const res = await axios.post(`${API_URL}/api/courses`, courseData);
        setCourses([...courses, res.data]);
        setStatus({ type: 'success', text: 'Course created successfully.' });
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: err?.response?.data?.msg || 'Failed to save course.' });
    }
  };

  // --- EDIT BUTTON CLICKED ---
  const handleEditClick = (course) => {
    setEditingId(course._id); // Turn on Edit Mode
    setName(course.name);
    setDescription(course.description || '');
    setTeacher(course.teacher || '');
    setTeacherImage(course.teacherImage || '');
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- DELETE BUTTON CLICKED ---
  const handleDeleteCourse = async (id) => {
    if(!window.confirm("Are you sure? This will delete all subjects inside!")) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      setStatus({ type: 'success', text: 'Course deleted.' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Failed to delete course.' });
    }
  };

  // --- RESET FORM ---
  const resetForm = () => {
    setEditingId(null); // Turn off Edit Mode
    setName('');
    setDescription('');
    setTeacher('');
    setTeacherImage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Manage Courses</h1>
        <p className="mt-1 text-sm text-slate-500">Create and maintain course-level metadata shown to learners.</p>
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
      
      <div className="admin-card border-l-4 border-blue-500 p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Course' : 'Add New Course'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Course Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="admin-input" 
              required 
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="admin-input min-h-24"
              placeholder="Short summary about this course"
            />
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Teacher Name</label>
            <input 
              type="text" 
              value={teacher} 
              onChange={(e) => setTeacher(e.target.value)} 
              className="admin-input" 
            />
          </div>

          {/* Teacher Image URL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Teacher Image URL</label>
            <input 
              type="url" 
              value={teacherImage} 
              onChange={(e) => setTeacherImage(e.target.value)} 
              className="admin-input" 
            />
          </div>

          <div className="flex space-x-3">
            <button 
              type="submit" 
              className="admin-btn-primary"
            >
              {editingId ? 'Update Course' : 'Add Course'}
            </button>
            
            {/* Show Cancel button only when editing */}
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <div key={course._id} className="admin-card flex items-start justify-between gap-3 p-5">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-blue-600">{course.name}</h3>
              <p className="mt-1 text-sm text-slate-600">By {course.teacher || 'Faculty'}</p>
              {course.description && <p className="mt-2 text-sm text-slate-500">{course.description}</p>}
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEditClick(course)}
                className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
              >
                Edit
              </button>
              
              <button 
                onClick={() => handleDeleteCourse(course._id)}
                className="admin-btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCourses;