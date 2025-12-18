// admin-client/src/pages/ManageCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  
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

  const fetchCourses = () => {
    axios.get(`${API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  };

  // --- HANDLE FORM SUBMIT (Create OR Update) ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const courseData = { name, description, teacher, teacherImage };

    if (editingId) {
      // --- UPDATE MODE ---
      axios.put(`${API_URL}/api/courses/${editingId}`, courseData)
        .then(res => {
          // Update the list locally without refreshing
          setCourses(courses.map(course => 
            course._id === editingId ? res.data : course
          ));
          resetForm();
        })
        .catch(err => console.error(err));
    } else {
      // --- CREATE MODE ---
      axios.post(`${API_URL}/api/courses`, courseData)
        .then(res => {
          setCourses([...courses, res.data]);
          resetForm();
        })
        .catch(err => console.error(err));
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
  const handleDeleteCourse = (id) => {
    if(!window.confirm("Are you sure? This will delete all subjects inside!")) return;
    axios.delete(`${API_URL}/api/courses/${id}`)
      .then(() => setCourses(courses.filter(c => c._id !== id)))
      .catch(err => console.error(err));
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
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
      
      {/* --- FORM (Dynamic Title & Buttons) --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Teacher Name</label>
            <input 
              type="text" 
              value={teacher} 
              onChange={(e) => setTeacher(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {/* Teacher Image URL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Teacher Image URL</label>
            <input 
              type="url" 
              value={teacherImage} 
              onChange={(e) => setTeacherImage(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="flex space-x-3">
            <button 
              type="submit" 
              className={`py-2 px-6 rounded font-medium text-white transition-colors
                ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
              `}
            >
              {editingId ? 'Update Course' : 'Add Course'}
            </button>
            
            {/* Show Cancel button only when editing */}
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="py-2 px-6 rounded font-medium bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- EXISTING COURSES LIST --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-blue-600">{course.name}</h3>
              <p className="text-gray-600 text-sm">By {course.teacher || 'Mrigank Sir'}</p>
            </div>
            
            <div className="flex space-x-2">
              {/* EDIT BUTTON */}
              <button 
                onClick={() => handleEditClick(course)}
                className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 font-medium"
              >
                Edit
              </button>
              
              {/* DELETE BUTTON */}
              <button 
                onClick={() => handleDeleteCourse(course._id)}
                className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium"
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