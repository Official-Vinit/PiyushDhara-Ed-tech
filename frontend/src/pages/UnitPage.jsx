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
    let ignore = false;

    const fetchUnit = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/units/${unitId}`);
        if (!ignore) {
          setUnit(response.data);
        }
      } catch (requestError) {
        console.error('Error fetching unit data:', requestError);
        if (!ignore) {
          setError('Failed to load this unit. Please try again.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchUnit();

    return () => {
      ignore = true;
    };
  }, [unitId]); // Re-fetch if the unitId in the URL changes

  if (loading) {
    return (
      <div className="surface-card space-y-4 p-6 md:p-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-1/4 animate-pulse rounded bg-slate-100" />
        <div className="h-28 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (error) {
    return <div className="surface-card border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>;
  }

  if (!unit) {
    return <div className="surface-card p-8 text-center text-slate-600">Unit not found.</div>;
  }

  // Helper function to get a YouTube thumbnail
  const getThumbnailUrl = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

  const videos = unit.videos || [];
  const notes = unit.notes || [];
  const subjectName = unit.subject?.name || 'Subject';
  const courseName = unit.subject?.course?.name || 'Course';
  const courseId = unit.subject?.course?._id;

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        {courseId ? (
          <Link to={`/courses/${courseId}`} className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
            {courseName}
          </Link>
        ) : (
          <span>{courseName}</span>
        )}
        <span>/</span>
        <span>{subjectName}</span>
      </nav>

      <section className="surface-card bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 md:p-8">
        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
          Unit Workspace
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">{unit.name}</h1>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          {videos.length} lectures and {notes.length} notes curated for this topic.
        </p>
      </section>

      <section className="surface-card p-2">
        <nav className="flex gap-2">
          <button
            onClick={() => setActiveTab('lectures')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition md:px-5 md:py-2.5 ${
              activeTab === 'lectures'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            Lectures
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition md:px-5 md:py-2.5 ${
              activeTab === 'notes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            Notes
          </button>
        </nav>
      </section>

      <section>
        {activeTab === 'lectures' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <article key={`${video.youtubeId}-${index}`} className="surface-card overflow-hidden transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                    <img src={getThumbnailUrl(video.youtubeId)} alt={video.title} className="h-44 w-full object-cover" />
                  </a>
                  <div className="space-y-2 p-4">
                    <h3 className="text-base font-semibold text-slate-800">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{video.duration || 'Duration not specified'}</span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-700 hover:text-blue-800"
                      >
                        Watch
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="surface-card border-dashed p-8 text-center text-slate-500 md:col-span-2 xl:col-span-3">
                No videos available for this unit.
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <a
                  key={`${note.url}-${index}`}
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card flex items-center justify-between p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <span className="text-sm font-semibold text-slate-800 md:text-base">{note.title}</span>
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Open</span>
                </a>
              ))
            ) : (
              <div className="surface-card border-dashed p-8 text-center text-slate-500">
                No PDF notes are available for this unit.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default UnitPage;