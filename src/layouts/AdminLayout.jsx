import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, ShoppingBag, Mail, Settings, 
  User, Users, LogOut, Sun, Moon, Globe, 
  Menu, X, Wrench, Megaphone 
} from 'lucide-react';
import IconButton from '../components/common/IconButton';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = i18n.language || 'en';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: t('admin.nav.dashboard') || 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('admin.nav.products') || 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: t('admin.nav.announcements') || 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: t('admin.nav.messages') || 'Messages', path: '/admin/messages', icon: Mail },
    { name: t('admin.nav.settings') || 'Settings', path: '/admin/settings', icon: Settings },
    { name: t('admin.nav.profile') || 'My Profile', path: '/admin/profile', icon: User },
  ];

  if (admin && admin.role === 'super_admin') {
    menuItems.push({ 
      name: t('admin.nav.admins') || 'Manage Admins', 
      path: '/admin/admins', 
      icon: Users 
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] flex flex-col md:flex-row transition-all duration-300 font-sans">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden w-full bg-[var(--surface)] border-b border-[var(--border)] h-16 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--accent)] text-white">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-heading font-black text-sm uppercase tracking-widest text-[var(--text-primary)]">
            Console
          </span>
        </div>

        <div className="flex items-center gap-1">
          <IconButton 
            icon={sidebarOpen ? X : Menu} 
            variant="ghost" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation drawer"
          />
        </div>
      </header>

      {/* Sidebar Navigation Drawer */}
      <aside 
        className={`
          fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-30 w-64 bg-[var(--surface)] border-r rtl:border-r-0 rtl:border-l border-[var(--border)] flex flex-col justify-between p-6 transition-all duration-300 shadow-md md:sticky md:top-0 md:h-screen
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 rtl:translate-x-full rtl:md:translate-x-0'}
        `}
      >
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2.5 font-heading text-lg font-black uppercase tracking-widest text-[var(--text-primary)]">
              <div className="p-2 rounded-xl bg-[var(--accent)] text-white">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <span>Console</span>
            </div>
            
            {/* Mobile close toggle */}
            <IconButton 
              icon={X} 
              variant="ghost" 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            />
          </div>

          {/* User profile detail summary */}
          {admin && (
            <div className="p-4 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl space-y-1">
              <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">
                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
              <div className="text-xs font-extrabold text-[var(--text-primary)] truncate">
                {admin.fullName}
              </div>
              <div className="text-[10px] font-bold text-[var(--text-secondary)] truncate">
                @{admin.username}
              </div>
            </div>
          )}

          {/* Menu items */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border
                    ${isActive 
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20' 
                      : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'}
                  `}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom controls & logout */}
        <div className="space-y-4 pt-6 border-t border-[var(--border)]">
          <div className="grid grid-cols-2 gap-2">
            {/* Language Switch */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-primary)] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{currentLang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-primary)] transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--danger)] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('admin.nav.logout') || 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content viewport */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-w-full">
        <Outlet />
      </main>

      {/* Backdrop overlay for Mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

    </div>
  );
}
