import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { getActiveProducts } from '../../services/products.api';
import ProductDetailModal from '../products/ProductDetailModal';
import IconButton from './IconButton';

export default function SearchOverlay({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const inputRef = useRef(null);

  // Lock body scroll when search modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Load products if not loaded yet
      if (products.length === 0) {
        setLoading(true);
        getActiveProducts()
          .then((data) => {
            setProducts(data.filter((p) => p.isActive));
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setFiltered([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search logic (300ms)
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const res = products.filter((p) => {
        const nameEn = p.name?.en?.toLowerCase() || '';
        const nameAr = p.name?.ar?.toLowerCase() || '';
        const catEn = p.category?.en?.toLowerCase() || '';
        const catAr = p.category?.ar?.toLowerCase() || '';
        return (
          nameEn.includes(q) ||
          nameAr.includes(q) ||
          catEn.includes(q) ||
          catAr.includes(q)
        );
      });
      setFiltered(res);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[var(--page-bg)]/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in font-sans overflow-hidden">
        {/* Top search bar container */}
        <div className="max-w-3xl w-full mx-auto flex items-center gap-3 border-b border-[var(--border)] pb-4">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] rtl:left-auto rtl:right-3.5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                currentLang === 'en'
                  ? 'Search parts, brands, categories...'
                  : 'ابحث عن قطع الغيار، الأصناف...'
              }
              className="w-full py-3.5 pl-11 pr-10 rtl:pl-10 rtl:pr-11 bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl text-sm font-semibold placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-full rtl:right-auto rtl:left-3.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <IconButton
            icon={X}
            variant="ghost"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0"
          />
        </div>

        {/* Results container */}
        <div className="max-w-3xl w-full mx-auto flex-grow overflow-y-auto py-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest animate-pulse font-heading">
              {currentLang === 'en' ? 'Loading Catalog...' : 'جاري تحميل المنتجات...'}
            </div>
          ) : query.trim() === '' ? (
            <div className="text-center py-16 text-[var(--text-muted)] space-y-2">
              <Search className="w-10 h-10 mx-auto text-[var(--border-strong)]" />
              <p className="text-xs font-bold uppercase tracking-wider font-heading">
                {currentLang === 'en'
                  ? 'Type to start searching products'
                  : 'اكتب للبحث في كشف المنتجات'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)] space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-[var(--border-strong)]" />
              <p className="text-xs font-bold uppercase tracking-wider font-heading">
                {currentLang === 'en'
                  ? 'No matching products found'
                  : 'لم يتم العثور على منتجات مطابقة'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block font-heading">
                {filtered.length} {currentLang === 'en' ? 'Results Found' : 'نتيجة البحث'}
              </span>

              {filtered.map((product) => {
                const name =
                  product.name?.[currentLang] || product.name?.['en'] || '';
                const category =
                  product.category?.[currentLang] ||
                  product.category?.['en'] ||
                  '';

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={product.imageBase64}
                        alt={name}
                        className="w-12 h-12 object-cover rounded-xl bg-[var(--page-bg)] border border-[var(--border)] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
                          {category}
                        </span>
                        <h4 className="text-xs font-extrabold text-[var(--text-primary)] truncate font-heading group-hover:text-[var(--accent)] transition-colors">
                          {name}
                        </h4>
                        <span className="text-xs font-extrabold text-[var(--text-secondary)]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors rtl:rotate-180 shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal if user taps a result */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
