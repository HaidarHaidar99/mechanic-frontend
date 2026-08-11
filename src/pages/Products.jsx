import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActiveProducts } from '../services/products.api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { Search, Filter, Wrench } from 'lucide-react';
import Container from '../components/common/Container';
import SectionHeader from '../components/common/SectionHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';
import { useScrollReveal } from '../hooks/useScrollReveal';

function AnimatedProductCard({ product, onOpenDetails, index }) {
  const cardRef = useScrollReveal({ once: false });
  return (
    <div 
      ref={cardRef} 
      className="h-full"
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      <ProductCard 
        product={product} 
        onOpenDetails={onOpenDetails} 
      />
    </div>
  );
}

export default function Products() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getActiveProducts();
        setProducts(data.filter(p => p.isActive));
      } catch (err) {
        console.error('Error loading products list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique categories
  const categories = products.reduce((acc, product) => {
    const catName = product.category[currentLang] || product.category['en'] || '';
    const trimmedCat = catName.trim();
    if (trimmedCat && !acc.includes(trimmedCat)) {
      acc.push(trimmedCat);
    }
    return acc;
  }, []);

  // Filter products by search query and category
  const filteredProducts = products.filter(product => {
    const name = (product.name[currentLang] || product.name['en'] || '').toLowerCase();
    const description = (product.description[currentLang] || product.description['en'] || '').toLowerCase();
    const category = (product.category[currentLang] || product.category['en'] || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = name.includes(query) || description.includes(query);
    const matchesCategory = selectedCategory 
      ? category === selectedCategory.toLowerCase().trim() 
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="py-8 space-y-10">
      
      {/* Page Header */}
      <SectionHeader 
        category={currentLang === 'en' ? 'Performance Hub' : 'مركز الأداء'}
        title={t('nav.products')}
        subtitle={currentLang === 'en' 
          ? 'Browse our extensive catalog of genuine parts and automotive supplies.' 
          : 'تصفح تشكيلتنا الواسعة من قطع الغيار الأصلية ومستلزمات السيارات.'}
      />

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm">
        
        {/* Search Input */}
        <div className="md:col-span-2">
          <Input 
            id="searchQuery"
            placeholder={t('products.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <Select 
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: '', label: t('products.category') },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
          />
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 space-y-4 shadow-sm animate-pulse">
              <Skeleton variant="rect" className="aspect-square w-full" />
              <Skeleton variant="text" width="65%" />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState 
          icon={Wrench} 
          title={t('products.no_products')} 
          description={currentLang === 'en' 
            ? 'Try modifying your search query or selected category.' 
            : 'يرجى تغيير كلمة البحث أو التصنيف المحدد.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {filteredProducts.map((product, index) => (
            <AnimatedProductCard 
              key={product.id} 
              product={product} 
              onOpenDetails={setSelectedProduct}
              index={index}
            />
          ))}
        </div>
      )}

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
