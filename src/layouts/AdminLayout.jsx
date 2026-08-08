import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Wrench, LayoutDashboard, ShoppingBag, Mail, Settings, 
  UserCog, Users, LogOut, Sun, Moon, Globe, Menu, X, Megaphone, ChevronRight
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
    { name: currentLang === 'en' ? 'Announcements' : 'الإعلانات', path: '/admin/announcements', icon: Megaphone },
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
          className={`flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            isActive 
              ? 'bg-red-650 text-white shadow-md shadow-red-500/10' 
              : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{link.name}</span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 opacity-60 shrink-0 rtl:rotate-180 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-[#121215] flex-col border-r border-zinc-200 dark:border-zinc-900 p-5 shrink-0 transition-colors z-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 font-heading text-zinc-950 dark:text-white font-extrabold text-base tracking-widest py-4 border-b border-zinc-100 dark:border-zinc-900/60 mb-6 uppercase">
          <div className="p-1.5 rounded-lg bg-red-655 text-white">
            <Wrench className="w-4 h-4" />
          </div>
          <span>Console Control</span>
        </div>

        {/* Links */}
        <nav className="flex-grow space-y-1.5 font-heading">
          {renderNavLinks()}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-zinc-100 dark:border-zinc-900/60 pt-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'Log Out' : 'تسجيل الخروج'}</span>
          </button>
        </div>

      </aside>

      {/* 2. Mobile drawer layout */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-white dark:bg-[#121215] h-full flex flex-col p-5 border-r border-zinc-200 dark:border-zinc-900 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/60 mb-6">
              <span className="font-extrabold text-sm font-heading tracking-widest uppercase flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-655 text-white">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                Console
              </span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <nav className="flex-grow space-y-1.5 font-heading">
              {renderNavLinks(() => setSidebarOpen(false))}
            </nav>
            
            <div className="border-t border-zinc-100 dark:border-zinc-900/60 pt-4 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Log Out' : 'تسجيل الخروج'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header bar */}
        <header className="bg-white dark:bg-[#121215] border-b border-zinc-200 dark:border-zinc-900 h-16 flex items-center justify-between px-6 transition-colors z-10">
          
          {/* Hamburger toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title placeholder */}
          <div className="hidden sm:block text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-heading">
            {currentLang === 'en' ? 'Administration Area' : 'منطقة الإدارة الفنية'}
          </div>

          {/* Quick actions top bar */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            
            {/* Lang switch */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="p-2 text-zinc-500 dark:text-zinc-450 hover:bg-zinc-150 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-4.5 h-4.5" />
            </button>

            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 dark:text-zinc-450 hover:bg-zinc-150 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Admin Profile Info */}
            {admin && (
              <div className="flex items-center gap-2 border-l border-zinc-250 dark:border-zinc-800 pl-3 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white font-heading">
                    {admin.fullName}
                  </div>
                  <div className="text-[8px] font-black text-red-500 tracking-widest uppercase mt-0.5">
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
