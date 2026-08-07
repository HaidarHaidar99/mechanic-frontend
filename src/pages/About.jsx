import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { Wrench, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function About() {
  const { i18n } = useTranslation();
  const { settings, loading } = useSettings();
  const currentLang = i18n.language || 'en';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <Wrench className="w-10 h-10 text-red-650 animate-spin" />
        <span className="text-gray-500 text-sm">Loading details...</span>
      </div>
    );
  }

  // Fallbacks
  const aboutTitle = settings ? settings.aboutTitle[currentLang] : 'About Us';
  const aboutDescription = settings ? settings.aboutDescription[currentLang] : '';
  const missionTitle = settings ? settings.missionTitle[currentLang] : 'Our Mission';
  const missionDescription = settings ? settings.missionDescription[currentLang] : '';
  const visionTitle = settings ? settings.visionTitle[currentLang] : 'Our Vision';
  const visionDescription = settings ? settings.visionDescription[currentLang] : '';
  const companyName = settings ? settings.companyName[currentLang] : 'Mechanic Pro';

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Page Header / Hero style Banner */}
      <section className="bg-gray-900 text-white rounded-2xl p-8 sm:p-16 relative overflow-hidden shadow-md">
        <Wrench className="absolute -right-16 -bottom-16 w-72 h-72 text-gray-800 opacity-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">
            {currentLang === 'en' ? 'ABOUT OUR SHOP' : 'عن ورشتنا'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {companyName}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {currentLang === 'en' 
              ? 'Reliable auto repairs, genuine commerce, and state-of-the-art mechanic solutions.'
              : 'إصلاحات موثوقة للسيارات، وتجارة أصلية، وحلول ميكانيكية متطورة.'}
          </p>
        </div>
      </section>

      {/* 2. Main content: About description */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {aboutTitle}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {aboutDescription}
          </p>
        </div>

        {/* Brand features icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-sm transition-colors">
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-red-650" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {currentLang === 'en' ? 'Certified Quality' : 'جودة معتمدة'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentLang === 'en' ? 'All auto parts and repair tools match original factory standards.' : 'جميع قطع الغيار وأدوات الإصلاح تطابق معايير المصنع الأصلية.'}
            </p>
          </div>

          <div className="space-y-2">
            <Award className="w-8 h-8 text-red-650" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              {currentLang === 'en' ? 'Years of Expertise' : 'سنوات من الخبرة'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentLang === 'en' ? 'Our professional mechanics carry decades of combined experience.' : 'يتمتع الميكانيكيون المحترفون لدينا بعقود من الخبرة المشتركة.'}
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2 pt-2 border-t border-gray-150 dark:border-gray-800 flex items-start gap-4">
            <HeartHandshake className="w-10 h-10 text-red-650 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                {currentLang === 'en' ? 'Customer Commitment' : 'الالتزام تجاه عملائنا'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {currentLang === 'en' 
                  ? 'We deliver full transparency, competitive prices, and dedicated WhatsApp support.' 
                  : 'نحن نقدم الشفافية الكاملة، وأسعاراً تنافسية، ودعماً مخصصاً عبر واتساب.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="bg-gray-100 dark:bg-gray-900/40 p-8 rounded-2xl border border-gray-200 dark:border-gray-850 space-y-4">
          <h3 className="text-lg font-bold text-red-650 dark:text-red-500 uppercase tracking-wider">
            {missionTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {missionDescription}
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-gray-100 dark:bg-gray-900/40 p-8 rounded-2xl border border-gray-200 dark:border-gray-850 space-y-4">
          <h3 className="text-lg font-bold text-red-650 dark:text-red-500 uppercase tracking-wider">
            {visionTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {visionDescription}
          </p>
        </div>

      </section>

    </div>
  );
}
