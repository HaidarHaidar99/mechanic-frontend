import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { getActiveProducts } from '../services/products.api';
import { apiRequest } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { ChevronLeft, ChevronRight, MessageSquare, Phone, Mail, MapPin, Wrench, ArrowRight } from 'lucide-react';

let cachedCarousel = null;
let cachedCarouselTime = null;
const CAROUSEL_CACHE_DURATION = 120000; // 2 minutes

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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

  // Auto-play Carousel Effect
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
        <span className="text-gray-500 dark:text-gray-400 text-sm">Loading store...</span>
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
      // Place a placeholder SVG in imageBase64 or fallback
      imageBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" fill="%231a1a1a"><rect width="1200" height="600" fill="%2316171d"/><path d="M400,200 L800,400" stroke="%23333333" stroke-width="10"/></svg>',
      title: { en: heroTitle, ar: heroTitle },
      subtitle: { en: heroSubtitle, ar: heroSubtitle }
    }
  ];

  const currentSlide = activeSlides[activeSlide] || activeSlides[0];

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero / Carousel Section */}
      <section className="relative h-[65vh] min-h-[400px] w-full rounded-2xl overflow-hidden shadow-lg bg-gray-900">
        
        {/* Slide Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={currentSlide.imageBase64} 
            alt={currentSlide.title[currentLang] || 'Hero Image'} 
            className="w-full h-full object-cover transition-all duration-700 brightness-50"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
            {currentSlide.title[currentLang] || currentSlide.title['en']}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-gray-200 max-w-2xl drop-shadow">
            {currentSlide.subtitle[currentLang] || currentSlide.subtitle['en']}
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-red-650 hover:bg-red-750 active:bg-red-800 transition-all shadow-lg hover:shadow-xl hover:scale-103 cursor-pointer"
            >
              <span>{t('home.explore')}</span>
              <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2 rtl:space-x-reverse">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-6 bg-red-600' : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Featured Products Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              {t('home.featured')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentLang === 'en' 
                ? 'Check out our hand-picked top recommended products for your vehicle.' 
                : 'اطلع على أفضل المنتجات الموصى بها لسيارتك من قبل خبرائنا.'}
            </p>
          </div>
          <Link 
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-red-650 hover:text-red-750 dark:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <span>{t('home.view_all')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-[#1f2028] border border-gray-150 dark:border-gray-800 rounded-xl p-4 space-y-4">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/30">
            <Wrench className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('products.no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        {/* About Preview Card */}
        <div className="bg-white dark:bg-[#1f2028] border border-gray-150 dark:border-gray-800 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-red-650 dark:text-red-500 uppercase tracking-widest block">
              {t('home.about_preview_title')}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {aboutTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line line-clamp-5">
              {aboutDescription}
            </p>
          </div>
          <div className="mt-6">
            <Link 
              to="/about"
              className="inline-flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white text-sm font-semibold rounded-xl transition-all"
            >
              <span>{currentLang === 'en' ? 'Learn More About Us' : 'اقرأ المزيد عنا'}</span>
            </Link>
          </div>
        </div>

        {/* Mission & Vision Card */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Subtle watermark wrench */}
          <Wrench className="absolute -right-16 -bottom-16 w-64 h-64 text-gray-850 opacity-10" />
          
          <div className="space-y-6 z-10">
            {settings && (
              <>
                {/* Mission */}
                <div className="space-y-2">
                  <h3 className="text-red-500 font-bold uppercase tracking-wider text-xs">
                    {settings.missionTitle[currentLang]}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {settings.missionDescription[currentLang]}
                  </p>
                </div>
                {/* Vision */}
                <div className="space-y-2">
                  <h3 className="text-red-500 font-bold uppercase tracking-wider text-xs">
                    {settings.visionTitle[currentLang]}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {settings.visionDescription[currentLang]}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

      </section>

      {/* 4. Contact / WhatsApp CTA preview */}
      <section className="bg-red-600 dark:bg-red-700 text-white rounded-2xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center lg:text-left rtl:lg:text-right">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t('home.contact_cta')}
          </h2>
          <p className="text-red-100 text-base">
            {t('home.whatsapp_help')}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-red-150 pt-2">
            {settings && settings.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{settings.phone}</span>
              </div>
            )}
            {settings && settings.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{settings.email}</span>
              </div>
            )}
            {settings && settings.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{settings.address[currentLang]}</span>
              </div>
            )}
          </div>
        </div>
        
        {settings && settings.whatsapp && (
          <div className="flex-shrink-0">
            <a 
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-100 text-red-650 hover:text-red-750 font-bold rounded-xl shadow-lg transition-all hover:scale-103 text-base cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 mr-2 rtl:ml-2 rtl:mr-0 text-green-550 fill-green-550" />
              <span>{currentLang === 'en' ? 'Open WhatsApp Chat' : 'افتح محادثة واتساب'}</span>
            </a>
          </div>
        )}
      </section>

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
