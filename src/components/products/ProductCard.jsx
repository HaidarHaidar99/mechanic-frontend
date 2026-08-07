import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, onOpenDetails }) {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const currentLang = i18n.language || 'en';

  const name = product.name[currentLang] || product.name['en'] || '';
  const description = product.description[currentLang] || product.description['en'] || '';
  const category = product.category[currentLang] || product.category['en'] || '';
  const price = product.price;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="group bg-white dark:bg-[#1f2028] rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <img 
          src={product.imageBase64} 
          alt={name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges (Featured / Inactive) */}
        <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 flex flex-col gap-1 z-10">
          {product.featured && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white bg-red-600 rounded">
              {currentLang === 'en' ? 'FEATURED' : 'مميز'}
            </span>
          )}
        </div>

        {/* Floating actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <button
            onClick={handleFavoriteClick}
            className="p-2.5 bg-white dark:bg-gray-900 rounded-full text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 hover:scale-110 transition-all shadow"
            title={t('nav.favorites')}
          >
            <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          
          <button
            onClick={() => onOpenDetails(product)}
            className="p-2.5 bg-white dark:bg-gray-900 rounded-full text-gray-800 dark:text-white hover:text-red-500 hover:scale-110 transition-all shadow"
            title={t('products.details')}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-xs font-semibold text-red-600 dark:text-red-500 uppercase tracking-wider mb-1">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-1">
          {name}
        </h3>

        {/* Description Preview (Line Clamped) */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        {/* Bottom Area (Price & Add to Cart) */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-150 dark:border-gray-800">
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t('products.add_to_cart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
