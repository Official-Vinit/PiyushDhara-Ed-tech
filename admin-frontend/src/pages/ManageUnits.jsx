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
  const [status, setStatus] = useState({ type: '', text: '' });
  
  const [name, setName] = useState(''); // Form input
  const [editingId, setEditingId] = useState(null); // ID of unit being renamed

  // 1. Fetch Courses
  useEffect(() => {
    axios.get(`${API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error(err);
        setStatus({ type: 'error', text: 'Failed to load courses.' });
      });
  }, []);

  // 2. Fetch Subjects when Course changes
  useEffect(() => {
    if (selectedCourseId) {
      axios.get(`${API_URL}/api/courses/${selectedCourseId}`)
        .then(res => setSubjects(res.data.subjects || []))
        .catch(err => {
          console.error(err);
          setStatus({ type: 'error', text: 'Failed to load subjects for selected course.' });
        });
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
      .catch(err => {
        console.error(err);
        setStatus({ type: 'error', text: 'Failed to load units.' });
      });
  };

  // 4. Handle Submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubjectId) return alert("Select a subject first");
    setStatus({ type: '', text: '' });

    if (editingId) {
      // --- UPDATE MODE ---
      axios.put(`${API_URL}/api/units/${editingId}`, { name })
        .then(res => {
          // Update local list
          setUnits(units.map(u => u._id === editingId ? res.data : u));
          resetForm();
          setStatus({ type: 'success', text: 'Unit updated successfully.' });
        })
        .catch(err => {
          console.error(err);
          setStatus({ type: 'error', text: 'Failed to update unit.' });
        });
    } else {
      // --- CREATE MODE ---
      axios.post(`${API_URL}/api/units`, { name, subjectId: selectedSubjectId })
        .then(res => {
          setUnits([...units, res.data]);
          resetForm();
          setStatus({ type: 'success', text: 'Unit created successfully.' });
        })
        .catch(err => {
          console.error(err);
          setStatus({ type: 'error', text: err?.response?.data?.msg || 'Failed to create unit.' });
        });
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
      .then(() => {
        setUnits(units.filter(u => u._id !== id));
        setStatus({ type: 'success', text: 'Unit deleted.' });
      })
      .catch(err => {
        console.error(err);
        setStatus({ type: 'error', text: 'Failed to delete unit.' });
      });
  };

  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Manage Units</h1>
        <p className="mt-1 text-sm text-slate-500">Manage topic-level units and navigate to unit content editor.</p>
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

      {/* DROPDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Select Course</label>
          <select 
            className="admin-select"
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
          <label className="mb-2 block text-sm font-semibold text-slate-700">Select Subject</label>
          <select 
            className="admin-select"
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
          <div className="admin-card border-l-4 border-blue-500 p-6">
             <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Rename Unit' : 'Add New Unit'}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Unit Name (e.g. Unit 1: Introduction)"
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

          {/* LIST */}
          <div className="admin-card p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Units in this Subject</h3>
            {units.length === 0 && <p className="text-slate-500">No units found.</p>}
            
            <ul className="space-y-3">
              {units.map((unit, index) => (
                <li key={unit._id} className="flex flex-col items-start justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
                  
                  <div className="mb-2 md:mb-0">
                    <span className="mr-3 font-bold text-slate-400">#{index + 1}</span>
                    <span className="text-lg font-medium text-slate-800">{unit.name}</span>
                    <span className="block text-xs text-slate-500 md:ml-2 md:inline">
                       ({unit.videos.length} Videos)
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      to={`/unit/${unit._id}`}
                      className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200"
                    >
                      Manage Videos
                    </Link>

                    <button 
                      onClick={() => handleEditClick(unit)}
                      className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
                    >
                      Rename
                    </button>

                    <button 
                      onClick={() => handleDelete(unit._id)}
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

export default ManageUnits;