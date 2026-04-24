import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import API_URL from '../config';

function Sidebar({ isOpen, closeSidebar }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    let ignore = false;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/api/courses`);
        if (!ignore) {
          setCourses(Array.isArray(response.data) ? response.data : []);
        }
      } catch (requestError) {
        console.error('Error fetching courses:', requestError);
        if (!ignore) {
          setError('Failed to load courses. Please refresh.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      ignore = true;
    };
  }, []);

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:shadow-none
  `;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/45 backdrop-blur-[1px] md:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <nav className={sidebarClasses}>
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={closeSidebar} className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="PiyushDhara logo"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">PiyushDhara</p>
                  <p className="text-xs text-slate-500">Learning Portal</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeSidebar}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 md:hidden"
                aria-label="Close sidebar"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Pick a study pack to explore subjects, units, lectures, and notes.
            </p>
          </div>

          <div className="flex-1 space-y-4 p-4">
            <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400">Study Packs</h2>

            {loading && (
              <div className="space-y-2 px-2">
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            {!loading && !error && courses.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                No courses available yet.
              </div>
            )}

            <ul className="space-y-2">
              {courses.map((course) => {
                const isActive = course._id === courseId;
                return (
                  <li key={course._id}>
                    <Link
                      to={`/courses/${course._id}`}
                      onClick={closeSidebar}
                      className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {course.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;