import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';

export default function ProductCard({ product, onOpenDetails }) {
  const { t, i18n } = useTranslation();
  const { cartItems, addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const currentLang = i18n.language || 'en';

  const name = product.name[currentLang] || product.name['en'] || '';
  const description = product.description[currentLang] || product.description['en'] || '';
  const category = product.category[currentLang] || product.category['en'] || '';
  const price = product.price;

  const isAdded = cartItems.some(item => item.id === product.id);
  const favorited = isFavorite(product.id);

  // Favorite pop animation state
  const [popHeart, setPopHeart] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setPopHeart(true);
    toggleFavorite(product.id);
    setTimeout(() => setPopHeart(false), 300);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAdded) return;
    addToCart(product);
  };

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="group bg-white dark:bg-[#121215] rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-900/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full cursor-pointer relative"
    >
      
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden shrink-0 border-b border-zinc-100 dark:border-zinc-900/40">
        <img 
          src={product.imageBase64} 
          alt={name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[600ms] ease-out"
          loading="lazy"
        />
        
        {/* Top Badges (Featured / Inactive) */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="px-2.5 py-1 text-[8px] font-black tracking-widest text-white bg-red-600 rounded-lg">
              {currentLang === 'en' ? 'FEATURED' : 'مميز'}
            </span>
          )}
        </div>

        {/* Top Right Heart button (Always visible, pop animation) */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 z-20 p-2 rounded-full border bg-white/95 dark:bg-zinc-900/95 shadow-sm text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:scale-105 transition-all cursor-pointer ${
            favorited 
              ? 'border-red-500/20 text-red-550' 
              : 'border-zinc-200/50 dark:border-zinc-800'
          } ${popHeart ? 'scale-125' : ''}`}
          title={t('nav.favorites')}
        >
          <Heart className={`w-4 h-4 transition-all ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Hover overlay quick action */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-white text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4" />
            <span>{t('products.details')}</span>
          </span>
        </div>

      </div>

      {/* Product Info content */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        
        <div className="space-y-1.5">
          {/* Category */}
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block font-heading">
            {category}
          </span>

          {/* Title */}
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors font-heading">
            {name}
          </h3>

          {/* Description Preview */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom pricing / cart action bar */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-4 mt-auto">
          
          {/* Price */}
          <div className="text-sm font-extrabold text-zinc-950 dark:text-white font-heading">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer select-none ${
              isAdded
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-650 cursor-not-allowed border border-transparent'
                : 'bg-red-650 hover:bg-red-755 text-white hover:-translate-y-0.5 active:translate-y-0 shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{currentLang === 'en' ? 'Added' : 'تمت الإضافة'}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{t('products.add_to_cart')}</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
