import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Pass the state and the close function to the Sidebar.
        We will use these in the next step to control visibility.
      */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* MOBILE HEADER (Only visible on small screens) */}
        <div className="md:hidden flex items-center bg-gray-50 border-b p-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {/* Hamburger Icon */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 font-bold text-xl text-gray-800">PiyushDhara</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;