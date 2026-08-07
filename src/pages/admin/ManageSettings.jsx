import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { compressImage } from '../../utils/imageCompression';
import { 
  Settings, Image, Plus, Trash2, Upload, AlertCircle, 
  CheckCircle2, RefreshCw, ChevronUp, ChevronDown, Wrench 
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

    // Check required localized fields
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

  // Carousel actions
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

    // Reset order index
    const reordered = list.map((slide, idx) => ({ ...slide, order: idx + 1 }));
    setSlides(reordered);
  };

  const handleSaveCarousel = async () => {
    if (carouselSubmitting) return;

    // Validate slideshow array
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
      <div className="border-b border-gray-250 dark:border-gray-850 pb-4">
        <h1 className="text-xl font-bold text-gray-950 dark:text-white uppercase tracking-wider">
          {currentLang === 'en' ? 'Website Settings' : 'إعدادات الموقع العام'}
        </h1>
        <p className="text-xs text-gray-400">
          {currentLang === 'en' ? 'Modify text content, logos, themes, and hero slide images.' : 'تعديل النصوص والشعارات والألوان الافتراضية وصور العرض في الواجهة.'}
        </p>
      </div>

      {/* Tab selectors */}
      <div className="flex border-b border-gray-250 dark:border-gray-850">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'global'
              ? 'border-red-600 text-red-650 dark:border-red-500 dark:text-red-500'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Global Settings' : 'الإعدادات العامة'}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('carousel')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'carousel'
              ? 'border-red-600 text-red-650 dark:border-red-500 dark:text-red-500'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'Homepage Carousel' : 'شرائح واجهة الموقع'}</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-xl text-sm border border-red-900/50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      
      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-green-955/20 text-green-400 rounded-xl text-sm border border-green-900/50">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab contents */}
      {activeTab === 'global' ? (
        
        // --- Tab 1: Global Settings Form ---
        <form onSubmit={handleGlobalSubmit} className="space-y-8 bg-white dark:bg-[#16181c] p-6 rounded-2xl border border-gray-250 dark:border-gray-850 transition-colors">
          
          {/* Section: Contact & Identity */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-500 border-b border-gray-150 dark:border-gray-850 pb-1.5">
              {currentLang === 'en' ? '1. Brand & Contact Information' : '١. الهوية ومعلومات الاتصال'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Co Name EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Company Name (EN)</label>
                <input
                  type="text"
                  required
                  value={companyNameEn}
                  onChange={(e) => setCompanyNameEn(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white"
                />
              </div>

              {/* Co Name AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-xs font-bold text-gray-500 uppercase">اسم الشركة (العربية)</label>
                <input
                  type="text"
                  required
                  value={companyNameAr}
                  onChange={(e) => setCompanyNameAr(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white"
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp Number (e.g. 962790000000)</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Public Store Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Address EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Store Address (EN)</label>
                <input
                  type="text"
                  required
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Address AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-xs font-bold text-gray-500 uppercase">العنوان (العربية)</label>
                <input
                  type="text"
                  required
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Instagram Link</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Facebook */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Facebook Page Link</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Default Theme */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Default Theme for visitors</label>
                <select
                  value={defaultTheme}
                  onChange={(e) => setDefaultTheme(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white cursor-pointer"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section: Landing Hero */}
          <div className="space-y-4 pt-6 border-t border-gray-250 dark:border-gray-850">
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-500 border-b border-gray-150 dark:border-gray-850 pb-1.5">
              {currentLang === 'en' ? '2. Landing Hero Text' : '٢. نصوص واجهة العرض الرئيسية'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Hero Title EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Hero Title (EN)</label>
                <input
                  type="text"
                  required
                  value={heroTitleEn}
                  onChange={(e) => setHeroTitleEn(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Hero Title AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-xs font-bold text-gray-500 uppercase">العنوان الرئيسي للواجهة (العربية)</label>
                <input
                  type="text"
                  required
                  value={heroTitleAr}
                  onChange={(e) => setHeroTitleAr(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Hero Subtitle EN */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Hero Subtitle (EN)</label>
                <input
                  type="text"
                  required
                  value={heroSubEn}
                  onChange={(e) => setHeroSubEn(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

              {/* Hero Subtitle AR */}
              <div className="flex flex-col gap-1.5 sm:col-span-2" dir="rtl">
                <label className="text-xs font-bold text-gray-500 uppercase">العنوان الفرعي للواجهة (العربية)</label>
                <input
                  type="text"
                  required
                  value={heroSubAr}
                  onChange={(e) => setHeroSubAr(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-955 dark:text-white"
                />
              </div>

            </div>
          </div>

          {/* Section: About, Mission, Vision */}
          <div className="space-y-6 pt-6 border-t border-gray-250 dark:border-gray-850">
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-500 border-b border-gray-150 dark:border-gray-850 pb-1.5">
              {currentLang === 'en' ? '3. About, Mission, & Vision Text Blocks' : '٣. نصوص "عن المحل"، "مهمتنا"، و "رؤيتنا"'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* About BLOCK */}
              <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-850 rounded-xl">
                <h3 className="text-xs font-bold text-gray-400 tracking-wide uppercase">About Us</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Title (EN)</label>
                  <input type="text" required value={aboutTitleEn} onChange={(e) => setAboutTitleEn(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white" />
                </div>
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">العنوان (AR)</label>
                  <input type="text" required value={aboutTitleAr} onChange={(e) => setAboutTitleAr(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Description (EN)</label>
                  <textarea rows="4" required value={aboutDescEn} onChange={(e) => setAboutDescEn(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs resize-none text-gray-950 dark:text-white" />
                </div>
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">الوصف (AR)</label>
                  <textarea rows="4" required value={aboutDescAr} onChange={(e) => setAboutDescAr(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs resize-none text-gray-955 dark:text-white" />
                </div>
              </div>

              {/* Mission BLOCK */}
              <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-850 rounded-xl">
                <h3 className="text-xs font-bold text-gray-400 tracking-wide uppercase">Our Mission</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Title (EN)</label>
                  <input type="text" required value={missionTitleEn} onChange={(e) => setMissionTitleEn(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white" />
                </div>
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">العنوان (AR)</label>
                  <input type="text" required value={missionTitleAr} onChange={(e) => setMissionTitleAr(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Description (EN)</label>
                  <textarea rows="4" required value={missionDescEn} onChange={(e) => setMissionDescEn(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs resize-none text-gray-955 dark:text-white" />
                </div>
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">الوصف (AR)</label>
                  <textarea rows="4" required value={missionDescAr} onChange={(e) => setMissionDescAr(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs resize-none text-gray-955 dark:text-white" />
                </div>
              </div>

              {/* Vision BLOCK */}
              <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-850 rounded-xl md:col-span-2">
                <h3 className="text-xs font-bold text-gray-400 tracking-wide uppercase">Our Vision</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Title (EN)</label>
                    <input type="text" required value={visionTitleEn} onChange={(e) => setVisionTitleEn(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5" dir="rtl">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">العنوان (AR)</label>
                    <input type="text" required value={visionTitleAr} onChange={(e) => setVisionTitleAr(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Description (EN)</label>
                    <textarea rows="3" required value={visionDescEn} onChange={(e) => setVisionDescEn(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs resize-none text-gray-955 dark:text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5" dir="rtl">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">الوصف (AR)</label>
                    <textarea rows="3" required value={visionDescAr} onChange={(e) => setVisionDescAr(e.target.value)} className="px-3 py-1.5 bg-gray-55 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs resize-none text-gray-955 dark:text-white" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4 border-t border-gray-250 dark:border-gray-850">
            <button
              type="submit"
              disabled={globalSubmitting}
              className="px-6 py-2.5 bg-red-650 hover:bg-red-750 disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white font-bold rounded-xl text-sm transition-all shadow hover:shadow-md cursor-pointer"
            >
              {globalSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>

      ) : (
        
        // --- Tab 2: Homepage Slides (Carousel) Manager ---
        <div className="space-y-6 bg-white dark:bg-[#16181c] p-6 rounded-2xl border border-gray-250 dark:border-gray-850 transition-colors">
          
          <div className="flex items-center justify-between border-b border-gray-250 dark:border-gray-850 pb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
                {currentLang === 'en' ? 'Slides Configuration' : 'إعدادات شرائح العرض'}
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {currentLang === 'en' 
                  ? 'Manage slides shown on the home page (min 1, max 3).' 
                  : 'إدارة شرائح العرض المعروضة في الصفحة الرئيسية للموقع (بحد أدنى شريحة واحدة وأقصى ٣).'}
              </p>
            </div>
            
            <button
              onClick={handleAddSlide}
              disabled={slides.length >= 3}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 rounded-lg shadow transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Add Slide' : 'إضافة شريحة'}</span>
            </button>
          </div>

          {carouselLoading ? (
            <div className="text-center py-8 text-sm text-gray-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading slides...</span>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              {currentLang === 'en' ? 'No slides configured yet.' : 'لا توجد شرائح حالياً.'}
            </div>
          ) : (
            <div className="space-y-6">
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id} 
                  className="border border-gray-200 dark:border-gray-850 rounded-xl p-4 sm:p-6 bg-gray-50/20 dark:bg-gray-900/10 flex flex-col md:flex-row gap-6 relative"
                >
                  {/* Image picker box */}
                  <div className="w-full md:w-48 aspect-video md:aspect-auto md:h-36 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 relative overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900 shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlideImageUpload(slide.id, e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {slide.imageBase64 ? (
                      <img src={slide.imageBase64} alt="Slide Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 flex flex-col items-center p-2">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">Upload Slide Image</span>
                      </div>
                    )}
                  </div>

                  {/* Input fields */}
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Title EN */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Slide Title (EN)</label>
                      <input 
                        type="text" 
                        value={slide.title.en} 
                        onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value, 'en')} 
                        className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-950 dark:text-white" 
                      />
                    </div>

                    {/* Title AR */}
                    <div className="flex flex-col gap-1" dir="rtl">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">عنوان الشريحة (AR)</label>
                      <input 
                        type="text" 
                        value={slide.title.ar} 
                        onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value, 'ar')} 
                        className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-955 dark:text-white" 
                      />
                    </div>

                    {/* Subtitle EN */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Slide Subtitle (EN)</label>
                      <input 
                        type="text" 
                        value={slide.subtitle.en} 
                        onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value, 'en')} 
                        className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-955 dark:text-white" 
                      />
                    </div>

                    {/* Subtitle AR */}
                    <div className="flex flex-col gap-1" dir="rtl">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">وصف الشريحة (AR)</label>
                      <input 
                        type="text" 
                        value={slide.subtitle.ar} 
                        onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value, 'ar')} 
                        className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-955 dark:text-white" 
                      />
                    </div>

                  </div>

                  {/* Actions / Ordering control bar */}
                  <div className="flex md:flex-col items-center justify-between border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-850 pt-4 md:pt-0 md:pl-4 shrink-0 gap-3">
                    
                    {/* Ordering arrows */}
                    <div className="flex md:flex-col gap-1">
                      <button 
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Enable toggle */}
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => handleSlideChange(slide.id, 'enabled', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-red-655 focus:ring-red-500"
                      />
                      <span>Active</span>
                    </label>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                      title="Remove slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))}

              {/* Action buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-850">
                <button
                  onClick={handleSaveCarousel}
                  disabled={carouselSubmitting}
                  className="px-6 py-2.5 bg-red-650 hover:bg-red-750 disabled:bg-gray-400 dark:disabled:bg-gray-850 text-white font-bold rounded-xl text-sm transition-all shadow hover:shadow-md cursor-pointer"
                >
                  {carouselSubmitting ? 'Saving Slides...' : 'Save Homepage Slides'}
                </button>
              </div>
            </div>
          )}

        </div>

      )}

    </div>
  );
}
