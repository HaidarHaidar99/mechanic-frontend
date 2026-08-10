import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';

const DEFAULT_ANNOUNCEMENT = {
  id: 'default',
  enabled: true,
  text: {
    en: '🔥 SPECIAL OFFER: FREE VEHICLE DIAGNOSTIC CHECK THIS WEEKEND!',
    ar: '🔥 عرض خاص: فحص تشخيصي مجاني للسيارات هذا الأسبوع!'
  }
};

export default function AnnouncementBar() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { announcements } = useAnnouncements();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Filter active announcements or fallback to default
  const activeList = announcements.filter(a => a.enabled !== false);
  const displayList = activeList.length > 0 ? activeList : [DEFAULT_ANNOUNCEMENT];

  useEffect(() => {
    if (displayList.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % displayList.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayList.length]);

  const activeAnnouncement = displayList[currentIndex] || DEFAULT_ANNOUNCEMENT;
  const displayText = activeAnnouncement?.text?.[currentLang] || activeAnnouncement?.text?.['en'] || '';

  return (
    <div className="w-full max-w-full overflow-hidden bg-zinc-950 dark:bg-black border-b border-zinc-900 text-white text-[10px] sm:text-xs font-extrabold py-2 px-4 text-center select-none uppercase tracking-widest relative z-50 font-heading shrink-0 block">
      <div 
        className={`transition-all duration-300 ease-out flex items-center justify-center gap-2 max-w-full ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-1'
        }`}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shrink-0" />
        <span className="truncate max-w-full">
          {displayText}
        </span>
      </div>
    </div>
  );
}
