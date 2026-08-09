import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ShoppingCart, Heart, Sun, Moon, Globe, Wrench, ChevronRight } from 'lucide-react';
import IconButton from './IconButton';

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
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <nav 
        className={`z-40 w-full transition-all duration-300 ${
          isTransparent 
            ? 'absolute left-0 bg-transparent text-white border-transparent py-5' 
            : 'fixed top-0 left-0 bg-[var(--surface)]/80 backdrop-blur-md shadow-md border-b border-[var(--border)] text-[var(--text-primary)] py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 font-heading text-lg font-black uppercase tracking-widest transition-transform duration-300 active:scale-98 shrink-0"
            >
              <div className="p-2 rounded-xl bg-[var(--accent)] text-white shadow-md">
                <Wrench className="w-4 h-4" />
              </div>
              <span className={`font-heading tracking-widest font-black ${isTransparent ? 'text-white' : 'text-[var(--text-primary)]'}`}>
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
                    className={`text-xs font-bold uppercase tracking-widest relative py-1.5 transition-all duration-300 ${
                      isActive 
                        ? (isTransparent ? 'text-white' : 'text-[var(--accent)]') 
                        : (isTransparent ? 'text-white/80 hover:text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')
                    }`}
                  >
                    <span>{link.name}</span>
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-transform duration-300 origin-left ${
                        isActive 
                          ? (isTransparent ? 'bg-white scale-x-100' : 'bg-[var(--accent)] scale-x-100')
                          : 'bg-[var(--accent)] scale-x-0 hover:scale-x-100'
                      }`} 
                    />
                  </Link>
                );
              })}
            </div>

            {/* Controls (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* Language Switch */}
              <button
                onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
                className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
                title="Switch Language"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Theme Switch */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
                title="Switch Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Wishlist Link */}
              <Link
                to="/favorites"
                className={`p-2 rounded-xl transition-all duration-300 relative ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
                title={t('nav.favorites')}
              >
                <Heart className={`w-4 h-4 transition-all ${favoriteIds.length > 0 ? 'fill-[var(--accent)] text-[var(--accent)] scale-105' : ''}`} />
                {favoriteIds.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-black text-white ring-2 ring-[var(--surface)]">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className={`p-2 rounded-xl transition-all duration-300 relative ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
                title={t('nav.cart')}
              >
                <ShoppingCart className="w-4 h-4" />
                {getItemCount() > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-black text-white ring-2 ring-[var(--surface)]">
                    {getItemCount()}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Nav Actions */}
            <div className="flex md:hidden items-center gap-1.5 z-50">
              
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${
                  isTransparent ? 'text-white' : 'text-[var(--text-secondary)]'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mobile Cart count shortcut */}
              <Link
                to="/cart"
                className={`p-2.5 relative ${
                  isTransparent ? 'text-white' : 'text-[var(--text-secondary)]'
                }`}
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {getItemCount() > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[8px] font-black text-white">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* Smooth hamburger menu animation lines */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all relative cursor-pointer ${
                  isTransparent ? 'text-white' : 'text-[var(--text-primary)]'
                }`}
                aria-label="Toggle menu"
              >
                <div className="w-5 h-5 flex flex-col justify-around items-center">
                  <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-[var(--page-bg)]/95 backdrop-blur-md text-[var(--text-primary)] flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto scale-100' 
            : 'opacity-0 pointer-events-none scale-102'
        }`}
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mt-16">
          <div className="flex items-center gap-3 font-heading font-extrabold text-sm uppercase tracking-widest">
            <div className="p-2 rounded-xl bg-[var(--accent)] text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span>{displayCompanyName}</span>
          </div>
        </div>

        {/* Links list */}
        <div className="flex-grow flex flex-col justify-center space-y-6 py-8 font-heading">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-2xl font-black tracking-widest transition-all uppercase ${
                  isActive ? 'text-[var(--accent)] pl-4 border-l-4 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0 rtl:rotate-180" />
              </Link>
            );
          })}
        </div>

        {/* Controls footer */}
        <div className="border-t border-[var(--border)] pt-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Language Selection */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="flex items-center justify-center gap-2 py-3 bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[var(--accent)]" />
              <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl font-bold text-xs uppercase tracking-widest transition-all relative text-[var(--text-primary)]"
            >
              <Heart className={`w-4 h-4 ${favoriteIds.length > 0 ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
              <span>{t('nav.favorites')} ({favoriteIds.length})</span>
            </Link>

          </div>

          <p className="text-[9px] text-center text-[var(--text-muted)] font-black tracking-widest mt-2">
            &copy; {new Date().getFullYear()} {displayCompanyName.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>

        </div>

      </div>
    </>
  );
}
