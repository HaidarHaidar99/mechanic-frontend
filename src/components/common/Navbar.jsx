import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ShoppingCart, Heart, Sun, Moon, Globe, Menu, X, Wrench, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { getItemCount } = useCart();
  const { favoriteIds } = useFavorites();
  const { settings } = useSettings();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  const currentLang = i18n.language || 'en';
  const displayCompanyName = settings ? settings.companyName[currentLang] : 'Mechanic Pro';

  const isHome = location.pathname === '/';
  // Transparent at top of Home page
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <nav 
        className={`z-40 w-full transition-all duration-500 ${
          isTransparent 
            ? 'absolute left-0 bg-transparent text-white border-transparent py-4' 
            : 'fixed top-0 left-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-lg border-b border-gray-250/20 dark:border-zinc-900/50 text-zinc-900 dark:text-slate-100 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 font-heading text-lg font-extrabold uppercase tracking-widest transition-transform duration-300 active:scale-95"
            >
              <div className="p-2 rounded-xl bg-red-650 text-white shadow-lg shadow-red-500/20">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <span className={`font-black ${isTransparent ? 'text-white' : 'text-zinc-950 dark:text-white'}`}>
                {displayCompanyName}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 font-heading">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-bold uppercase tracking-wider relative py-1.5 transition-all duration-300 ${
                      isActive 
                        ? (isTransparent ? 'text-white' : 'text-red-600 dark:text-red-500') 
                        : (isTransparent ? 'text-white/80 hover:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200')
                    }`}
                  >
                    <span>{link.name}</span>
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-transform duration-300 origin-left ${
                        isActive 
                          ? (isTransparent ? 'bg-white scale-x-100' : 'bg-red-600 dark:bg-red-500 scale-x-100')
                          : 'bg-red-500 scale-x-0 hover:scale-x-100'
                      }`} 
                    />
                  </Link>
                );
              })}
            </div>

            {/* Controls (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* Language Toggle */}
              <button
                onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Switch Language"
              >
                <Globe className="w-4.5 h-4.5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Switch Theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Favorites Icon */}
              <Link
                to="/favorites"
                className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title={t('nav.favorites')}
              >
                <Heart className={`w-4.5 h-4.5 transition-all ${favoriteIds.length > 0 ? 'fill-red-600 text-red-600 dark:fill-red-500 dark:text-red-500 scale-110' : ''}`} />
                {favoriteIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-650 text-[9px] font-black text-white ring-2 ring-white dark:ring-black">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title={t('nav.cart')}
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {getItemCount() > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-650 text-[9px] font-black text-white ring-2 ring-white dark:ring-black">
                    {getItemCount()}
                  </span>
                )}
              </Link>
            </div>

            {/* Hamburger / Mobile Header widgets */}
            <div className="flex md:hidden items-center gap-1">
              
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${
                  isTransparent ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Mobile Cart shortcut */}
              <Link
                to="/cart"
                className={`p-2 relative ${
                  isTransparent ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {getItemCount() > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-650 text-[8px] font-black text-white">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-lg transition-all ${
                  isTransparent ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Slide Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col justify-between p-6 sm:p-8 transition-all duration-500 ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto scale-100' 
            : 'opacity-0 pointer-events-none scale-105'
        }`}
      >
        
        {/* Mobile menu header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2 font-heading font-extrabold text-sm uppercase tracking-widest">
            <div className="p-1.5 rounded-lg bg-red-600">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span>{displayCompanyName}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-grow flex flex-col justify-center space-y-6 sm:space-y-8 py-10 font-heading">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-2xl sm:text-3xl font-extrabold tracking-wider transition-all uppercase ${
                  isActive ? 'text-red-500 pl-4 border-l-4 border-red-500 rtl:pr-4 rtl:pl-0 rtl:border-r-4 rtl:border-l-0' : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  animationDelay: `${idx * 75}ms`
                }}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-6 h-6 text-zinc-600 shrink-0 rtl:rotate-180" />
              </Link>
            );
          })}
        </div>

        {/* Mobile controls bottom bar */}
        <div className="border-t border-zinc-900 pt-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Language switcher */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Globe className="w-4 h-4 text-red-500" />
              <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Favorites drawer link */}
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-white relative"
            >
              <Heart className={`w-4 h-4 ${favoriteIds.length > 0 ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
              <span>{t('nav.favorites')} ({favoriteIds.length})</span>
            </Link>

          </div>

          <p className="text-[10px] text-center text-zinc-600 font-bold uppercase tracking-widest mt-2">
            &copy; {new Date().getFullYear()} {displayCompanyName}. ALL RIGHTS RESERVED.
          </p>

        </div>

      </div>
    </>
  );
}
