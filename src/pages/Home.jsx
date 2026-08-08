import React, { useState, useEffect, useRef } from 'react';
import { useNavigate as useNavigateDom, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { getActiveProducts } from '../services/products.api';
import { apiRequest } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { ChevronLeft, ChevronRight, MessageSquare, Phone, Mail, MapPin, Wrench, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

let cachedCarousel = null;
let cachedCarouselTime = null;
const CAROUSEL_CACHE_DURATION = 120000; // 2 minutes

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigateDom();
  const { settings, loading: settingsLoading } = useSettings();
  
  const currentLang = i18n.language || 'en';

  const [slides, setSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const autoPlayRef = useRef(null);

  // Fetch Carousel slides
  useEffect(() => {
    const fetchSlides = async () => {
      if (cachedCarousel && (Date.now() - cachedCarouselTime < CAROUSEL_CACHE_DURATION)) {
        setSlides(cachedCarousel.slides.filter(s => s.enabled));
        return;
      }
      try {
        const res = await apiRequest('/settings/carousel');
        if (res.success && res.data) {
          const enabledSlides = res.data.slides.filter(s => s.enabled);
          cachedCarousel = res.data;
          cachedCarouselTime = Date.now();
          setSlides(enabledSlides);
        }
      } catch (err) {
        console.error('Error fetching carousel slides:', err);
      }
    };
    fetchSlides();
  }, []);

  // Fetch Featured Products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setProductsLoading(true);
        const data = await getActiveProducts();
        const featured = data.filter(p => p.featured && p.isActive);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Auto-play Carousel Effect (Local Rotation index in memory)
  useEffect(() => {
    if (slides.length <= 1) return;
    
    autoPlayRef.current = setInterval(() => {
      setActiveSlide(current => (current + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides]);

  const handleNextSlide = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setActiveSlide(current => (current + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setActiveSlide(current => (current === 0 ? slides.length - 1 : current - 1));
  };

  const handleDotClick = (index) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setActiveSlide(index);
  };

  if (settingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Wrench className="w-12 h-12 text-red-600 dark:text-red-500 animate-spin" />
        <span className="text-zinc-550 dark:text-zinc-400 text-sm font-semibold tracking-wider uppercase animate-pulse">Loading experience...</span>
      </div>
    );
  }

  // Localized values
  const heroTitle = settings ? settings.heroTitle[currentLang] : '';
  const heroSubtitle = settings ? settings.heroSubtitle[currentLang] : '';
  const aboutTitle = settings ? settings.aboutTitle[currentLang] : '';
  const aboutDescription = settings ? settings.aboutDescription[currentLang] : '';
  
  // Default slide image fallback or build array of active slides
  const activeSlides = slides.length > 0 ? slides : [
    {
      id: 'default',
      imageBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" fill="%23000000"><rect width="1200" height="600" fill="%230a0a0c"/><path d="M0,0 L1200,600" stroke="%231a1a1e" stroke-width="6"/><path d="M1200,0 L0,600" stroke="%231a1a1e" stroke-width="6"/></svg>',
      title: { en: heroTitle, ar: heroTitle },
      subtitle: { en: heroSubtitle, ar: heroSubtitle }
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. Hero / Carousel Section (100dvh height with premium fade overlay) */}
      <section className="relative h-[100dvh] w-full overflow-hidden bg-black select-none z-0">
        
        {/* Stacked Images for Fade transitions */}
        {activeSlides.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-in-out ${
              idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={slide.imageBase64} 
              alt={slide.title[currentLang] || 'Hero Slide'} 
              className="w-full h-full object-cover brightness-[0.4] transition-transform duration-[8000ms] ease-linear"
            />
            {/* Smooth Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
          </div>
        ))}

        {/* Hero Text content container */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto h-full">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-red-500 uppercase animate-fade-in mb-3">
            {currentLang === 'en' ? 'Performance Engineered' : 'هندسة الأداء المتميز'}
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] uppercase drop-shadow-lg font-heading max-w-4xl">
            {activeSlides[activeSlide]?.title[currentLang] || activeSlides[activeSlide]?.title['en']}
          </h1>
          <p className="mt-6 text-sm sm:text-lg text-zinc-300 max-w-2xl leading-relaxed font-sans drop-shadow-md">
            {activeSlides[activeSlide]?.subtitle[currentLang] || activeSlides[activeSlide]?.subtitle['en']}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-650/20 hover:shadow-red-650/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto"
            >
              {t('home.explore')}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 font-bold text-xs uppercase tracking-widest rounded-xl backdrop-blur transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full sm:w-auto"
            >
              {currentLang === 'en' ? 'Who We Are' : 'من نحن'}
            </button>
          </div>
        </div>

        {/* Carousel Navigation Elements */}
        {activeSlides.length > 1 && (
          <>
            {/* Arrows */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-xl bg-black/40 hover:bg-red-600 text-white backdrop-blur border border-white/10 transition-all duration-300 scale-90 hover:scale-100 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-xl bg-black/40 hover:bg-red-600 text-white backdrop-blur border border-white/10 transition-all duration-300 scale-90 hover:scale-100 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>

            {/* Slider Dots indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5 rtl:space-x-reverse">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === activeSlide ? 'w-8 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Outer wrapper to restrict width of non-hero items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* 2. Featured Products Section */}
        <section className="space-y-8 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-zinc-900 pb-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">
                {currentLang === 'en' ? 'Our Catalog' : 'كتالوج المنتجات'}
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight mt-1 font-heading">
                {t('home.featured')}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-450 mt-1 max-w-xl">
                {currentLang === 'en' 
                  ? 'Check out our hand-picked top recommended products for your vehicle.' 
                  : 'اطلع على أفضل المنتجات الموصى بها لسيارتك من قبل خبرائنا.'}
              </p>
            </div>
            <LinkDom 
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-widest shrink-0"
            >
              <span>{t('home.view_all')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </LinkDom>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-[#121215] border border-gray-200 dark:border-zinc-900 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="aspect-square bg-gray-250 dark:bg-zinc-800 rounded-xl w-full" />
                  <div className="h-4 bg-gray-250 dark:bg-zinc-800 rounded w-2/3" />
                  <div className="h-3 bg-gray-250 dark:bg-zinc-800 rounded w-1/2" />
                  <div className="h-10 bg-gray-250 dark:bg-zinc-800 rounded-xl w-full pt-4" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-250 dark:border-zinc-900 rounded-2xl bg-white dark:bg-[#121215]/20">
              <Wrench className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-450 text-sm font-semibold">{t('products.no_products')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product} 
                  onOpenDetails={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. About Us & Mission/Vision Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* About Card */}
          <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-zinc-900 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-md transition-colors">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">
                {t('home.about_preview_title')}
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white font-heading">
                {aboutTitle}
              </h2>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed whitespace-pre-line line-clamp-6">
                {aboutDescription}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <LinkDom 
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-red-600 hover:border-red-650 hover:text-white dark:hover:bg-red-600 dark:hover:border-red-600 dark:hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <span>{currentLang === 'en' ? 'Learn More About Us' : 'اقرأ المزيد عنا'}</span>
              </LinkDom>
            </div>
          </div>

          {/* Mission & Vision Card */}
          <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-md relative overflow-hidden">
            {/* Branding Wrench Watermark */}
            <Wrench className="absolute -right-20 -bottom-20 w-72 h-72 text-zinc-900/50 opacity-40 shrink-0 pointer-events-none" />
            
            <div className="space-y-8 z-10">
              {settings && (
                <>
                  {/* Mission */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-white font-extrabold uppercase tracking-widest text-xs font-heading">
                        {settings.missionTitle[currentLang]}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-7 rtl:pl-0 rtl:pr-7">
                      {settings.missionDescription[currentLang]}
                    </p>
                  </div>
                  
                  {/* Vision */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-white font-extrabold uppercase tracking-widest text-xs font-heading">
                        {settings.visionTitle[currentLang]}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-7 rtl:pl-0 rtl:pr-7">
                      {settings.visionDescription[currentLang]}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

        </section>

        {/* 4. Contact / WhatsApp CTA preview */}
        <section className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Accent light shine */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-3xl" />
          
          <div className="space-y-4 max-w-xl text-center lg:text-left rtl:lg:text-right z-10">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase font-heading">
              {t('home.contact_cta')}
            </h2>
            <p className="text-red-100 text-xs sm:text-sm font-semibold max-w-lg">
              {t('home.whatsapp_help')}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-5 text-[10px] font-bold uppercase tracking-wider text-red-200 pt-3 border-t border-red-500/50">
              {settings && settings.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings && settings.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{settings.email}</span>
                </div>
              )}
              {settings && settings.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{settings.address[currentLang]}</span>
                </div>
              )}
            </div>
          </div>
          
          {settings && settings.whatsapp && (
            <div className="flex-shrink-0 z-10 w-full lg:w-auto">
              <a 
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4.5 bg-white hover:bg-zinc-50 text-red-650 font-bold rounded-xl shadow-lg transition-all hover:scale-103 text-xs uppercase tracking-widest cursor-pointer"
              >
                <MessageSquare className="w-4.5 h-4.5 text-green-500 fill-green-500" />
                <span>{currentLang === 'en' ? 'Open WhatsApp Chat' : 'افتح محادثة واتساب'}</span>
              </a>
            </div>
          )}
        </section>

      </div>

      {/* Product Detail Modal overlay */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
}
