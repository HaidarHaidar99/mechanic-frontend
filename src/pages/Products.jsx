import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActiveProducts } from '../services/products.api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailModal from '../components/products/ProductDetailModal';
import { Search, Filter, Wrench } from 'lucide-react';

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

  // Extract unique categories based on current active language
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
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
          {t('nav.products')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {currentLang === 'en' 
            ? 'Browse our extensive catalog of genuine parts and automotive supplies.' 
            : 'تصفح تشكيلتنا الواسعة من قطع الغيار الأصلية ومستلزمات السيارات.'}
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1f2028] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:right-3 rtl:left-auto" />
          <input 
            type="text"
            placeholder={t('products.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rtl:pr-10 rtl:pl-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          />
        </div>

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <div className="relative w-full md:w-64 flex items-center">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:right-3 rtl:left-auto" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rtl:pr-10 rtl:pl-8 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">{t('products.category')}</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            {/* Custom arrow indicator for select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rtl:left-3 rtl:right-auto">
              ▼
            </div>
          </div>
        )}

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-[#1f2028] border border-gray-150 dark:border-gray-800 rounded-xl p-4 space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1f2028]/35 transition-colors">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('products.no_products')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentLang === 'en' 
              ? 'Try modifying your search query or selected category.' 
              : 'يرجى تغيير كلمة البحث أو التصنيف المحدد.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpenDetails={setSelectedProduct}
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

    </div>
  );
}
