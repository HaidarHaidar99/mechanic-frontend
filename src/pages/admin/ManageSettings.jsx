import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import { compressImage } from '../../utils/imageCompression';
import { 
  Settings, Image, Plus, Trash2, Upload, AlertCircle, 
  CheckCircle2, RefreshCw, ChevronUp, ChevronDown, Save 
} from 'lucide-react';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';

export default function ManageSettings() {
  const { t, i18n } = useTranslation();
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

  // Load Carousel slides
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
        refreshSettings();
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
      titleColor: '#ffffff',
      subtitleColor: '#d4d4d8',
      focalPoint: 'center center',
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
        setSuccessMsg(currentLang === 'en' ? 'Homepage slides saved successfully' : 'تم حفظ شرائح العرض بنجاح');
      } else {
        throw new Error(res.message || 'Carousel save failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error saving slides details.');
    } finally {
      setCarouselSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            System configuration
          </span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
            {t('admin.nav.settings', currentLang === 'en' ? 'Settings' : 'الإعدادات')}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {currentLang === 'en' ? 'Configure global store profiles, slides, and default themes.' : 'تعديل الإعدادات العامة لبيانات المتجر، الشرائح، والسمة الافتراضية.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[var(--surface-elevated)] border border-[var(--border)] p-1 rounded-xl shrink-0 font-heading">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Store Profile
          </button>
          <button
            onClick={() => setActiveTab('carousel')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'carousel'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Hero Slides
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-xs font-bold border border-[var(--success)]/20">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'global' ? (
        
        // --- GLOBAL STORE PROFILE FORM ---
        <form onSubmit={handleGlobalSubmit} className="space-y-8 max-w-4xl">
          
          {/* Section: Brand details */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading">
              Brand & Contacts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Company Name (EN) *"
                id="companyNameEn"
                value={companyNameEn}
                onChange={(e) => setCompanyNameEn(e.target.value)}
                required
              />
              <Input 
                label="اسم الشركة (AR) *"
                id="companyNameAr"
                value={companyNameAr}
                onChange={(e) => setCompanyNameAr(e.target.value)}
                required
                dir="rtl"
              />
              <Input 
                label="Store Contact Phone *"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input 
                label="WhatsApp Phone (Include Country Code) *"
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                placeholder="962790000000"
              />
              <div className="sm:col-span-2">
                <Input 
                  label="Support Email Address *"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input 
                label="Address Location (EN) *"
                id="addressEn"
                value={addressEn}
                onChange={(e) => setAddressEn(e.target.value)}
                required
              />
              <Input 
                label="الموقع (AR) *"
                id="addressAr"
                value={addressAr}
                onChange={(e) => setAddressAr(e.target.value)}
                required
                dir="rtl"
              />
              <Input 
                label="Instagram Profile Link"
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
              <Input 
                label="Facebook Page Link"
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
          </div>

          {/* Section: Landing details */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading">
              Hero & Default settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Hero Title Default (EN) *"
                id="heroTitleEn"
                value={heroTitleEn}
                onChange={(e) => setHeroTitleEn(e.target.value)}
                required
              />
              <Input 
                label="عنوان البانر الرئيسي (AR) *"
                id="heroTitleAr"
                value={heroTitleAr}
                onChange={(e) => setHeroTitleAr(e.target.value)}
                required
                dir="rtl"
              />
              <div className="sm:col-span-2">
                <Input 
                  label="Hero Subtitle Default (EN) *"
                  id="heroSubEn"
                  value={heroSubEn}
                  onChange={(e) => setHeroSubEn(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input 
                  label="وصف البانر الرئيسي (AR) *"
                  id="heroSubAr"
                  value={heroSubAr}
                  onChange={(e) => setHeroSubAr(e.target.value)}
                  required
                  dir="rtl"
                />
              </div>
              <div className="sm:col-span-2">
                <Select 
                  label="Default Website UI Theme *"
                  id="defaultTheme"
                  value={defaultTheme}
                  onChange={(e) => setDefaultTheme(e.target.value)}
                  options={[
                    { value: 'dark', label: 'Luxury Dark Mode' },
                    { value: 'light', label: 'Clean Light Mode' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Section: Corporate about details */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading">
              Bilingual Corporate Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EN */}
              <div className="space-y-4 bg-[var(--surface-elevated)] border border-[var(--border)] p-5 rounded-2xl">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest font-heading">English Contents</h3>
                <Input label="About Us Section Title *" id="aboutTitleEn" value={aboutTitleEn} onChange={(e) => setAboutTitleEn(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest font-heading">About Us Description *</label>
                  <textarea rows="4" value={aboutDescEn} onChange={(e) => setAboutDescEn(e.target.value)} required className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs resize-none focus:outline-none focus:border-[var(--input-focus)] transition-all font-sans" />
                </div>
                <Input label="Mission Section Title *" id="missionTitleEn" value={missionTitleEn} onChange={(e) => setMissionTitleEn(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest font-heading">Mission Description *</label>
                  <textarea rows="3" value={missionDescEn} onChange={(e) => setMissionDescEn(e.target.value)} required className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs resize-none focus:outline-none focus:border-[var(--input-focus)] transition-all font-sans" />
                </div>
                <Input label="Vision Section Title *" id="visionTitleEn" value={visionTitleEn} onChange={(e) => setVisionTitleEn(e.target.value)} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest font-heading">Vision Description *</label>
                  <textarea rows="3" value={visionDescEn} onChange={(e) => setVisionDescEn(e.target.value)} required className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs resize-none focus:outline-none focus:border-[var(--input-focus)] transition-all font-sans" />
                </div>
              </div>

              {/* AR */}
              <div className="space-y-4 bg-[var(--surface-elevated)] border border-[var(--border)] p-5 rounded-2xl" dir="rtl">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest font-heading text-right">المحتوى باللغة العربية</h3>
                <Input label="عنوان قسم من نحن *" id="aboutTitleAr" value={aboutTitleAr} onChange={(e) => setAboutTitleAr(e.target.value)} required dir="rtl" />
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest font-heading text-right">وصف قسم من نحن *</label>
                  <textarea rows="4" value={aboutDescAr} onChange={(e) => setAboutDescAr(e.target.value)} required className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs resize-none focus:outline-none focus:border-[var(--input-focus)] transition-all text-right font-sans" />
                </div>
                <Input label="عنوان قسم رسالتنا *" id="missionTitleAr" value={missionTitleAr} onChange={(e) => setMissionTitleAr(e.target.value)} required dir="rtl" />
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest font-heading text-right">وصف قسم رسالتنا *</label>
                  <textarea rows="3" value={missionDescAr} onChange={(e) => setMissionDescAr(e.target.value)} required className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs resize-none focus:outline-none focus:border-[var(--input-focus)] transition-all text-right font-sans" />
                </div>
                <Input label="عنوان قسم رؤيتنا *" id="visionTitleAr" value={visionTitleAr} onChange={(e) => setVisionTitleAr(e.target.value)} required dir="rtl" />
                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest font-heading text-right">وصف قسم رؤيتنا *</label>
                  <textarea rows="3" value={visionDescAr} onChange={(e) => setVisionDescAr(e.target.value)} required className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs resize-none focus:outline-none focus:border-[var(--input-focus)] transition-all text-right font-sans" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={globalSubmitting}
              icon={Save}
            >
              {globalSubmitting ? 'Saving settings...' : 'Save Settings'}
            </Button>
          </div>

        </form>

      ) : (
        
        // --- HOMEPAGE SLIDES CAROUSEL EDIT VIEW ---
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 max-w-4xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h2 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-widest font-heading">
              Hero Slide Customization
            </h2>
            <Button
              onClick={handleAddSlide}
              variant="outline"
              disabled={slides.length >= 3}
              icon={Plus}
            >
              Add Slide
            </Button>
          </div>

          {carouselLoading ? (
            <div className="text-center py-16 text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
              <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent)]" />
              <span>Loading slide decks...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {slides.map((slide, idx) => (
                <div 
                  key={slide.id}
                  className="flex flex-col md:flex-row gap-5 p-5 border border-[var(--border)] rounded-2xl bg-[var(--surface-elevated)]"
                >
                  {/* Image Upload Box */}
                  <div className="w-full md:w-36 aspect-[2/1] md:aspect-square border border-dashed border-[var(--border-strong)] hover:bg-[var(--surface-hover)] rounded-xl relative flex items-center justify-center shrink-0 overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleSlideImageUpload(slide.id, e.target.files[0])} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 font-sans" 
                    />
                    {slide.imageBase64 ? (
                      <img src={slide.imageBase64} alt="Slide Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-[var(--text-secondary)] flex flex-col items-center">
                        <Upload className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Choose Image</span>
                      </div>
                    )}
                  </div>

                  {/* Texts details input */}
                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Slide Title (EN)"
                      value={slide.title.en}
                      onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value, 'en')}
                    />
                    <Input 
                      label="عنوان الشريحة (AR)"
                      value={slide.title.ar}
                      onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value, 'ar')}
                      dir="rtl"
                    />
                    <Input 
                      label="Slide Subtitle (EN)"
                      value={slide.subtitle.en}
                      onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value, 'en')}
                    />
                    <Input 
                      label="وصف الشريحة (AR)"
                      value={slide.subtitle.ar}
                      onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value, 'ar')}
                      dir="rtl"
                    />
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mt-1">
                      
                      {/* Title Color Picker */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] block font-heading">
                          {currentLang === 'en' ? 'Title Color' : 'لون العنوان'}
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: 'White', hex: '#ffffff' },
                            { name: 'Red', hex: '#ef4444' },
                            { name: 'Blue', hex: '#3b82f6' },
                            { name: 'Gold', hex: '#eab308' },
                            { name: 'Green', hex: '#22c55e' },
                            { name: 'Purple', hex: '#a855f7' },
                            { name: 'Black', hex: '#000000' }
                          ].map(c => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => handleSlideChange(slide.id, 'titleColor', c.hex)}
                              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer shadow-sm ${
                                (slide.titleColor || '#ffffff').toLowerCase() === c.hex.toLowerCase()
                                  ? 'scale-125 border-[var(--accent)] ring-2 ring-[var(--accent)]/40'
                                  : 'border-zinc-500/40 hover:scale-110'
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                          <input 
                            type="color"
                            value={slide.titleColor || '#ffffff'}
                            onChange={(e) => handleSlideChange(slide.id, 'titleColor', e.target.value)}
                            className="w-6 h-6 p-0 border border-[var(--border)] rounded-md cursor-pointer bg-transparent shrink-0"
                            title="Custom Color"
                          />
                        </div>
                      </div>

                      {/* Subtitle Color Picker */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)] block font-heading">
                          {currentLang === 'en' ? 'Subtitle Color' : 'لون الوصف'}
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: 'Light Grey', hex: '#d4d4d8' },
                            { name: 'White', hex: '#ffffff' },
                            { name: 'Red', hex: '#ef4444' },
                            { name: 'Blue', hex: '#3b82f6' },
                            { name: 'Gold', hex: '#eab308' },
                            { name: 'Green', hex: '#22c55e' },
                            { name: 'Black', hex: '#000000' }
                          ].map(c => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => handleSlideChange(slide.id, 'subtitleColor', c.hex)}
                              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer shadow-sm ${
                                (slide.subtitleColor || '#d4d4d8').toLowerCase() === c.hex.toLowerCase()
                                  ? 'scale-125 border-[var(--accent)] ring-2 ring-[var(--accent)]/40'
                                  : 'border-zinc-500/40 hover:scale-110'
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                          <input 
                            type="color"
                            value={slide.subtitleColor || '#d4d4d8'}
                            onChange={(e) => handleSlideChange(slide.id, 'subtitleColor', e.target.value)}
                            className="w-6 h-6 p-0 border border-[var(--border)] rounded-md cursor-pointer bg-transparent shrink-0"
                            title="Custom Color"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="sm:col-span-2">
                      <Select
                        label="Image Focus / Crop Position (Mobile & Desktop)"
                        value={slide.focalPoint || 'center center'}
                        onChange={(e) => handleSlideChange(slide.id, 'focalPoint', e.target.value)}
                        options={[
                          { value: 'center center', label: 'Center (Default)' },
                          { value: 'top center', label: 'Top Center' },
                          { value: 'bottom center', label: 'Bottom Center' },
                          { value: 'center left', label: 'Center Left' },
                          { value: 'center right', label: 'Center Right' }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Controls / arrow selectors */}
                  <div className="flex md:flex-col items-center justify-between border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-4 shrink-0 gap-4">
                    
                    <div className="flex md:flex-col gap-1">
                      <button 
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-30 rounded-lg cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1 hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-30 rounded-lg cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => handleSlideChange(slide.id, 'enabled', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]/10 cursor-pointer bg-[var(--surface-elevated)]"
                      />
                      <span>Active</span>
                    </label>

                    <IconButton
                      icon={Trash2}
                      variant="ghost"
                      className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
                      onClick={() => handleRemoveSlide(slide.id)}
                      title="Remove slide"
                    />

                  </div>

                </div>
              ))}

              <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                <Button
                  onClick={handleSaveCarousel}
                  disabled={carouselSubmitting}
                  variant="primary"
                  icon={Save}
                >
                  {carouselSubmitting ? 'Saving Slides...' : 'Save Homepage Slides'}
                </Button>
              </div>
            </div>
          )}

        </div>

      )}

    </div>
  );
}
