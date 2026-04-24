// src/pages/CourseDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config'; 

const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Teacher')}&background=1d4ed8&color=ffffff`;

function CourseDashboard() {
  const { courseId } = useParams(); 
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/courses/${courseId}`);

        if (ignore) {
          return;
        }

        setCourse(response.data);
        if (response.data?.subjects?.length > 0) {
          setSelectedSubjectId(response.data.subjects[0]._id);
        } else {
          setSelectedSubjectId(null);
        }
      } catch (requestError) {
        console.error('Error fetching course data:', requestError);
        if (!ignore) {
          setError('Failed to load this course. Please try again.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCourse();

    return () => {
      ignore = true;
    };
  }, [courseId]); 

  const getSelectedSubject = () => {
    if (!course || !course.subjects) return null;
    return course.subjects.find(s => s._id === selectedSubjectId);
  };

  if (loading) {
    return (
      <div className="surface-card space-y-4 p-6 md:p-8">
        <div className="h-8 w-2/5 animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-card border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="surface-card p-8 text-center text-slate-600">Course not found.</div>
    );
  }

  const selectedSubject = getSelectedSubject();

  return (
    <div className="space-y-6">
      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <span className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">
              Course Overview
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">{course.name}</h1>
            <p className="mt-2 text-sm font-medium text-blue-700 md:text-base">Instructor: {course.teacher || 'Faculty'}</p>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
              {course.description || 'Use subject tabs below to navigate through every unit and continue your preparation in order.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <img
              src={course.teacherImage || getAvatarUrl(course.teacher)}
              alt={course.teacher || 'Teacher'}
              className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-md md:h-28 md:w-28"
            />
          </div>
        </div>
      </section>

      <section className="surface-card p-2">
        <nav className="flex gap-2 overflow-x-auto px-2 py-2">
          {course.subjects?.map((subject) => (
            <button
              key={subject._id}
              onClick={() => setSelectedSubjectId(subject._id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition md:px-5 md:py-2.5 ${
                selectedSubjectId === subject._id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </nav>
      </section>

      <section className="space-y-3">
        {selectedSubject ? (
          selectedSubject.units?.length > 0 ? (
            selectedSubject.units.map((unit, index) => (
              <Link
                to={`/units/${unit._id}`}
                key={unit._id}
                className="surface-card group flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 transition group-hover:text-blue-700">
                    {unit.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {(unit.videos || []).length} videos • {(unit.notes || []).length} notes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-blue-500 transition group-hover:translate-x-0.5">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="surface-card border-dashed p-8 text-center text-slate-500">
              No units added to this subject yet.
            </div>
          )
        ) : (
          <div className="surface-card border-dashed p-8 text-center text-slate-500">No subjects available.</div>
        )}
      </section>
    </div>
  );
}

export default CourseDashboard;