import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ShoppingCart, Heart, Sun, Moon, Globe, Menu, X, Wrench } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { getItemCount } = useCart();
  const { favoriteIds } = useFavorites();
  const { settings } = useSettings();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#16171d]/85 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl uppercase tracking-wider">
              <Wrench className="w-6 h-6 text-red-600 dark:text-red-500 animate-pulse" />
              <span>{displayCompanyName}</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-red-600 dark:hover:text-red-500 ${
                  location.pathname === link.path
                    ? 'text-red-600 dark:text-red-500 font-semibold'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Controls & Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Change Language"
              aria-label="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
              title={t('nav.favorites')}
            >
              <Heart className={`w-5 h-5 ${favoriteIds.length > 0 ? 'fill-red-600 text-red-600 dark:fill-red-500 dark:text-red-500' : ''}`} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {favoriteIds.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
              title={t('nav.cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex md:hidden items-center space-x-2 rtl:space-x-reverse">
            {/* Quick Cart for Mobile Header */}
            <Link
              to="/cart"
              className="p-2 text-gray-600 dark:text-gray-300 relative"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {getItemCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#16171d] border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-2 transition-all">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2 flex items-center justify-around">
            {/* Language switch */}
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-lg transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse pt-2 border-t border-gray-100 dark:border-gray-850">
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
            >
              <Heart className={`w-5 h-5 ${favoriteIds.length > 0 ? 'fill-red-600 text-red-600' : ''}`} />
              <span className="text-sm">({favoriteIds.length})</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
