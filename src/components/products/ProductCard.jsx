import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Heart, ShoppingCart, Eye, Check, ShoppingBag } from 'lucide-react';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import Badge from '../common/Badge';

export default function ProductCard({ product, onOpenDetails }) {
  const { t, i18n } = useTranslation();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings } = useSettings();
  
  const currentLang = i18n.language || 'en';

  const name = product.name[currentLang] || product.name['en'] || '';
  const description = product.description[currentLang] || product.description['en'] || '';
  const category = product.category[currentLang] || product.category['en'] || '';
  const price = product.price;

  const isAdded = cartItems.some(item => item.id === product.id);
  const favorited = isFavorite(product.id);

  const [popHeart, setPopHeart] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setPopHeart(true);
    toggleFavorite(product.id);
    setTimeout(() => setPopHeart(false), 300);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAdded) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
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

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="group bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-3xl overflow-hidden border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-300 flex flex-col h-full cursor-pointer relative shadow-sm hover:shadow-md"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full bg-[var(--page-bg)] overflow-hidden shrink-0 border-b border-[var(--border)]">
        <img 
          src={product.imageBase64} 
          alt={name} 
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Top Left Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
            <Badge variant="primary" icon={SparklesIcon}>
              {currentLang === 'en' ? 'Featured' : 'مميز'}
            </Badge>
          </div>
        )}

        {/* Top Right Heart Favorite Action */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full border shadow-sm transition-all cursor-pointer ${
              favorited 
                ? 'bg-rose-500 border-rose-500 text-white' 
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-rose-500'
            } ${popHeart ? 'scale-115' : ''}`}
            title={t('nav.favorites')}
          >
            <Heart className={`w-4.5 h-4.5 transition-all ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick View Details Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--surface)] text-[var(--text-primary)] rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4 text-[var(--accent)]" />
            <span>{t('products.details')}</span>
          </span>
        </div>
      </div>

      {/* Info Blocks */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-5">
        <div className="space-y-2">
          {/* Category */}
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            {category}
          </span>

          {/* Title */}
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors font-heading uppercase">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom Details & Buttons */}
        <div className="pt-4 border-t border-[var(--border)] space-y-3 mt-auto">
          {/* Price */}
          <div className="text-base font-extrabold text-[var(--text-primary)] font-heading">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Action buttons (Add to cart & Buy now) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer font-heading active:scale-95 ${
                isAdded
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 font-bold'
                  : 'bg-[var(--surface-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
              }`}
              title={isAdded ? (currentLang === 'en' ? 'Click to remove from cart' : 'انقر للإزالة من السلة') : t('products.add_to_cart')}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>{currentLang === 'en' ? 'In Cart' : 'في السلة'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t('products.add_to_cart')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all cursor-pointer font-heading shadow-sm"
              title={currentLang === 'en' ? 'Buy Now via WhatsApp' : 'شراء الآن عبر واتساب'}
            >
              <ShoppingBag className="w-3.5 h-3.5 fill-current/20 text-emerald-100" />
              <span>{currentLang === 'en' ? 'Buy Now' : 'شراء الآن'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon for Featured Badge
function SparklesIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-3 h-3 text-current"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}
