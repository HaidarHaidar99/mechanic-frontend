import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';

export default function AnnouncementBar() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { announcements } = useAnnouncements();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      // Wait for fade out animation before changing index
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % announcements.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const activeAnnouncement = announcements[currentIndex];
  const displayText = activeAnnouncement?.text?.[currentLang] || activeAnnouncement?.text?.['en'] || '';

  return (
    <div className="w-full bg-[#1b1c21] dark:bg-black border-b border-gray-800 text-white text-[11px] sm:text-xs font-semibold py-2.5 px-4 text-center select-none uppercase tracking-widest relative z-50">
      <div 
        className={`transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-1'
        }`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
        <span className="truncate max-w-full font-heading">
          {displayText}
        </span>
      </div>
    </div>
  );
}
