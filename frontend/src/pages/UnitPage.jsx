// src/pages/UnitPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config'; 

function UnitPage() {
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage which tab is active: 'lectures' or 'notes'
  const [activeTab, setActiveTab] = useState('lectures');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/units/${unitId}`)
      .then(response => {
        setUnit(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching unit data:', error);
        setError('Failed to load unit data.');
        setLoading(false);
      });
  }, [unitId]); // Re-fetch if the unitId in the URL changes

  if (loading) return <div className="p-4">Loading unit...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!unit) return <div className="p-4">Unit not found.</div>;

  // Helper function to get a YouTube thumbnail
  const getThumbnailUrl = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to={`/courses/${unit.subject.course._id}`} className="hover:underline">
          {unit.subject.course.name}
        </Link>
        <span className="mx-2">&gt;</span>
        <span>{unit.subject.name}</span>
      </nav>

      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">{unit.name}</h1>

      {/* Tabs: Lectures, Notes, etc. */}
      <nav className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('lectures')}
          className={`py-3 px-6 font-medium ${activeTab === 'lectures' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Lectures
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 px-6 font-medium ${activeTab === 'notes' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Notes
        </button>
        {/* You can add DPPs and DPP Sol. tabs here later */}
      </nav>

      {/* Tab Content */}
      <div>
        {/* LECTURES TAB */}
        {activeTab === 'lectures' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {unit.videos.length > 0 ? (
              unit.videos.map((video, index) => (
                <div key={index} className="border rounded-lg shadow-sm overflow-hidden">
                  <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                    <img src={getThumbnailUrl(video.youtubeId)} alt={video.title} className="w-full h-auto" />
                  </a>
                  <div className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-500">By Mrigank Sir</p>
                    <span className="text-xs text-gray-400 mt-2 block">{video.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No videos available for this unit.</p>
            )}
          </div>
        )}
        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4 p-4">
            {/* Check if the notes array exists and has items */}
            {unit.notes && unit.notes.length > 0 ? (
              unit.notes.map((note, index) => (
                <a
                  key={index}
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-blue-500 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-600 transition-colors shadow"
                >
                  {/* This is the title you wanted from the drive */}
                  <span className="flex-1">{note.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))
            ) : (
              // Show this if the array is empty
              <p className="text-gray-500">No PDF notes are available for this unit.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UnitPage;