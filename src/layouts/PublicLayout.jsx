import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AnnouncementBar from '../components/common/AnnouncementBar';

export default function PublicLayout() {
  const location = useLocation();
  const hideFooter = ['/cart', '/favorites'].includes(location.pathname);
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-slate-100 transition-colors">
      <AnnouncementBar />
      <Navbar />
      <main className={`flex-grow w-full ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in'}`}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
