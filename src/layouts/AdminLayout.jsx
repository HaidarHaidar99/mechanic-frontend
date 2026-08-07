import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Wrench, LayoutDashboard, ShoppingBag, Mail, Settings, 
  UserCog, Users, LogOut, Sun, Moon, Globe, Menu, X 
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentLang = i18n.language || 'en';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const adminNavLinks = [
    { name: currentLang === 'en' ? 'Dashboard' : 'لوحة التحكم', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: currentLang === 'en' ? 'Products' : 'المنتجات', path: '/admin/products', icon: ShoppingBag },
    { name: currentLang === 'en' ? 'Messages' : 'الرسائل', path: '/admin/messages', icon: Mail },
    { name: currentLang === 'en' ? 'Website Settings' : 'إعدادات الموقع', path: '/admin/settings', icon: Settings },
    { name: currentLang === 'en' ? 'Profile' : 'الملف الشخصي', path: '/admin/profile', icon: UserCog },
  ];

  // Super Admin restricted menu item
  const isSuper = admin && admin.role === 'super_admin';
  if (isSuper) {
    adminNavLinks.push({
      name: currentLang === 'en' ? 'Admins Management' : 'إدارة المشرفين',
      path: '/admin/admins',
      icon: Users
    });
  }

  const renderNavLinks = (onClickCallback = () => {}) => {
    return adminNavLinks.map(link => {
      const Icon = link.icon;
      const isActive = location.pathname === link.path;
      return (
        <Link
          key={link.path}
          to={link.path}
          onClick={onClickCallback}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
            isActive 
              ? 'bg-red-600 text-white shadow' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
          }`}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span>{link.name}</span>
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e0f11] text-gray-900 dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-[#16181c] flex-col border-r border-gray-200 dark:border-gray-850 p-4 shrink-0 transition-colors z-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-gray-950 dark:text-white font-extrabold text-lg tracking-wider py-4 border-b border-gray-250 dark:border-gray-850 mb-6 uppercase">
          <Wrench className="w-5 h-5 text-red-500 animate-spin" />
          <span>Console Control</span>
        </div>

        {/* Links */}
        <nav className="flex-grow space-y-1">
          {renderNavLinks()}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-gray-250 dark:border-gray-850 pt-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{currentLang === 'en' ? 'Log Out' : 'تسجيل الخروج'}</span>
          </button>
        </div>

      </aside>

      {/* 2. Mobile drawer layout */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-white dark:bg-[#16181c] h-full flex flex-col p-4 border-r border-gray-250 dark:border-gray-850 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between py-4 border-b border-gray-250 dark:border-gray-850 mb-6">
              <span className="font-extrabold text-base tracking-wider uppercase flex items-center gap-2">
                <Wrench className="w-4 h-4 text-red-500 animate-spin" />
                Console Control
              </span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-grow space-y-1">
              {renderNavLinks(() => setSidebarOpen(false))}
            </nav>
            <div className="border-t border-gray-250 dark:border-gray-850 pt-4 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>{currentLang === 'en' ? 'Log Out' : 'تسجيل الخروج'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <header className="bg-white dark:bg-[#16181c] border-b border-gray-200 dark:border-gray-850 h-16 flex items-center justify-between px-6 transition-colors z-10">
          
          {/* Hamburger toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Title placeholder */}
          <div className="hidden sm:block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {currentLang === 'en' ? 'Administration Area' : 'منطقة الإدارة الفنية'}
          </div>

          {/* Quick actions top bar */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            
            {/* Lang switch */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin Profile Info */}
            {admin && (
              <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-3 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    {admin.fullName}
                  </div>
                  <div className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                    {admin.role === 'super_admin' ? (currentLang === 'en' ? 'Super Admin' : 'مدير عام') : (currentLang === 'en' ? 'Admin' : 'مشرف')}
                  </div>
                </div>
              </div>
            )}

          </div>

        </header>

        {/* Content Outlet scroll area */}
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
