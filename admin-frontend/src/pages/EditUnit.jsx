// src/pages/EditUnit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function EditUnit() {
  const { unitId } = useParams(); // Get the unit ID from the URL
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for the forms
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteUrl, setNoteUrl] = useState('');

  // Fetch the unit's details (including videos and notes)
  const fetchUnit = () => {
    setLoading(true);
    axios.get(`${API_URL}/api/units/${unitId}`)
      .then(response => {
        setUnit(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching unit:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUnit();
  }, [unitId]); // Re-fetch if ID changes

  // --- VIDEO HANDLERS ---
  const handleAddVideo = (e) => {
    e.preventDefault();
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
    })
    .catch(error => console.error('Error adding video:', error));
  };

  const handleDeleteVideo = (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    axios.delete(`${API_URL}/api/units/${unitId}/videos/${videoId}`)
    .then(response => {
      setUnit({ ...unit, videos: response.data }); // Update state
    })
    .catch(error => console.error('Error deleting video:', error));
  };

  // --- NOTE HANDLERS ---
  const handleAddNote = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}/api/units/${unitId}/notes`, {
      title: noteTitle,
      url: noteUrl
    })
    .then(response => {
      setUnit({ ...unit, notes: response.data }); // Update state
      // Clear form
      setNoteTitle('');
      setNoteUrl('');
    })
    .catch(error => console.error('Error adding note:', error));
  };

  const handleDeleteNote = (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    axios.delete(`${API_URL}/api/units/${unitId}/notes/${noteId}`)
    .then(response => {
      setUnit({ ...unit, notes: response.data }); // Update state
    })
    .catch(error => console.error('Error deleting note:', error));
  };

  if (loading) return <div>Loading...</div>;
  if (!unit) return <div>Unit not found.</div>;

  return (
    <div>
      <nav className="mb-4 text-sm">
        <Link to="/units" className="text-blue-500 hover:underline">Back to Units</Link>
      </nav>
      <h1 className="text-3xl font-bold mb-6">Edit Unit: {unit.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- VIDEO MANAGEMENT --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Manage Videos</h2>

          {/* Add Video Form */}
          <form onSubmit={handleAddVideo} className="space-y-4 mb-6">
            <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video Title" className="w-full p-2 border rounded" required />
            <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ)" className="w-full p-2 border rounded" required />
            <input type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} placeholder="Duration (e.g., 01:58:20)" className="w-full p-2 border rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Video</button>
          </form>

          {/* Existing Videos List */}
          <h3 className="text-xl font-semibold mb-3">Existing Videos</h3>
          <ul className="space-y-2">
            {unit.videos.map(video => (
              <li key={video._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{video.title}</span>
                <button onClick={() => handleDeleteVideo(video._id)} className="text-red-500 hover:text-red-700">Delete</button>
              </li>
            ))}
            {unit.videos.length === 0 && <p className="text-gray-500">No videos yet.</p>}
          </ul>
        </div>

        {/* --- NOTE MANAGEMENT --- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Manage Notes</h2>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="space-y-4 mb-6">
            <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note Title (e.g., Chapter 1 PDF)" className="w-full p-2 border rounded" required />
            <input type="url" value={noteUrl} onChange={(e) => setNoteUrl(e.target.value)} placeholder="Google Drive URL" className="w-full p-2 border rounded" required />
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Add Note</button>
          </form>

          {/* Existing Notes List */}
          <h3 className="text-xl font-semibold mb-3">Existing Notes</h3>
          <ul className="space-y-2">
            {unit.notes.map(note => (
              <li key={note._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="truncate">{note.title}</span>
                <button onClick={() => handleDeleteNote(note._id)} className="text-red-500 hover:text-red-700">Delete</button>
              </li>
            ))}
            {unit.notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EditUnit;