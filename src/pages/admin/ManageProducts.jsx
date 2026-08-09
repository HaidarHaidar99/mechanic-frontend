import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAdminProducts } from '../../services/products.api';
import { apiRequest } from '../../services/api';
import { compressImage } from '../../utils/imageCompression';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Search, 
  Upload, Sparkles, Check, AlertCircle, RefreshCw, X, Save 
} from 'lucide-react';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';

export default function ManageProducts() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null); // null means list view, otherwise product object
  const [formType, setFormType] = useState('create'); // 'create' | 'edit'

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [catEn, setCatEn] = useState('');
  const [catAr, setCatAr] = useState('');
  const [price, setPrice] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [compressionLoading, setCompressionLoading] = useState(false);

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin inventory:', err);
      setError(err.message || 'Could not load inventory items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const openCreateForm = () => {
    setFormType('create');
    setEditingProduct({});
    setNameEn('');
    setNameAr('');
    setDescEn('');
    setDescAr('');
    setCatEn('');
    setCatAr('');
    setPrice('');
    setImageBase64('');
    setIsActive(true);
    setFeatured(false);
    setFormError(null);
  };

  const openEditForm = (product) => {
    setFormType('edit');
    setEditingProduct(product);
    setNameEn(product.name.en || '');
    setNameAr(product.name.ar || '');
    setDescEn(product.description.en || '');
    setDescAr(product.description.ar || '');
    setCatEn(product.category.en || '');
    setCatAr(product.category.ar || '');
    setPrice(product.price.toString());
    setImageBase64(product.imageBase64 || '');
    setIsActive(product.isActive);
    setFeatured(product.featured || false);
    setFormError(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError(currentLang === 'en' ? 'Selected file must be an image' : 'الملف المحدد يجب أن يكون صورة');
      return;
    }

    try {
      setCompressionLoading(true);
      setFormError(null);
      const base64 = await compressImage(file);
      setImageBase64(base64);
    } catch (err) {
      console.error('Image compression error:', err);
      setFormError(err.message || (currentLang === 'en' ? 'Image compression failed' : 'فشل ضغط الصورة'));
    } finally {
      setCompressionLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitting || compressionLoading) return;

    if (!nameEn.trim() || !nameAr.trim() || !descEn.trim() || !descAr.trim() || !catEn.trim() || !catAr.trim() || !price || !imageBase64) {
      setFormError(currentLang === 'en' ? 'Please fill in all fields and select a product image' : 'يرجى ملء جميع الحقول واختيار صورة للمنتج');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError(currentLang === 'en' ? 'Price must be a valid positive number' : 'يجب أن يكون السعر رقماً إيجابياً صحيحاً');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);

      const payload = {
        name: { en: nameEn.trim(), ar: nameAr.trim() },
        description: { en: descEn.trim(), ar: descAr.trim() },
        category: { en: catEn.trim(), ar: catAr.trim() },
        price: priceNum,
        imageBase64,
        isActive,
        featured
      };

      const url = formType === 'create' ? '/products' : `/products/${editingProduct.id}`;
      const method = formType === 'create' ? 'POST' : 'PUT';

      const res = await apiRequest(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setEditingProduct(null);
        fetchProductsList();
      } else {
        throw new Error(res.message || 'Operation failed');
      }

    } catch (err) {
      console.error('Product save error:', err);
      setFormError(err.message || 'Error occurred while saving product details.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, nameStr) => {
    const confirmMsg = currentLang === 'en' 
      ? `Are you sure you want to delete product "${nameStr}"?`
      : `هل أنت متأكد من حذف المنتج "${nameStr}"؟`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const res = await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        fetchProductsList();
      } else {
        throw new Error(res.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Could not delete product.');
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const name = (p.name[currentLang] || p.name['en'] || '').toLowerCase();
    const cat = (p.category[currentLang] || p.category['en'] || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return name.includes(query) || cat.includes(query);
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            Catalog inventory
          </span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
            {currentLang === 'en' ? 'Product Inventory' : 'مخزون المنتجات'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {currentLang === 'en' ? 'Add, edit, or archive catalog products.' : 'إضافة، تعديل، أو أرشفة منتجات المتجر.'}
          </p>
        </div>

        {!editingProduct && (
          <Button
            onClick={openCreateForm}
            variant="primary"
            icon={Plus}
          >
            {currentLang === 'en' ? 'New Product' : 'منتج جديد'}
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* List / Form views */}
      {!editingProduct ? (
        
        // --- LIST VIEW ---
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="max-w-md">
            <Input 
              id="searchInventory"
              placeholder={currentLang === 'en' ? 'Search inventory...' : 'بحث في المخزون...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Table list */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-2xl flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="rect" width="36px" height="36px" />
                    <Skeleton variant="text" width="120px" />
                  </div>
                  <Skeleton variant="text" width="60px" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[var(--border-strong)] rounded-3xl bg-[var(--surface-elevated)]/30">
              <AlertCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">{currentLang === 'en' ? 'No inventory products match filter.' : 'لا توجد منتجات مطابقة للبحث.'}</p>
            </div>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] font-black text-[10px] tracking-wider uppercase">
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Product' : 'المنتج'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Category' : 'التصنيف'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Price' : 'السعر'}</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">{currentLang === 'en' ? 'Actions' : 'العمليات'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredProducts.map(p => {
                    const name = p.name[currentLang] || p.name['en'] || '';
                    const cat = p.category[currentLang] || p.category['en'] || '';
                    
                    return (
                      <tr key={p.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                        
                        {/* Title & image */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={p.imageBase64} alt={name} className="w-9 h-9 rounded-lg object-cover bg-[var(--page-bg)] border border-[var(--border)] shrink-0" />
                          <div>
                            <div className="font-extrabold text-[var(--text-primary)] font-heading uppercase">{name}</div>
                            {p.featured && (
                              <div className="mt-1">
                                <Badge variant="primary" icon={Sparkles}>
                                  {currentLang === 'en' ? 'Featured' : 'مميز'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
                          {cat}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-extrabold text-[var(--text-primary)] font-heading">
                          ${p.price.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Badge variant={p.isActive ? 'success' : 'danger'}>
                            {p.isActive ? (currentLang === 'en' ? 'Active' : 'نشط') : (currentLang === 'en' ? 'Inactive' : 'غير نشط')}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <IconButton
                              icon={Edit2}
                              variant="ghost"
                              onClick={() => openEditForm(p)}
                              title="Edit product"
                            />
                            
                            <IconButton
                              icon={Trash2}
                              variant="ghost"
                              className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
                              onClick={() => handleDeleteProduct(p.id, name)}
                              title="Delete product"
                            />
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      ) : (
        
        // --- EDIT/CREATE PANEL ---
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <h2 className="text-base font-extrabold text-[var(--text-primary)] uppercase tracking-widest font-heading">
              {formType === 'create' 
                ? (currentLang === 'en' ? 'Create New Product' : 'إضافة منتج جديد') 
                : (currentLang === 'en' ? 'Edit Product Details' : 'تعديل بيانات المنتج')}
            </h2>
            <IconButton 
              icon={X}
              variant="ghost"
              onClick={() => setEditingProduct(null)}
            />
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {formError && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20 font-sans">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* English details */}
              <div className="space-y-4 bg-[var(--surface-elevated)] border border-[var(--border)] p-5 rounded-2xl">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest border-b border-[var(--border)] pb-2 font-heading">
                  English Fields (EN)
                </h3>
                
                <Input 
                  label="Product Name (EN) *"
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  required
                  placeholder="Premium Brake Pads"
                />

                <Input 
                  label="Category (EN) *"
                  id="catEn"
                  value={catEn}
                  onChange={(e) => setCatEn(e.target.value)}
                  required
                  placeholder="Brakes"
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="descEn" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block font-heading">
                    Description (EN) *
                  </label>
                  <textarea
                    id="descEn"
                    rows="4"
                    required
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="High performance carbon formula..."
                    className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-4 focus:ring-[var(--input-focus)]/10 transition-all resize-none font-sans"
                  />
                </div>
              </div>

              {/* Arabic details */}
              <div className="space-y-4 bg-[var(--surface-elevated)] border border-[var(--border)] p-5 rounded-2xl" dir="rtl">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest border-b border-[var(--border)] pb-2 font-heading text-right">
                  الحقول باللغة العربية (AR)
                </h3>
                
                <Input 
                  label="اسم المنتج (العربية) *"
                  id="nameAr"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  required
                  dir="rtl"
                  placeholder="فحمات فرامل متميزة"
                />

                <Input 
                  label="التصنيف (العربية) *"
                  id="catAr"
                  value={catAr}
                  onChange={(e) => setCatAr(e.target.value)}
                  required
                  dir="rtl"
                  placeholder="الفرامل"
                />

                <div className="flex flex-col gap-1.5" dir="rtl">
                  <label htmlFor="descAr" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block font-heading text-right">
                    الوصف (العربية) *
                  </label>
                  <textarea
                    id="descAr"
                    rows="4"
                    required
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder="تركيبة كربون معدنية عالية الأداء..."
                    className="px-3.5 py-2.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-4 focus:ring-[var(--input-focus)]/10 transition-all resize-none font-sans text-right"
                  />
                </div>
              </div>

              {/* Parameters */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start border-t border-[var(--border)] pt-6">
                
                {/* Price */}
                <Input 
                  label="Price (USD) *"
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="49.99"
                />

                {/* Image picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block font-heading">Product Image *</label>
                  <div className="relative border border-dashed border-[var(--border-strong)] hover:bg-[var(--surface-hover)] rounded-xl p-2.5 transition-colors flex items-center justify-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 font-sans"
                    />
                    
                    {imageBase64 ? (
                      <div className="flex items-center gap-2">
                        <img src={imageBase64} alt="Upload Preview" className="w-12 h-12 object-cover rounded-lg border border-[var(--border)]" />
                        <Badge variant="success" icon={Check}>
                          {currentLang === 'en' ? 'Loaded' : 'تم التحميل'}
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-[var(--text-secondary)] flex flex-col items-center">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{currentLang === 'en' ? 'Upload Image' : 'اختر صورة'}</span>
                      </div>
                    )}
                  </div>
                  {compressionLoading && (
                    <span className="text-[9px] text-[var(--text-muted)] animate-pulse font-bold">{currentLang === 'en' ? 'Compressing image...' : 'جاري ضغط الصورة...'}</span>
                  )}
                </div>

                {/* Flags switches */}
                <div className="flex flex-row sm:flex-col items-center justify-around sm:items-start gap-4 py-2 border-l border-[var(--border)] pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6 sm:h-full">
                  <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]/10 cursor-pointer bg-[var(--surface-elevated)]"
                    />
                    <span>{currentLang === 'en' ? 'Active (Visible)' : 'نشط (مرئي)'}</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]/10 cursor-pointer bg-[var(--surface-elevated)]"
                    />
                    <span>{currentLang === 'en' ? 'Featured Item' : 'منتج مميز'}</span>
                  </label>
                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-6">
              <Button
                variant="outline"
                onClick={() => setEditingProduct(null)}
              >
                {currentLang === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                loading={formSubmitting}
                disabled={formSubmitting || compressionLoading}
                icon={Save}
              >
                {formSubmitting
                  ? (currentLang === 'en' ? 'Saving...' : 'جاري الحفظ...')
                  : (currentLang === 'en' ? 'Save Product' : 'حفظ المنتج')}
              </Button>
            </div>

          </form>

        </div>

      )}

    </div>
  );
}
