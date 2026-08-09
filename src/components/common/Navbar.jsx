import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  ShoppingCart, Heart, Sun, Moon, Globe, Wrench, 
  Search, MessageSquare, ChevronRight, X 
} from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { getItemCount } = useCart();
  const { favoriteIds } = useFavorites();
  const { settings } = useSettings();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
  const displayCompanyName = settings ? settings.companyName[currentLang] : 'MECHANIC';

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <nav 
        className={`z-40 w-full transition-all duration-300 ${
          isTransparent 
            ? 'absolute left-0 bg-transparent text-white border-transparent py-4' 
            : 'fixed top-0 left-0 bg-[var(--surface)]/85 backdrop-blur-md shadow-md border-b border-[var(--border)] text-[var(--text-primary)] py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= DESKTOP NAVBAR ================= */}
          <div className="hidden md:flex items-center justify-between h-14">
            
            {/* Logo */}
            <Link 
              to="/" 
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
            <div className="flex items-center gap-8 font-heading">
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
            <div className="flex items-center gap-2">
              
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Switch */}
              <button
                onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
                className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                  isTransparent 
                    ? 'hover:bg-white/10 text-white/90 hover:text-white' 
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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

          </div>

          {/* ================= MOBILE NAVBAR ================= */}
          {/* Structure: [ ☰ ]        BRAND NAME        [ 🔍 ][ 🛒 ] */}
          <div className="flex md:hidden items-center justify-between h-12 w-full font-heading">
            
            {/* LEFT: Hamburger icon button only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isTransparent ? 'text-white' : 'text-[var(--text-primary)]'
              }`}
              aria-label="Toggle navigation menu"
            >
              <div className="w-5 h-5 flex flex-col justify-around items-center">
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </div>
            </button>

            {/* CENTER: Brand name (Text only) */}
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`font-black text-sm sm:text-base tracking-widest uppercase truncate px-2 ${
                isTransparent ? 'text-white' : 'text-[var(--text-primary)]'
              }`}
            >
              {displayCompanyName}
            </Link>

            {/* RIGHT: Search icon & Cart icon with count */}
            <div className="flex items-center gap-1">
              
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isTransparent ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-label="Open search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Cart button with count */}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 relative transition-all ${
                  isTransparent ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {getItemCount() > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[8px] font-black text-white">
                    {getItemCount()}
                  </span>
                )}
              </Link>
            </div>

          </div>

        </div>
      </nav>

      {/* ================= FULLSCREEN MOBILE DRAWER ================= */}
      <div 
        className={`fixed inset-0 z-40 bg-[var(--page-bg)] text-[var(--text-primary)] flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto scale-100' 
            : 'opacity-0 pointer-events-none scale-102'
        }`}
      >
        {/* Mobile menu top bar */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mt-14">
          <span className="font-heading font-black text-xs uppercase tracking-widest text-[var(--accent)]">
            Menu Navigation
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Touch-friendly Navigation Rows */}
        <div className="flex-grow flex flex-col justify-center space-y-4 py-6 font-heading">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-xl sm:text-2xl font-black tracking-widest py-3 px-4 rounded-2xl transition-all uppercase ${
                  isActive 
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] shrink-0 rtl:rotate-180" />
              </Link>
            );
          })}

          {/* Favorites shortcut row */}
          <Link
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-xl sm:text-2xl font-black tracking-widest py-3 px-4 rounded-2xl transition-all uppercase text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          >
            <div className="flex items-center gap-3">
              <Heart className={`w-5 h-5 ${favoriteIds.length > 0 ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
              <span>{t('nav.favorites')}</span>
            </div>
            <span className="text-xs font-black bg-[var(--surface-elevated)] border border-[var(--border)] px-2.5 py-1 rounded-full text-[var(--accent)]">
              {favoriteIds.length}
            </span>
          </Link>

          {/* Cart shortcut row */}
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-xl sm:text-2xl font-black tracking-widest py-3 px-4 rounded-2xl transition-all uppercase text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-[var(--text-muted)]" />
              <span>{t('nav.cart')}</span>
            </div>
            <span className="text-xs font-black bg-[var(--accent)] text-white px-2.5 py-1 rounded-full">
              {getItemCount()}
            </span>
          </Link>
        </div>

        {/* Drawer Footer Controls */}
        <div className="border-t border-[var(--border)] pt-5 space-y-3 font-heading">
          
          <div className="grid grid-cols-2 gap-3">
            
            {/* Language Switch */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="flex items-center justify-center gap-2 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer text-[var(--text-primary)]"
            >
              <Globe className="w-4 h-4 text-[var(--accent)]" />
              <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer text-[var(--text-primary)]"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[var(--accent)]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

          </div>

          {/* WhatsApp Quick Link */}
          {settings && settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>{currentLang === 'en' ? 'WhatsApp Support' : 'الدعم عبر واتساب'}</span>
            </a>
          )}

          <p className="text-[9px] text-center text-[var(--text-muted)] font-black tracking-widest pt-2 uppercase">
            &copy; {new Date().getFullYear()} {displayCompanyName}. ALL RIGHTS RESERVED.
          </p>

        </div>

      </div>

      {/* Mobile Search Overlay */}
      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </>
  );
}
