// admin-client/src/pages/ManageUnits.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../config';

function ManageUnits() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [units, setUnits] = useState([]);
  
  const [name, setName] = useState(''); // Form input
  const [editingId, setEditingId] = useState(null); // ID of unit being renamed

  // 1. Fetch Courses
  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2. Fetch Subjects when Course changes
  useEffect(() => {
    if (selectedCourseId) {
      axios.get(`${API_URL}/api/courses/${selectedCourseId}`)
        .then(res => setSubjects(res.data.subjects || []))
        .catch(err => console.error(err));
    } else {
      setSubjects([]);
    }
  }, [selectedCourseId]);

  // 3. Fetch Units when Subject changes
  useEffect(() => {
    if (selectedSubjectId) {
      fetchUnits();
    } else {
      setUnits([]);
    }
  }, [selectedSubjectId]);

  const fetchUnits = () => {
    // We need to fetch the subject details to get the units list
    // (Assuming your API structure doesn't have a direct /units?subjectId endpoint yet)
    // A safer bet is to fetch the subject which contains the units array
    // BUT since we populated units in the subject model, we might need a specific call.
    // Let's assume fetching the subject gives us populated units.
    axios.get(`${API_URL}/api/subjects/${selectedSubjectId}`)
      .then(res => setUnits(res.data.units || []))
      .catch(err => console.error(err));
  };

  // 4. Handle Submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubjectId) return alert("Select a subject first");

    if (editingId) {
      // --- UPDATE MODE ---
      axios.put(`${API_URL}/api/units/${editingId}`, { name })
        .then(res => {
          // Update local list
          setUnits(units.map(u => u._id === editingId ? res.data : u));
          resetForm();
        })
        .catch(err => console.error(err));
    } else {
      // --- CREATE MODE ---
      axios.post(`${API_URL}/api/units`, { name, subjectId: selectedSubjectId })
        .then(res => {
          setUnits([...units, res.data]);
          resetForm();
        })
        .catch(err => console.error(err));
    }
  };

  // 5. Handle Actions
  const handleEditClick = (unit) => {
    setEditingId(unit._id);
    setName(unit.name);
  };

  const handleDelete = (id) => {
    if(!window.confirm("Delete this unit? All videos inside will be lost!")) return;
    axios.delete(`${API_URL}/api/units/${id}`)
      .then(() => setUnits(units.filter(u => u._id !== id)))
      .catch(err => console.error(err));
  };

  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Units</h1>

      {/* DROPDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Course</label>
          <select 
            className="w-full p-3 border rounded shadow-sm"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedSubjectId('');
              setUnits([]);
            }}
          >
            <option value="">-- Choose Course --</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Subject</label>
          <select 
            className="w-full p-3 border rounded shadow-sm"
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              resetForm();
            }}
            disabled={!selectedCourseId}
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {selectedSubjectId && (
        <>
          {/* FORM */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
             <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Rename Unit' : 'Add New Unit'}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Unit Name (e.g. Unit 1: Introduction)"
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

          {/* LIST */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Units in this Subject</h3>
            {units.length === 0 && <p className="text-gray-500">No units found.</p>}
            
            <ul className="space-y-3">
              {units.map((unit, index) => (
                <li key={unit._id} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded border">
                  
                  <div className="mb-2 md:mb-0">
                    <span className="font-bold text-gray-400 mr-3">#{index + 1}</span>
                    <span className="font-medium text-lg text-gray-800">{unit.name}</span>
                    <span className="text-xs text-gray-500 block md:inline md:ml-2">
                       ({unit.videos.length} Videos)
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {/* BUTTON TO ADD VIDEOS (Keeps existing functionality) */}
                    <Link 
                      to={`/unit/${unit._id}`}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 font-medium text-sm flex items-center"
                    >
                      Manage Videos
                    </Link>

                    {/* EDIT NAME BUTTON */}
                    <button 
                      onClick={() => handleEditClick(unit)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 font-medium text-sm"
                    >
                      Rename
                    </button>

                    {/* DELETE BUTTON */}
                    <button 
                      onClick={() => handleDelete(unit._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium text-sm"
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

export default ManageUnits;