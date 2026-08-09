import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { Wrench, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import Container from '../components/common/Container';
import SectionHeader from '../components/common/SectionHeader';
import Badge from '../components/common/Badge';

export default function About() {
  const { i18n } = useTranslation();
  const { settings, loading } = useSettings();
  const currentLang = i18n.language || 'en';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Wrench className="w-12 h-12 text-[var(--accent)] animate-spin" />
        <span className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-widest animate-pulse font-heading">Loading details...</span>
      </div>
    );
  }

  const aboutTitle = settings ? settings.aboutTitle[currentLang] : 'About Us';
  const aboutDescription = settings ? settings.aboutDescription[currentLang] : '';
  const missionTitle = settings ? settings.missionTitle[currentLang] : 'Our Mission';
  const missionDescription = settings ? settings.missionDescription[currentLang] : '';
  const visionTitle = settings ? settings.visionTitle[currentLang] : 'Our Vision';
  const visionDescription = settings ? settings.visionDescription[currentLang] : '';
  const companyName = settings ? settings.companyName[currentLang] : 'Mechanic Pro';

  return (
    <Container className="py-8 space-y-16">
      
      {/* 1. Header Banner */}
      <section className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-16 relative overflow-hidden shadow-lg">
        <Wrench className="absolute -right-20 -bottom-20 w-80 h-80 text-zinc-900 opacity-60 shrink-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-heading">
            {currentLang === 'en' ? 'Genuine Performance' : 'الأداء الأصيل المضمون'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase font-heading">
            {companyName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-350 leading-relaxed font-sans">
            {currentLang === 'en' 
              ? 'Providing certified mechanic solutions, original auto components, and luxury servicing standards for automobile enthusiasts.'
              : 'تقديم حلول ميكانيكية معتمدة، وقطع غيار أصلية، ومعايير صيانة فاخرة لعشاق السيارات.'}
          </p>
        </div>
      </section>

      {/* 2. Main Profile Content */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div className="space-y-4">
          <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            {currentLang === 'en' ? 'Core Profile' : 'اللمحة العامة'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-heading uppercase">
            {aboutTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-sans">
            {aboutDescription}
          </p>
        </div>

        {/* Feature badges card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 rounded-3xl shadow-sm">
          
          <div className="space-y-3">
            <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider font-heading">
              {currentLang === 'en' ? 'Certified Quality' : 'جودة معتمدة'}
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {currentLang === 'en' ? 'All auto parts and repair tools match original factory standards.' : 'جميع قطع الغيار وأدوات الإصلاح تطابق معايير المصنع الأصلية.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider font-heading">
              {currentLang === 'en' ? 'Expert Technicians' : 'فنيون خبراء'}
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {currentLang === 'en' ? 'Our professional mechanics carry decades of combined experience.' : 'يتمتع الميكانيكيون المحترفون لدينا بعقود من الخبرة المشتركة.'}
            </p>
          </div>

          <div className="space-y-3 sm:col-span-2 pt-6 border-t border-[var(--border)] flex items-start gap-4">
            <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider font-heading">
                {currentLang === 'en' ? 'Customer Commitment' : 'الالتحزام تجاه عملائنا'}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                {currentLang === 'en' 
                  ? 'We deliver full transparency, competitive prices, and dedicated WhatsApp support.' 
                  : 'نحن نقدم الشفافية الكاملة، وأسعاراً تنافسية، ودعماً مخصصاً عبر واتساب.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Mission */}
        <div className="bg-[var(--surface-elevated)] p-8 sm:p-10 rounded-3xl border border-[var(--border)] space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <h3 className="text-xs font-black text-[var(--accent)] uppercase tracking-widest font-heading">
              {missionTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
            {missionDescription}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-[var(--surface-elevated)] p-8 sm:p-10 rounded-3xl border border-[var(--border)] space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <h3 className="text-xs font-black text-[var(--accent)] uppercase tracking-widest font-heading">
              {visionTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
            {visionDescription}
          </p>
        </div>

      </section>

    </Container>
  );
}
