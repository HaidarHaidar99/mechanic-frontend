import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSettings } from '../../contexts/SettingsContext';
import { X, Heart, ShoppingCart, Check, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import Badge from '../common/Badge';

export default function ProductDetailModal({ product, onClose }) {
  const { t, i18n } = useTranslation();
  const { cartItems, addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings } = useSettings();

  const currentLang = i18n.language || 'en';
  const [popHeart, setPopHeart] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const name = product.name[currentLang] || product.name['en'] || '';
  const description = product.description[currentLang] || product.description['en'] || '';
  const category = product.category[currentLang] || product.category['en'] || '';
  const price = product.price;

  const isAdded = cartItems.some(item => item.id === product.id);
  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    if (isAdded) return;
    addToCart(product);
  };

  const handleBuyNow = () => {
    const whatsappNum = settings?.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '';
    const message = currentLang === 'ar'
      ? `مرحباً! أود شراء المنتج التالي:\n*${name}*\nالسعر: $${price.toFixed(2)}`
      : `Hello! I would like to buy this product:\n*${name}*\nPrice: $${price.toFixed(2)}`;
    
    if (whatsappNum) {
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert(currentLang === 'ar' ? 'رقم الواتساب غير متوفر حالياً' : 'WhatsApp contact number is not set.');
    }
  };

  const handleFavoriteClick = () => {
    setPopHeart(true);
    toggleFavorite(product.id);
    setTimeout(() => setPopHeart(false), 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="bg-[var(--surface)] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative border border-[var(--border)] max-h-[88vh] flex flex-col md:flex-row my-auto animate-scale-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 bg-black/50 hover:bg-black/70 md:bg-[var(--surface-elevated)] md:hover:bg-[var(--surface-hover)] text-white md:text-[var(--text-primary)] rounded-full transition-all cursor-pointer border border-white/20 md:border-[var(--border)] shadow-md"
          aria-label={t('product_modal.close')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-square max-h-[35vh] md:max-h-none md:aspect-auto bg-[var(--page-bg)] relative border-b md:border-b-0 md:border-r border-[var(--border)] shrink-0">
          <img 
            src={product.imageBase64} 
            alt={name} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
          
          <div className="space-y-4">
            {/* Category */}
            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
              {category}
            </span>

            {/* Name */}
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] leading-tight font-heading uppercase">
              {name}
            </h2>

            {/* Price */}
            <div className="text-lg md:text-xl font-extrabold text-[var(--text-primary)] font-heading">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {/* Description */}
            <div className="text-xs leading-relaxed text-[var(--text-secondary)] max-h-48 overflow-y-auto pr-1">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="mt-8 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full sm:w-auto flex-grow flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer font-heading ${
                isAdded
                  ? 'bg-[var(--success)]/10 border-[var(--success)]/20 text-[var(--success)] cursor-not-allowed opacity-100'
                  : 'bg-[var(--surface-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:scale-98'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3px]" />
                  <span>{currentLang === 'en' ? 'Added' : 'تمت'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('products.add_to_cart')}</span>
                </>
              )}
            </button>

            {/* Buy Now (WhatsApp Direct) */}
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all cursor-pointer font-heading shadow-md shrink-0"
              title={currentLang === 'en' ? 'Buy Now via WhatsApp' : 'شراء الآن عبر واتساب'}
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span>{currentLang === 'en' ? 'Buy Now' : 'شراء الآن'}</span>
            </button>

            {/* Favorites Toggle */}
            <button
              onClick={handleFavoriteClick}
              className={`p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                favorited 
                  ? 'bg-rose-500 border-rose-500 text-white' 
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              } ${popHeart ? 'scale-115' : ''}`}
              title={t('nav.favorites')}
            >
              <Heart className={`w-4.5 h-4.5 transition-all ${favorited ? 'fill-current' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
