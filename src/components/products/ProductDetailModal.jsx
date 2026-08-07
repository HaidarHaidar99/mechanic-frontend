import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { X, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);

  const currentLang = i18n.language || 'en';

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

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white dark:bg-[#1f2028] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative border border-gray-150 dark:border-gray-800 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2 bg-black/40 hover:bg-black/60 md:bg-gray-100 md:hover:bg-gray-250 md:dark:bg-gray-900 md:dark:hover:bg-gray-800 text-white md:text-gray-700 md:dark:text-gray-300 rounded-full transition-colors"
          aria-label={t('product_modal.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-150 dark:bg-gray-900 relative">
          <img 
            src={product.imageBase64} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full">
          {/* Category */}
          <span className="text-xs font-semibold text-red-600 dark:text-red-500 uppercase tracking-wider mb-2">
            {category}
          </span>

          {/* Name */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {name}
          </h2>

          {/* Price */}
          <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Description */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow pr-2 rtl:pr-0 rtl:pl-2">
            <p className="whitespace-pre-line leading-relaxed">{description}</p>
          </div>

          {/* Actions Section */}
          <div className="mt-auto border-t border-gray-150 dark:border-gray-800 pt-4 space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('product_modal.quantity')}
              </span>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                <button 
                  onClick={handleDecrement}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button 
                  onClick={handleIncrement}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center gap-3">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('products.add_to_cart')}</span>
              </button>

              {/* Favorites toggle */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="p-2.5 border border-gray-350 dark:border-gray-700 hover:bg-gray-105 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl transition-all shadow-sm"
                title={t('nav.favorites')}
              >
                <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500 border-none' : ''}`} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
