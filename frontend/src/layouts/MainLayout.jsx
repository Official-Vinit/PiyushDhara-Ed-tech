import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/90 backdrop-blur">
          <div className="flex items-center px-4 py-3 md:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 rounded-lg p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <img
              src="/logo.png"
              alt="PiyushDhara"
              className="h-9 w-auto object-contain"
            />

            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-900 md:text-base">PiyushDhara Learning</p>
              <p className="text-xs text-slate-500">Structured courses and unit-wise resources</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;