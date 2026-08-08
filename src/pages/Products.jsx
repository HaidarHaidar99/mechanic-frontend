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
    <div className="space-y-12 pb-16">
      
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-heading">
          {currentLang === 'en' ? 'Performance Hub' : 'مركز الأداء'}
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight mt-1 font-heading">
          {t('nav.products')}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-450 mt-1 max-w-xl">
          {currentLang === 'en' 
            ? 'Browse our extensive catalog of genuine parts and automotive supplies.' 
            : 'تصفح تشكيلتنا الواسعة من قطع الغيار الأصلية ومستلزمات السيارات.'}
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white dark:bg-[#121215] p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm transition-colors">
        
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rtl:right-4 rtl:left-auto" />
          <input 
            type="text"
            placeholder={t('products.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rtl:pr-11 rtl:pl-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-sm text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-sans"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rtl:right-4 rtl:left-auto" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 rtl:pr-11 rtl:pl-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all appearance-none cursor-pointer font-sans"
          >
            <option value="">{t('products.category')}</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          {/* Custom chevron indicator */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 rtl:left-4 rtl:right-auto text-[10px]">
            ▼
          </div>
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" />
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl bg-white dark:bg-[#121215]/20 animate-fade-in">
          <Wrench className="w-12 h-12 text-zinc-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-extrabold text-zinc-950 dark:text-white font-heading">
            {t('products.no_products')}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 max-w-sm mx-auto leading-relaxed">
            {currentLang === 'en' 
              ? 'Try modifying your search query or selected category.' 
              : 'يرجى تغيير كلمة البحث أو التصنيف المحدد.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch animate-fade-in">
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
