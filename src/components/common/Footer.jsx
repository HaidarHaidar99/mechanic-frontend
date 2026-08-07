import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Phone, Mail, MapPin, MessageSquare, Facebook, Instagram, Wrench } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();

  const currentLang = i18n.language || 'en';
  const displayCompanyName = settings ? settings.companyName[currentLang] : 'Mechanic Pro';
  const phone = settings ? settings.phone : '';
  const email = settings ? settings.email : '';
  const whatsapp = settings ? settings.whatsapp : '';
  const address = settings ? settings.address[currentLang] : '';
  const facebook = settings ? settings.facebook : '';
  const instagram = settings ? settings.instagram : '';

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand/Logo Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wider">
              <Wrench className="w-5 h-5 text-red-500" />
              <span>{displayCompanyName}</span>
            </Link>
            <p className="text-sm text-gray-400">
              {currentLang === 'en' 
                ? 'Your premium partner for automotive commerce, genuine auto parts, and professional repair services.' 
                : 'شريكك المتميز لتجارة السيارات وقطع الغيار الأصلية وخدمات الإصلاح الاحترافية.'}
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 rtl:space-x-reverse pt-2">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-white hover:bg-gray-850 rounded-full transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-white hover:bg-gray-850 rounded-full transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {currentLang === 'en' ? 'Quick Links' : 'روابط سريعة'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">{t('nav.products')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {currentLang === 'en' ? 'Contact Details' : 'تفاصيل الاتصال'}
            </h3>
            
            {phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-red-500" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
            )}
            
            {whatsapp && (
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              </div>
            )}

            {email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-red-500" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </div>
            )}

            {address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{address}</span>
              </div>
            )}
          </div>

          {/* Business Hours Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {currentLang === 'en' ? 'Working Hours' : 'ساعات العمل'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>{currentLang === 'en' ? 'Mon - Fri:' : 'الاثنين - الجمعة:'}</span>
                <span className="text-gray-300">8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>{currentLang === 'en' ? 'Saturday:' : 'السبت:'}</span>
                <span className="text-gray-300">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>{currentLang === 'en' ? 'Sunday:' : 'الأحد:'}</span>
                <span className="text-red-500 font-medium">{currentLang === 'en' ? 'Closed' : 'مغلق'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Area */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {currentYear} {displayCompanyName}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            {currentLang === 'en' 
              ? 'Engineered for premium performance.' 
              : 'صُمم لأداء متميز وعالٍ.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
