import React, { useState, useEffect, useRef } from 'react';
import { useNavigate as useNavigateDom, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { getActiveProducts } from '../services/products.api';
import { apiRequest } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { MessageSquare, Phone, Mail, MapPin, Wrench, ArrowRight, ShieldCheck, Cpu, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import Button from '../components/common/Button';
import Container from '../components/common/Container';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';
import { useScrollReveal } from '../hooks/useScrollReveal';

let cachedCarousel = null;
let cachedCarouselTime = null;
const CAROUSEL_CACHE_DURATION = 120000; // 2 minutes

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigateDom();
  const { settings, loading: settingsLoading } = useSettings();
  
  const currentLang = i18n.language || 'en';

  const [slides, setSlides] = useState(cachedCarousel ? cachedCarousel.slides.filter(s => s.enabled) : []);
  const [slidesLoading, setSlidesLoading] = useState(!cachedCarousel);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const featuredRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  const autoPlayRef = useRef(null);
  const productScrollRef = useRef(null);

  // Fetch Carousel slides
  useEffect(() => {
    const fetchSlides = async () => {
      if (cachedCarousel && (Date.now() - cachedCarouselTime < CAROUSEL_CACHE_DURATION)) {
        setSlides(cachedCarousel.slides.filter(s => s.enabled));
        setSlidesLoading(false);
        return;
      }
      try {
        setSlidesLoading(true);
        const res = await apiRequest('/settings/carousel');
        if (res.success && res.data) {
          const enabledSlides = res.data.slides.filter(s => s.enabled);
          cachedCarousel = res.data;
          cachedCarouselTime = Date.now();
          setSlides(enabledSlides);
        }
      } catch (err) {
        console.error('Error fetching carousel slides:', err);
      } finally {
        setSlidesLoading(false);
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

  // Auto-play Carousel (Local index modifier)
  useEffect(() => {
    if (slides.length <= 1) return;
    
    autoPlayRef.current = setInterval(() => {
      setActiveSlide(current => (current + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides]);

  const handleDotClick = (index) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setActiveSlide(index);
  };

  if (settingsLoading || slidesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Wrench className="w-12 h-12 text-[var(--accent)] animate-spin" />
        <span className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-widest animate-pulse font-heading">Loading experience...</span>
      </div>
    );
  }

  const heroTitle = settings ? settings.heroTitle[currentLang] : '';
  const heroSubtitle = settings ? settings.heroSubtitle[currentLang] : '';
  const aboutTitle = settings ? settings.aboutTitle[currentLang] : '';
  const aboutDescription = settings ? settings.aboutDescription[currentLang] : '';
  
  const activeSlides = slides.length > 0 ? slides : [
    {
      id: 'default',
      imageBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" fill="%23000000"><rect width="1200" height="600" fill="%230a0a0c"/><path d="M0,0 L1200,600" stroke="%231a1a1e" stroke-width="6"/><path d="M1200,0 L0,600" stroke="%231a1a1e" stroke-width="6"/></svg>',
      title: { en: heroTitle, ar: heroTitle },
      subtitle: { en: heroSubtitle, ar: heroSubtitle },
      titleColor: '#ffffff',
      subtitleColor: '#d4d4d8',
      focalPoint: 'center center'
    }
  ];

  return (
    <div className="space-y-24 pb-20 max-w-full overflow-hidden">
      
      {/* 1. Hero / Carousel Section (Stable cover layout, avoids mobile resize jitter) */}
      <section className="relative min-h-[520px] h-[82vh] md:h-[88vh] w-full overflow-hidden bg-black select-none z-0">
        
        {/* Stacked Images */}
        {activeSlides.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-[1000ms] ease-in-out ${
              idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
            }`}
          >
            <img 
              src={slide.imageBase64} 
              alt={slide.title[currentLang] || 'Hero Slide'} 
              className="w-full h-full object-cover brightness-[0.35]"
              style={{ objectPosition: slide.focalPoint || 'center center' }}
            />
            {/* Dark Vignette Overlay to ensure text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
          </div>
        ))}

        {/* Hero Text content (Admin configured custom text colors) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto h-full space-y-4 pt-12 sm:pt-0">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-red-500 uppercase animate-fade-in">
            {currentLang === 'en' ? 'Performance Engineered' : 'هندسة الأداء المتميز'}
          </span>
          <h1 
            className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] uppercase drop-shadow-xl font-heading max-w-4xl transition-colors duration-500"
            style={{ color: activeSlides[activeSlide]?.titleColor || '#ffffff' }}
          >
            {activeSlides[activeSlide]?.title[currentLang] || activeSlides[activeSlide]?.title['en']}
          </h1>
          <p 
            className="text-xs sm:text-base max-w-2xl leading-relaxed font-sans drop-shadow-md pb-4 line-clamp-3 sm:line-clamp-none transition-colors duration-500"
            style={{ color: activeSlides[activeSlide]?.subtitleColor || '#d4d4d8' }}
          >
            {activeSlides[activeSlide]?.subtitle[currentLang] || activeSlides[activeSlide]?.subtitle['en']}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-center w-full max-w-xs sm:max-w-none sm:w-auto">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/20 cursor-pointer w-full sm:w-auto font-heading"
            >
              {t('home.explore')}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 font-black text-xs uppercase tracking-widest rounded-xl backdrop-blur-md transition-all cursor-pointer w-full sm:w-auto font-heading"
            >
              {currentLang === 'en' ? 'Who We Are' : 'من نحن'}
            </button>
          </div>
        </div>

        {/* Subtle Slider Dots (only if more than 1 slide) */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5 rtl:space-x-reverse">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlide ? 'w-8 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Content wrapper */}
      <Container className="space-y-28">
        
        {/* 2. Featured Products Section */}
        <section ref={featuredRef} className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[var(--accent)] uppercase font-heading">
                {currentLang === 'en' ? 'Our Catalog' : 'كتالوج المنتجات'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
                {t('home.featured')}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                {currentLang === 'en' 
                  ? 'Check out our hand-picked top recommended products for your vehicle.' 
                  : 'اطلع على أفضل المنتجات الموصى بها لسيارتك من قبل خبرائنا.'}
              </p>
            </div>
            
            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => productScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button 
                onClick={() => productScrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] transition-all cursor-pointer shadow-sm active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex gap-6 overflow-x-hidden pb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[280px] sm:w-[320px] shrink-0 animate-pulse bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 space-y-4 shadow-sm">
                  <Skeleton variant="rect" className="aspect-square w-full" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rect" height="40px" className="w-full mt-4" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <EmptyState 
              icon={Wrench} 
              title={t('products.no_products')} 
              description={currentLang === 'en' ? 'No featured products are available at the moment.' : 'لا تتوفر منتجات مميزة في الوقت الحالي.'}
            />
          ) : (
            <div className="space-y-8">
              {/* Right Horizontal Scroll Container */}
              <div 
                ref={productScrollRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[var(--border-strong)]"
              >
                {/* 6 Products Max */}
                {featuredProducts.slice(0, 6).map(product => (
                  <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                    <ProductCard 
                      product={product} 
                      onOpenDetails={setSelectedProduct}
                    />
                  </div>
                ))}

                {/* View All Products End Card */}
                <div className="w-[240px] sm:w-[280px] shrink-0 snap-start flex">
                  <LinkDom 
                    to="/products"
                    className="w-full bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl my-auto h-full min-h-[360px]"
                  >
                    <div className="p-4 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] group-hover:scale-115 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300 shadow-sm">
                      <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] font-heading block group-hover:text-[var(--accent)] transition-colors">
                        {t('home.view_all')}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-semibold block">
                        {currentLang === 'en' ? 'Explore full collection' : 'استكشف التشكيلة الكاملة'}
                      </span>
                    </div>
                  </LinkDom>
                </div>
              </div>

              {/* View All Products Button Below the Products */}
              <div className="flex justify-center pt-2">
                <LinkDom 
                  to="/products"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer font-heading group active:scale-95"
                >
                  <Package className="w-4 h-4 text-[var(--accent)]" />
                  <span>{t('home.view_all')}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                </LinkDom>
              </div>
            </div>
          )}
        </section>

        {/* 3. About Us Preview */}
        <section ref={aboutRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
                {t('home.about_preview_title')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-heading uppercase">
                {aboutTitle}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line line-clamp-6 font-sans">
                {aboutDescription}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <LinkDom 
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all font-heading"
              >
                {currentLang === 'en' ? 'Learn More About Us' : 'اقرأ المزيد عنا'}
              </LinkDom>
            </div>
          </div>

          {/* Right card (Luxury dark badge) */}
          <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-md relative overflow-hidden">
            <Wrench className="absolute -right-20 -bottom-20 w-72 h-72 text-zinc-900 opacity-30 shrink-0 pointer-events-none" />
            
            <div className="space-y-8 z-10">
              {settings && (
                <>
                  {/* Mission */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-white font-black uppercase tracking-widest text-[11px] font-heading">
                        {settings.missionTitle[currentLang]}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-8 rtl:pl-0 rtl:pr-8">
                      {settings.missionDescription[currentLang]}
                    </p>
                  </div>
                  
                  {/* Vision */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-white font-black uppercase tracking-widest text-[11px] font-heading">
                        {settings.visionTitle[currentLang]}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed pl-8 rtl:pl-0 rtl:pr-8">
                      {settings.visionDescription[currentLang]}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

        </section>

        {/* 4. Contact / WhatsApp CTA */}
        <section ref={ctaRef} className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden border border-red-500/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-3xl" />
          
          <div className="space-y-4 max-w-xl text-center lg:text-left rtl:lg:text-right z-10">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase font-heading leading-tight">
              {t('home.contact_cta')}
            </h2>
            <p className="text-red-100 text-xs sm:text-sm font-semibold max-w-lg">
              {t('home.whatsapp_help')}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-5 text-[10px] font-bold uppercase tracking-wider text-red-200 pt-3 border-t border-red-500/30">
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
                className="inline-flex items-center justify-center gap-2 w-full lg:w-auto px-8 py-4.5 bg-white hover:bg-zinc-50 active:scale-98 text-rose-700 font-black rounded-xl shadow-lg text-xs uppercase tracking-widest transition-all cursor-pointer font-heading"
              >
                <MessageSquare className="w-4.5 h-4.5 text-green-500 fill-green-500 shrink-0" />
                <span>{currentLang === 'en' ? 'Open WhatsApp Chat' : 'افتح محادثة واتساب'}</span>
              </a>
            </div>
          )}
        </section>

      </Container>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
}
