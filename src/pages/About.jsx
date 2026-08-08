import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { Wrench, ShieldCheck, Award, HeartHandshake, Gauge, HelpCircle } from 'lucide-react';

export default function About() {
  const { i18n } = useTranslation();
  const { settings, loading } = useSettings();
  const currentLang = i18n.language || 'en';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Wrench className="w-12 h-12 text-red-600 dark:text-red-500 animate-spin" />
        <span className="text-zinc-550 dark:text-zinc-450 text-sm font-semibold tracking-wider uppercase animate-pulse">Loading details...</span>
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
    <div className="space-y-20 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-16 relative overflow-hidden shadow-xl border border-zinc-900">
        {/* Subtle Watermark Wrench */}
        <Wrench className="absolute -right-20 -bottom-20 w-80 h-80 text-zinc-900 opacity-60 shrink-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">
            {currentLang === 'en' ? 'GENUINE PERFORMANCE' : 'الأداء الأصيل المضمون'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase font-heading">
            {companyName}
          </h1>
          <p className="text-sm sm:text-base text-zinc-350 leading-relaxed font-sans">
            {currentLang === 'en' 
              ? 'Providing certified mechanic solutions, original auto components, and luxury servicing standards for automobile enthusiasts.'
              : 'تقديم حلول ميكانيكية معتمدة، وقطع غيار أصلية، ومعايير صيانة فاخرة لعشاق السيارات.'}
          </p>
        </div>
      </section>

      {/* 2. Main content: About text & grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div className="space-y-6">
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block font-heading">
            {currentLang === 'en' ? 'Core Profile' : 'اللمحة العامة'}
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white font-heading">
            {aboutTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-450 leading-relaxed whitespace-pre-line font-sans">
            {aboutDescription}
          </p>
        </div>

        {/* Feature Icons Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-zinc-900/60 p-8 sm:p-10 rounded-3xl shadow-sm transition-colors">
          
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider font-heading">
              {currentLang === 'en' ? 'Certified Quality' : 'جودة معتمدة'}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed">
              {currentLang === 'en' ? 'All auto parts and repair tools match original factory standards.' : 'جميع قطع الغيار وأدوات الإصلاح تطابق معايير المصنع الأصلية.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider font-heading">
              {currentLang === 'en' ? 'Expert Technicians' : 'فنيون خبراء'}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed">
              {currentLang === 'en' ? 'Our professional mechanics carry decades of combined experience.' : 'يتمتع الميكانيكيون المحترفون لدينا بعقود من الخبرة المشتركة.'}
            </p>
          </div>

          <div className="space-y-3 sm:col-span-2 pt-6 border-t border-zinc-100 dark:border-zinc-900/60 flex items-start gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider font-heading">
                {currentLang === 'en' ? 'Customer Commitment' : 'الالتزام تجاه عملائنا'}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-450 mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? 'We deliver full transparency, competitive prices, and dedicated WhatsApp support.' 
                  : 'نحن نقدم الشفافية الكاملة، وأسعاراً تنافسية، ودعماً مخصصاً عبر واتساب.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        
        {/* Mission */}
        <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 sm:p-10 rounded-3xl border border-zinc-200/60 dark:border-zinc-900/60 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest font-heading">
              {missionTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            {missionDescription}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 sm:p-10 rounded-3xl border border-zinc-200/60 dark:border-zinc-900/60 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest font-heading">
              {visionTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            {visionDescription}
          </p>
        </div>

      </section>

    </div>
  );
}
