import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { compressImage } from '../../utils/imageCompression';
import { 
  Settings, Image, Plus, Trash2, Upload, AlertCircle, 
  CheckCircle2, RefreshCw, ChevronUp, ChevronDown, Save
} from 'lucide-react';

export default function ManageSettings() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { settings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'carousel'

  // Global settings states
  const [companyNameEn, setCompanyNameEn] = useState('');
  const [companyNameAr, setCompanyNameAr] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [heroTitleEn, setHeroTitleEn] = useState('');
  const [heroTitleAr, setHeroTitleAr] = useState('');
  const [heroSubEn, setHeroSubEn] = useState('');
  const [heroSubAr, setHeroSubAr] = useState('');
  const [aboutTitleEn, setAboutTitleEn] = useState('');
  const [aboutTitleAr, setAboutTitleAr] = useState('');
  const [aboutDescEn, setAboutDescEn] = useState('');
  const [aboutDescAr, setAboutDescAr] = useState('');
  const [missionTitleEn, setMissionTitleEn] = useState('');
  const [missionTitleAr, setMissionTitleAr] = useState('');
  const [missionDescEn, setMissionDescEn] = useState('');
  const [missionDescAr, setMissionDescAr] = useState('');
  const [visionTitleEn, setVisionTitleEn] = useState('');
  const [visionTitleAr, setVisionTitleAr] = useState('');
  const [visionDescEn, setVisionDescEn] = useState('');
  const [visionDescAr, setVisionDescAr] = useState('');
  const [defaultTheme, setDefaultTheme] = useState('dark');

  // Carousel states
  const [slides, setSlides] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(false);

  // Status alerts
  const [globalSubmitting, setGlobalSubmitting] = useState(false);
  const [carouselSubmitting, setCarouselSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Populate global fields
  useEffect(() => {
    if (settings) {
      setCompanyNameEn(settings.companyName.en || '');
      setCompanyNameAr(settings.companyName.ar || '');
      setPhone(settings.phone || '');
      setWhatsapp(settings.whatsapp || '');
      setEmail(settings.email || '');
      setAddressEn(settings.address.en || '');
      setAddressAr(settings.address.ar || '');
      setInstagram(settings.instagram || '');
      setFacebook(settings.facebook || '');
      setHeroTitleEn(settings.heroTitle.en || '');
      setHeroTitleAr(settings.heroTitle.ar || '');
      setHeroSubEn(settings.heroSubtitle.en || '');
      setHeroSubAr(settings.heroSubtitle.ar || '');
      setAboutTitleEn(settings.aboutTitle.en || '');
      setAboutTitleAr(settings.aboutTitle.ar || '');
      setAboutDescEn(settings.aboutDescription.en || '');
      setAboutDescAr(settings.aboutDescription.ar || '');
      setMissionTitleEn(settings.missionTitle.en || '');
      setMissionTitleAr(settings.missionTitle.ar || '');
      setMissionDescEn(settings.missionDescription.en || '');
      setMissionDescAr(settings.missionDescription.ar || '');
      setVisionTitleEn(settings.visionTitle.en || '');
      setVisionTitleAr(settings.visionTitle.ar || '');
      setVisionDescEn(settings.visionDescription.en || '');
      setVisionDescAr(settings.visionDescription.ar || '');
      setDefaultTheme(settings.defaultTheme || 'dark');
    }
  }, [settings]);

  // Load Carousel slides on tab switch
  useEffect(() => {
    if (activeTab === 'carousel') {
      const fetchCarousel = async () => {
        try {
          setCarouselLoading(true);
          const res = await apiRequest('/settings/carousel');
          if (res.success && res.data) {
            setSlides(res.data.slides || []);
          }
        } catch (err) {
          console.error('Error fetching carousel:', err);
          setErrorMsg(currentLang === 'en' ? 'Failed to fetch homepage slides' : 'فشل تحميل شرائح واجهة الموقع');
        } finally {
          setCarouselLoading(false);
        }
      };
      fetchCarousel();
    } else {
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [activeTab]);

  const handleGlobalSubmit = async (e) => {
    e.preventDefault();
    if (globalSubmitting) return;

    if (!companyNameEn.trim() || !companyNameAr.trim() || !phone.trim() || !whatsapp.trim() || !email.trim() ||
        !addressEn.trim() || !addressAr.trim() || !heroTitleEn.trim() || !heroTitleAr.trim() ||
        !heroSubEn.trim() || !heroSubAr.trim() || !aboutTitleEn.trim() || !aboutTitleAr.trim() ||
        !aboutDescEn.trim() || !aboutDescAr.trim() || !missionTitleEn.trim() || !missionTitleAr.trim() ||
        !missionDescEn.trim() || !missionDescAr.trim() || !visionTitleEn.trim() || !visionTitleAr.trim() ||
        !visionDescEn.trim() || !visionDescAr.trim()) {
      setErrorMsg(currentLang === 'en' ? 'All bilingual titles and contents are required' : 'جميع الحقول النصية الثنائية مطلوبة');
      return;
    }

    const payload = {
      companyName: { en: companyNameEn.trim(), ar: companyNameAr.trim() },
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim().toLowerCase(),
      address: { en: addressEn.trim(), ar: addressAr.trim() },
      instagram: instagram.trim(),
      facebook: facebook.trim(),
      heroTitle: { en: heroTitleEn.trim(), ar: heroTitleAr.trim() },
      heroSubtitle: { en: heroSubEn.trim(), ar: heroSubAr.trim() },
      aboutTitle: { en: aboutTitleEn.trim(), ar: aboutTitleAr.trim() },
      aboutDescription: { en: aboutDescEn.trim(), ar: aboutDescAr.trim() },
      missionTitle: { en: missionTitleEn.trim(), ar: missionTitleAr.trim() },
      missionDescription: { en: missionDescEn.trim(), ar: missionDescAr.trim() },
      visionTitle: { en: visionTitleEn.trim(), ar: visionTitleAr.trim() },
      visionDescription: { en: visionDescEn.trim(), ar: visionDescAr.trim() },
      defaultTheme
    };

    try {
      setGlobalSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setSuccessMsg(currentLang === 'en' ? 'Settings updated successfully' : 'تم تحديث الإعدادات العامة بنجاح');
        refreshSettings(); // Refresh context
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setGlobalSubmitting(false);
    }
  };

  const handleAddSlide = () => {
    if (slides.length >= 3) {
      alert(currentLang === 'en' ? 'Carousel supports a maximum of 3 slides' : 'الحد الأقصى لشرائح العرض هو 3 شرائح');
      return;
    }
    const newSlide = {
      id: Math.random().toString(36).substr(2, 9),
      imageBase64: '',
      title: { en: '', ar: '' },
      subtitle: { en: '', ar: '' },
      order: slides.length + 1,
      enabled: true
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (id) => {
    if (slides.length <= 1) {
      alert(currentLang === 'en' ? 'Carousel requires at least 1 slide' : 'يجب وجود شريحة واحدة على الأقل في العرض');
      return;
    }
    setSlides(slides.filter(slide => slide.id !== id).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const handleSlideChange = (id, field, value, subField = null) => {
    setSlides(prev => prev.map(slide => {
      if (slide.id === id) {
        if (subField) {
          return {
            ...slide,
            [field]: {
              ...slide[field],
              [subField]: value
            }
          };
        }
        return { ...slide, [field]: value };
      }
      return slide;
    }));
  };

  const handleSlideImageUpload = async (id, file) => {
    if (!file) return;
    try {
      const base64Url = await compressImage(file);
      handleSlideChange(id, 'imageBase64', base64Url);
    } catch (err) {
      console.error('Error uploading slide image:', err);
      alert(currentLang === 'en' ? 'Failed to process image' : 'فشل تحميل الصورة');
    }
  };

  const handleMoveSlide = (index, direction) => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= slides.length) return;

    const list = [...slides];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    const reordered = list.map((slide, idx) => ({ ...slide, order: idx + 1 }));
    setSlides(reordered);
  };

  const handleSaveCarousel = async () => {
    if (carouselSubmitting) return;

    if (slides.length < 1 || slides.length > 3) {
      setErrorMsg(currentLang === 'en' ? 'Slide count must be between 1 and 3' : 'يجب أن يكون عدد الشرائح بين 1 و 3');
      return;
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (!slide.imageBase64 || !slide.title.en.trim() || !slide.title.ar.trim() ||
          !slide.subtitle.en.trim() || !slide.subtitle.ar.trim()) {
        setErrorMsg(currentLang === 'en' 
          ? `Slide ${i + 1} is missing mandatory title, subtitle, or image.` 
          : `الشريحة رقم ${i + 1} تفتقر للعنوان أو الوصف أو صورة الخلفية.`);
        return;
      }
    }

    try {
      setCarouselSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await apiRequest('/settings/carousel', {
        method: 'PUT',
        body: JSON.stringify({ slides })
      });

      if (res.success) {
        setSuccessMsg(currentLang === 'en' ? 'Carousel slides updated successfully' : 'تم تحديث شرائح العرض بنجاح');
      } else {
        throw new Error(res.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Carousel save error:', err);
      setErrorMsg(err.message || 'Could not update homepage carousel');
    } finally {
      setCarouselSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <h1 className="text-xl font-bold text-zinc-955 dark:text-white uppercase tracking-wider font-heading">
          {currentLang === 'en' ? 'Website Settings' : 'إعدادات الموقع العام'}
        </h1>
        <p className="text-xs text-zinc-400">
          {currentLang === 'en' ? 'Modify text content, logos, themes, and hero slide images.' : 'تعديل النصوص والشعارات والألوان الافتراضية وصور العرض في الواجهة.'}
        </p>
      </div>

      {/* Tab selectors */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 text-xs">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
            activeTab === 'global'
              ? 'border-red-600 text-red-650 dark:border-red-500 dark:text-red-500'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Global Settings' : 'الإعدادات العامة'}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('carousel')}
          className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
            activeTab === 'carousel'
              ? 'border-red-600 text-red-650 dark:border-red-500 dark:text-red-500'
              : 'border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Homepage Carousel' : 'شرائح واجهة الموقع'}</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      
      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-green-955/20 text-green-400 rounded-xl text-xs border border-green-900/50">
          <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab contents */}
      {activeTab === 'global' ? (
        
        <form onSubmit={handleGlobalSubmit} className="space-y-8 bg-white dark:bg-[#121215] p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-900 shadow-sm transition-colors animate-fade-in">
          
          {/* Section: Contact & Identity */}
          <div className="space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-red-500 border-b border-zinc-100 dark:border-zinc-900/60 pb-2 font-heading">
              {currentLang === 'en' ? '1. Brand & Contact Information' : '١. الهوية ومعلومات الاتصال'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Co Name EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">Company Name (EN)</label>
                <input
                  type="text"
                  required
                  value={companyNameEn}
                  onChange={(e) => setCompanyNameEn(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Co Name AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right">اسم الشركة (العربية)</label>
                <input
                  type="text"
                  required
                  value={companyNameAr}
                  onChange={(e) => setCompanyNameAr(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans text-right"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">WhatsApp (e.g. 962790000000)</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Public Store Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Address EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Store Address (EN)</label>
                <input
                  type="text"
                  required
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Address AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right">العنوان (العربية)</label>
                <input
                  type="text"
                  required
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans text-right"
                />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Instagram Link</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Facebook */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Facebook Page Link</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Default Theme */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Default Theme for visitors</label>
                <select
                  value={defaultTheme}
                  onChange={(e) => setDefaultTheme(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white cursor-pointer font-sans"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section: Landing Hero */}
          <div className="space-y-5 pt-6 border-t border-zinc-150 dark:border-zinc-900/60">
            <h2 className="text-xs font-black uppercase tracking-widest text-red-500 border-b border-zinc-105 dark:border-zinc-900/60 pb-2 font-heading">
              {currentLang === 'en' ? '2. Landing Hero Text' : '٢. نصوص واجهة العرض الرئيسية'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Hero Title EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Hero Title (EN)</label>
                <input
                  type="text"
                  required
                  value={heroTitleEn}
                  onChange={(e) => setHeroTitleEn(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Hero Title AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right">العنوان الرئيسي للواجهة (العربية)</label>
                <input
                  type="text"
                  required
                  value={heroTitleAr}
                  onChange={(e) => setHeroTitleAr(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans text-right"
                />
              </div>

              {/* Hero Subtitle EN */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Hero Subtitle (EN)</label>
                <input
                  type="text"
                  required
                  value={heroSubEn}
                  onChange={(e) => setHeroSubEn(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Hero Subtitle AR */}
              <div className="flex flex-col gap-1.5 sm:col-span-2" dir="rtl">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right font-sans">العنوان الفرعي للواجهة (العربية)</label>
                <input
                  type="text"
                  required
                  value={heroSubAr}
                  onChange={(e) => setHeroSubAr(e.target.value)}
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans text-right"
                />
              </div>

            </div>
          </div>

          {/* Section: About, Mission, Vision */}
          <div className="space-y-6 pt-6 border-t border-zinc-150 dark:border-zinc-900/60">
            <h2 className="text-xs font-black uppercase tracking-widest text-red-500 border-b border-zinc-105 dark:border-zinc-900/60 pb-2 font-heading">
              {currentLang === 'en' ? '3. About, Mission, & Vision Text Blocks' : '٣. نصوص "عن المحل"، "مهمتنا"، و "رؤيتنا"'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* About BLOCK */}
              <div className="space-y-4 p-5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-205 dark:border-zinc-900 rounded-2xl">
                <h3 className="text-xs font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">About Us</h3>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Title (EN)</label>
                  <input type="text" required value={aboutTitleEn} onChange={(e) => setAboutTitleEn(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1" dir="rtl">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">العنوان (AR)</label>
                  <input type="text" required value={aboutTitleAr} onChange={(e) => setAboutTitleAr(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white font-sans text-right" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Description (EN)</label>
                  <textarea rows="4" required value={aboutDescEn} onChange={(e) => setAboutDescEn(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs resize-none text-zinc-950 dark:text-white font-sans animate-none" />
                </div>
                <div className="flex flex-col gap-1" dir="rtl">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">الوصف (AR)</label>
                  <textarea rows="4" required value={aboutDescAr} onChange={(e) => setAboutDescAr(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs resize-none text-zinc-950 dark:text-white font-sans text-right animate-none" />
                </div>
              </div>

              {/* Mission BLOCK */}
              <div className="space-y-4 p-5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-205 dark:border-zinc-900 rounded-2xl">
                <h3 className="text-xs font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">Our Mission</h3>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Title (EN)</label>
                  <input type="text" required value={missionTitleEn} onChange={(e) => setMissionTitleEn(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white font-sans" />
                </div>
                <div className="flex flex-col gap-1" dir="rtl">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">العنوان (AR)</label>
                  <input type="text" required value={missionTitleAr} onChange={(e) => setMissionTitleAr(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white font-sans text-right" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Description (EN)</label>
                  <textarea rows="4" required value={missionDescEn} onChange={(e) => setMissionDescEn(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs resize-none text-zinc-950 dark:text-white font-sans animate-none" />
                </div>
                <div className="flex flex-col gap-1" dir="rtl">
                  <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">الوصف (AR)</label>
                  <textarea rows="4" required value={missionDescAr} onChange={(e) => setMissionDescAr(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs resize-none text-zinc-950 dark:text-white font-sans text-right animate-none" />
                </div>
              </div>

              {/* Vision BLOCK */}
              <div className="space-y-4 p-5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-205 dark:border-zinc-900 rounded-2xl md:col-span-2">
                <h3 className="text-xs font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">Our Vision</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Title (EN)</label>
                    <input type="text" required value={visionTitleEn} onChange={(e) => setVisionTitleEn(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white font-sans" />
                  </div>
                  
                  <div className="flex flex-col gap-1" dir="rtl">
                    <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">العنوان (AR)</label>
                    <input type="text" required value={visionTitleAr} onChange={(e) => setVisionTitleAr(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white font-sans text-right" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Description (EN)</label>
                    <textarea rows="3" required value={visionDescEn} onChange={(e) => setVisionDescEn(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs resize-none text-zinc-950 dark:text-white font-sans animate-none" />
                  </div>
                  
                  <div className="flex flex-col gap-1" dir="rtl">
                    <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right font-sans">الوصف (AR)</label>
                    <textarea rows="3" required value={visionDescAr} onChange={(e) => setVisionDescAr(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs resize-none text-zinc-950 dark:text-white font-sans text-right animate-none" />
                  </div>
                  
                </div>
              </div>

            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
            <button
              type="submit"
              disabled={globalSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-650 hover:bg-red-755 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-450 dark:disabled:text-zinc-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{globalSubmitting ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

      ) : (
        
        // --- HOMEPAGE CAROUSEL MANAGER ---
        <div className="space-y-6 bg-white dark:bg-[#121215] p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-900 shadow-sm transition-colors animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/60 pb-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-red-500 font-heading">
                {currentLang === 'en' ? 'Slides Configuration' : 'إعدادات شرائح العرض'}
              </h2>
              <p className="text-[10px] text-zinc-400 mt-0.5 font-semibold">
                {currentLang === 'en' 
                  ? 'Configure images shown on the home page (min 1, max 3).' 
                  : 'إدارة شرائح العرض المعروضة في الصفحة الرئيسية للموقع (بحد أدنى شريحة واحدة وأقصى ٣).'}
              </p>
            </div>
            
            <button
              onClick={handleAddSlide}
              disabled={slides.length >= 3}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-650 rounded-xl shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Add Slide' : 'إضافة شريحة'}</span>
            </button>
          </div>

          {carouselLoading ? (
            <div className="text-center py-8 text-xs text-zinc-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading slides...</span>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-xs text-zinc-450 font-semibold">
              {currentLang === 'en' ? 'No slides configured yet.' : 'لا توجد شرائح حالياً.'}
            </div>
          ) : (
            <div className="space-y-6">
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id} 
                  className="border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-950/10 flex flex-col md:flex-row gap-6 relative"
                >
                  {/* Image picker box */}
                  <div className="w-full md:w-48 aspect-video md:aspect-auto md:h-36 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 relative overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlideImageUpload(slide.id, e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 font-sans"
                    />
                    {slide.imageBase64 ? (
                      <img src={slide.imageBase64} alt="Slide Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-zinc-400 flex flex-col items-center p-2">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Upload Slide Image</span>
                      </div>
                    )}
                  </div>

                  {/* Input fields */}
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Title EN */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Slide Title (EN)</label>
                      <input 
                        type="text" 
                        value={slide.title.en} 
                        onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value, 'en')} 
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" 
                      />
                    </div>

                    {/* Title AR */}
                    <div className="flex flex-col gap-1" dir="rtl">
                      <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">عنوان الشريحة (AR)</label>
                      <input 
                        type="text" 
                        value={slide.title.ar} 
                        onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value, 'ar')} 
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans text-right" 
                      />
                    </div>

                    {/* Subtitle EN */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Slide Subtitle (EN)</label>
                      <input 
                        type="text" 
                        value={slide.subtitle.en} 
                        onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value, 'en')} 
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" 
                      />
                    </div>

                    {/* Subtitle AR */}
                    <div className="flex flex-col gap-1" dir="rtl">
                      <label className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">وصف الشريحة (AR)</label>
                      <input 
                        type="text" 
                        value={slide.subtitle.ar} 
                        onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value, 'ar')} 
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans text-right" 
                      />
                    </div>

                  </div>

                  {/* Actions / Ordering control bar */}
                  <div className="flex md:flex-col items-center justify-between border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-900 pt-4 md:pt-0 md:pl-4 shrink-0 gap-3">
                    
                    {/* Ordering arrows */}
                    <div className="flex md:flex-col gap-1">
                      <button 
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-900 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-900 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Enable toggle */}
                    <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-650 dark:text-zinc-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => handleSlideChange(slide.id, 'enabled', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-800 text-red-655 focus:ring-red-500 cursor-pointer"
                      />
                      <span>Active</span>
                    </label>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                      title="Remove slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))}

              {/* Action buttons */}
              <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                <button
                  onClick={handleSaveCarousel}
                  disabled={carouselSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-650 hover:bg-red-755 disabled:bg-zinc-200 dark:disabled:bg-zinc-850 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{carouselSubmitting ? 'Saving Slides...' : 'Save Homepage Slides'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      )}

    </div>
  );
}
