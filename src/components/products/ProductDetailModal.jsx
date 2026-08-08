import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { X, Heart, ShoppingCart, Check } from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  const { t, i18n } = useTranslation();
  const { cartItems, addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentLang = i18n.language || 'en';
  const [popHeart, setPopHeart] = useState(false);

  useEffect(() => {
    // Disable body scroll when modal is open
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white dark:bg-[#121215] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-200/60 dark:border-zinc-900/60 max-h-[85vh] flex flex-col md:flex-row animate-scale-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2.5 bg-black/40 hover:bg-black/60 md:bg-zinc-100 md:hover:bg-zinc-200 md:dark:bg-zinc-900 md:dark:hover:bg-zinc-800 text-white md:text-zinc-700 md:dark:text-zinc-300 rounded-full transition-all cursor-pointer"
          aria-label={t('product_modal.close')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-zinc-50 dark:bg-zinc-950 relative border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-900/40 shrink-0">
          <img 
            src={product.imageBase64} 
            alt={name} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
          
          <div className="space-y-4">
            {/* Category */}
            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block font-heading">
              {category}
            </span>

            {/* Name */}
            <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 dark:text-white leading-tight font-heading">
              {name}
            </h2>

            {/* Price */}
            <div className="text-lg md:text-xl font-extrabold text-zinc-950 dark:text-white font-heading">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {/* Description */}
            <div className="text-xs leading-relaxed text-zinc-550 dark:text-zinc-400 max-h-48 overflow-y-auto pr-1">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-900/60 pt-6 flex items-center gap-3">
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                isAdded
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-650 cursor-not-allowed border border-transparent'
                  : 'bg-red-650 hover:bg-red-755 text-white hover:-translate-y-0.5 active:translate-y-0 shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Added to Cart' : 'تمت الإضافة للسلة'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('products.add_to_cart')}</span>
                </>
              )}
            </button>

            {/* Favorites Toggle */}
            <button
              onClick={handleFavoriteClick}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                favorited 
                  ? 'border-red-500/20 text-red-550 bg-red-500/5 hover:bg-red-500/10' 
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              } ${popHeart ? 'scale-125' : ''}`}
              title={t('nav.favorites')}
            >
              <Heart className={`w-4.5 h-4.5 transition-all ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
