import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../contexts/FavoritesContext';
import { getActiveProducts } from '../services/products.api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { Heart, ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { t, i18n } = useTranslation();
  const { favoriteIds } = useFavorites();
  const currentLang = i18n.language || 'en';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getActiveProducts();
        setProducts(data.filter(p => p.isActive));
      } catch (err) {
        console.error('Error fetching products for favorites page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter only products that exist in the favoriteIds list
  // Gracefully ignores any IDs of deleted products
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] space-y-4">
        <Wrench className="w-10 h-10 text-red-650 animate-spin" />
        <span className="text-gray-500 text-sm">Loading favorites...</span>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] space-y-6 text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-400">
          <Heart className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('favorites.empty')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            {currentLang === 'en' 
              ? 'Tapping the heart icon on products will save them here for quick access later.'
              : 'الضغط على رمز القلب في بطاقة المنتج سيقوم بحفظه هنا للرجوع إليه لاحقاً.'}
          </p>
        </div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-1 px-5 py-2.5 bg-red-650 hover:bg-red-750 text-white font-bold rounded-xl shadow transition-all hover:scale-103"
        >
          <span>{currentLang === 'en' ? 'Explore Products' : 'استكشف المنتجات'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
          {t('favorites.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {favoriteProducts.length} {currentLang === 'en' ? 'products saved' : 'منتجات تم حفظها'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favoriteProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onOpenDetails={setSelectedProduct}
          />
        ))}
      </div>

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
