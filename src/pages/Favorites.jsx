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

  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Wrench className="w-12 h-12 text-red-650 animate-spin" />
        <span className="text-zinc-550 dark:text-zinc-450 text-sm font-semibold tracking-wider uppercase animate-pulse">Loading favorites...</span>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-6 text-center max-w-md mx-auto py-12 animate-fade-in">
        <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-red-500 animate-pulse">
          <Heart className="w-12 h-12 fill-red-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white font-heading uppercase tracking-tight">
            {t('favorites.empty')}
          </h2>
          <p className="text-xs text-zinc-550 dark:text-zinc-450 leading-relaxed">
            {currentLang === 'en' 
              ? 'Tapping the heart icon on products will save them here for quick access later.'
              : 'الضغط على رمز القلب في بطاقة المنتج سيقوم بحفظه هنا للرجوع إليه لاحقاً.'}
          </p>
        </div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-red-650 hover:bg-red-755 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-102 cursor-pointer shadow-md shadow-red-500/10"
        >
          <span>{currentLang === 'en' ? 'Explore Products' : 'استكشف المنتجات'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-5">
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-heading">
          {currentLang === 'en' ? 'My Wishlist' : 'قائمتي المفضلة'}
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight mt-1 font-heading">
          {t('favorites.title')}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 font-bold">
          {favoriteProducts.length} {currentLang === 'en' ? 'products saved' : 'منتجات تم حفظها'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
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
