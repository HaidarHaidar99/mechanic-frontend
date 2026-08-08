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
    <footer className="bg-[#0b0c10] text-[#94a3b8] border-t border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Intro */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5 font-heading text-white font-extrabold text-lg uppercase tracking-widest transition-opacity hover:opacity-90">
              <div className="p-2 rounded-lg bg-red-600 text-white shadow-md shadow-red-500/10">
                <Wrench className="w-4 h-4" />
              </div>
              <span>{displayCompanyName}</span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400">
              {currentLang === 'en' 
                ? 'Your premium partner for automotive commerce, genuine auto parts, and professional repair services. Engineered for quality.' 
                : 'شريكك المتميز لتجارة السيارات وقطع الغيار الأصلية وخدمات الإصلاح الاحترافية. مصمم لتحقيق أعلى جودة.'}
            </p>
            {/* Social Icons */}
            <div className="flex gap-2 pt-2">
              {facebook && (
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {instagram && (
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-white text-xs font-black uppercase tracking-widest">
              {currentLang === 'en' ? 'Quick Navigation' : 'روابط سريعة'}
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors uppercase tracking-wider block">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-red-500 transition-colors uppercase tracking-wider block">{t('nav.products')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 transition-colors uppercase tracking-wider block">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition-colors uppercase tracking-wider block">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-heading text-white text-xs font-black uppercase tracking-widest">
              {currentLang === 'en' ? 'Store Location' : 'موقع المحل'}
            </h3>
            <ul className="space-y-3 text-xs font-semibold">
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                </li>
              )}
              {whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-500 shrink-0" />
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Chat</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-400">{address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-heading text-white text-xs font-black uppercase tracking-widest">
              {currentLang === 'en' ? 'Business Hours' : 'ساعات العمل'}
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400">
              <li className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>{currentLang === 'en' ? 'Monday - Friday:' : 'الاثنين - الجمعة:'}</span>
                <span className="text-white">8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span>{currentLang === 'en' ? 'Saturday:' : 'السبت:'}</span>
                <span className="text-white">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>{currentLang === 'en' ? 'Sunday:' : 'الأحد:'}</span>
                <span className="text-red-500 font-extrabold">{currentLang === 'en' ? 'CLOSED' : 'مغلق'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-550 font-bold uppercase tracking-wider gap-4">
          <p>&copy; {currentYear} {displayCompanyName}. ALL RIGHTS RESERVED.</p>
          <p className="text-zinc-600 hover:text-zinc-400 transition-colors">
            {currentLang === 'en' 
              ? 'Engineered for premium performance.' 
              : 'صُمم لأداء متميز وعالٍ.'}
          </p>
        </div>

      </div>
    </footer>
  );
}
