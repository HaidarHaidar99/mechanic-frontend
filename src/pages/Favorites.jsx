import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../contexts/FavoritesContext';
import { getActiveProducts } from '../services/products.api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { Heart, ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';

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
      <Container className="py-20 space-y-8 animate-pulse">
        <Skeleton variant="text" width="30%" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 space-y-4 shadow-sm">
              <Skeleton variant="rect" className="aspect-square w-full" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>
      </Container>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <Container className="py-20 flex items-center justify-center">
        <EmptyState 
          icon={Heart} 
          title={t('favorites.empty')}
          description={currentLang === 'en' 
            ? 'Tapping the heart icon on products will save them here for quick access later.'
            : 'الضغط على رمز القلب في بطاقة المنتج سيقوم بحفظه هنا للرجوع إليه لاحقاً.'}
          actionText={currentLang === 'en' ? 'Explore Products' : 'استكشف المنتجات'}
          actionLink={Link}
          actionTo="/products"
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
          {currentLang === 'en' ? 'My Wishlist' : 'قائمتي المفضلة'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
          {t('favorites.title')}
        </h1>
        <p className="text-[11px] font-bold text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
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

    </Container>
  );
}
