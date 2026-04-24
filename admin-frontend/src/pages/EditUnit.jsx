// src/pages/EditUnit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function EditUnit() {
  const { unitId } = useParams(); // Get the unit ID from the URL
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });

  // State for the forms
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteUrl, setNoteUrl] = useState('');

  // Fetch the unit's details (including videos and notes)
  const fetchUnit = () => {
    setLoading(true);
    setStatus({ type: '', text: '' });
    axios.get(`${API_URL}/api/units/${unitId}`)
      .then(response => {
        setUnit(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching unit:', error);
        setStatus({ type: 'error', text: 'Failed to load this unit.' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUnit();
  }, [unitId]); // Re-fetch if ID changes

  // --- VIDEO HANDLERS ---
  const handleAddVideo = (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    axios.put(`${API_URL}/api/units/${unitId}/videos`, {
      title: videoTitle,
      youtubeId: youtubeId,
      duration: videoDuration
    })
    .then(response => {
      setUnit({ ...unit, videos: response.data }); // Update state with new videos array
      // Clear form
      setVideoTitle('');
      setYoutubeId('');
      setVideoDuration('');
      setStatus({ type: 'success', text: 'Video added successfully.' });
    })
    .catch(error => {
      console.error('Error adding video:', error);
      setStatus({ type: 'error', text: error?.response?.data?.msg || 'Failed to add video.' });
    });
  };

  const handleDeleteVideo = (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    axios.delete(`${API_URL}/api/units/${unitId}/videos/${videoId}`)
    .then(response => {
      setUnit({ ...unit, videos: response.data }); // Update state
      setStatus({ type: 'success', text: 'Video removed.' });
    })
    .catch(error => {
      console.error('Error deleting video:', error);
      setStatus({ type: 'error', text: 'Failed to delete video.' });
    });
  };

  // --- NOTE HANDLERS ---
  const handleAddNote = (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    axios.put(`${API_URL}/api/units/${unitId}/notes`, {
      title: noteTitle,
      url: noteUrl
    })
    .then(response => {
      setUnit({ ...unit, notes: response.data }); // Update state
      // Clear form
      setNoteTitle('');
      setNoteUrl('');
      setStatus({ type: 'success', text: 'Note added successfully.' });
    })
    .catch(error => {
      console.error('Error adding note:', error);
      setStatus({ type: 'error', text: error?.response?.data?.msg || 'Failed to add note.' });
    });
  };

  const handleDeleteNote = (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    axios.delete(`${API_URL}/api/units/${unitId}/notes/${noteId}`)
    .then(response => {
      setUnit({ ...unit, notes: response.data }); // Update state
      setStatus({ type: 'success', text: 'Note removed.' });
    })
    .catch(error => {
      console.error('Error deleting note:', error);
      setStatus({ type: 'error', text: 'Failed to delete note.' });
    });
  };

  if (loading) return <div className="admin-card p-8 text-center text-slate-600">Loading unit...</div>;
  if (!unit) return <div className="admin-card p-8 text-center text-slate-600">Unit not found.</div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link to="/units" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">Back to Units</Link>
      </nav>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Edit Unit: {unit.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Manage lecture videos and downloadable notes for this unit.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- VIDEO MANAGEMENT --- */}
        <div className="admin-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Videos</h2>

          {/* Add Video Form */}
          <form onSubmit={handleAddVideo} className="space-y-4 mb-6">
            <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video Title" className="admin-input" required />
            <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ)" className="admin-input" required />
            <input type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} placeholder="Duration (e.g., 01:58:20)" className="admin-input" />
            <button type="submit" className="admin-btn-primary w-full">Add Video</button>
          </form>

          {/* Existing Videos List */}
          <h3 className="text-xl font-semibold mb-3">Existing Videos</h3>
          <ul className="space-y-2">
            {unit.videos.map(video => (
              <li key={video._id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <span className="text-sm font-medium text-slate-700">{video.title}</span>
                <button onClick={() => handleDeleteVideo(video._id)} className="admin-btn-danger">Delete</button>
              </li>
            ))}
            {unit.videos.length === 0 && <p className="text-slate-500">No videos yet.</p>}
          </ul>
        </div>

        {/* --- NOTE MANAGEMENT --- */}
        <div className="admin-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Manage Notes</h2>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="space-y-4 mb-6">
            <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note Title (e.g., Chapter 1 PDF)" className="admin-input" required />
            <input type="url" value={noteUrl} onChange={(e) => setNoteUrl(e.target.value)} placeholder="Google Drive URL" className="admin-input" required />
            <button type="submit" className="admin-btn-primary w-full">Add Note</button>
          </form>

          {/* Existing Notes List */}
          <h3 className="text-xl font-semibold mb-3">Existing Notes</h3>
          <ul className="space-y-2">
            {unit.notes.map(note => (
              <li key={note._id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <span className="truncate text-sm font-medium text-slate-700">{note.title}</span>
                <button onClick={() => handleDeleteNote(note._id)} className="admin-btn-danger">Delete</button>
              </li>
            ))}
            {unit.notes.length === 0 && <p className="text-slate-500">No notes yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EditUnit;