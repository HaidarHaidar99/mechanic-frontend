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
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 font-sans transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Intro */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5 font-heading text-white font-black text-lg uppercase tracking-widest transition-opacity hover:opacity-90">
              <div className="p-2 rounded-xl bg-red-600 text-white shadow-md">
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
                  className="p-2.5 bg-zinc-900 text-zinc-400 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300"
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
                  className="p-2.5 bg-zinc-900 text-zinc-400 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300"
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
            <ul className="space-y-2.5 text-xs font-bold">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors uppercase tracking-widest block">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-red-500 transition-colors uppercase tracking-widest block">{t('nav.products')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 transition-colors uppercase tracking-widest block">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition-colors uppercase tracking-widest block">{t('nav.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-heading text-white text-xs font-black uppercase tracking-widest">
              {currentLang === 'en' ? 'Store Location' : 'موقع المحل'}
            </h3>
            <ul className="space-y-3 text-xs font-bold">
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
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
                  <span className="leading-relaxed">{address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Business Support */}
          <div className="space-y-4">
            <h3 className="font-heading text-white text-xs font-black uppercase tracking-widest">
              {currentLang === 'en' ? 'Support Hours' : 'ساعات الدعم'}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              {currentLang === 'en' 
                ? 'Our customer support channels are active 24/7. Send your queries directly on WhatsApp for instant booking.'
                : 'قنوات دعم العملاء لدينا نشطة على مدار الساعة طوال أيام الأسبوع. أرسل استفسارك مباشرة عبر واتساب للحصول على حجز فوري.'}
            </p>
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-green-500 transition-colors uppercase tracking-widest font-heading"
              >
                <MessageSquare className="w-4.5 h-4.5 text-green-500 fill-green-500" />
                <span>{currentLang === 'en' ? 'WhatsApp Support' : 'دعم واتساب'}</span>
              </a>
            )}
          </div>

        </div>

        {/* Bottom copyright banner */}
        <div className="border-t border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <p>
            &copy; {currentYear} {displayCompanyName.toUpperCase()}. {currentLang === 'en' ? 'All Rights Reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
          <a 
            href="https://wa.me/96170973086" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 font-heading bg-zinc-900/90 hover:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-800 hover:border-emerald-500/40 shadow-sm transition-all group cursor-pointer"
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400">Made by</span>
            <span className="text-red-500 font-black text-xs uppercase tracking-wider group-hover:text-red-400 transition-colors">h.haidar</span>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/25 text-[10px] font-sans font-bold group-hover:bg-emerald-500/20 transition-all">
              <svg className="w-3.5 h-3.5 fill-current text-emerald-400 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>+96170973086</span>
            </div>
          </a>
        </div>

      </div>
    </footer>
  );
}
