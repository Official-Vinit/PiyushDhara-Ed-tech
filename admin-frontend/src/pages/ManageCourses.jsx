// admin-client/src/pages/ManageCourses.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  
  // Form States
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [teacherImage, setTeacherImage] = useState('');

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios.get(`${API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/api/courses`, { 
      name, 
      teacher,       // Sending new field
      teacherImage   // Sending new field
    })
      .then(res => {
        // Add new course to list
        setCourses([...courses, res.data]);
        // Reset Form
        setName('');
        setTeacher('');
        setTeacherImage('');
      })
      .catch(err => console.error(err));
  };

  const handleDeleteCourse = (id) => {
    if(!window.confirm("Are you sure? This will delete all subjects inside!")) return;
    axios.delete(`${API_URL}/api/courses/${id}`)
      .then(() => setCourses(courses.filter(c => c._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
      
      {/* --- ADD COURSE FORM --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleAddCourse} className="space-y-4">
          
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Course Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g. Civil Engineering"
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
              placeholder="e.g. Mrigank Sir"
            />
          </div>

          {/* Teacher Image URL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Teacher Image URL (Optional)</label>
            <input 
              type="url" 
              value={teacherImage} 
              onChange={(e) => setTeacherImage(e.target.value)} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g. https://imgur.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to generate a default avatar.</p>
          </div>

          <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 font-medium">
            Add Course
          </button>
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
            <button 
              onClick={() => handleDeleteCourse(course._id)}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCourses;