import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAdminProducts } from '../../services/products.api';
import { apiRequest } from '../../services/api';
import { compressImage } from '../../utils/imageCompression';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Search, 
  Upload, Sparkles, Check, AlertCircle, RefreshCw, X 
} from 'lucide-react';

export default function ManageProducts() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState(null); // null means list view, {} or product object means modal form
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
      
      // Compress the image down to ~100-150KB
      const base64Result = await compressImage(file);
      setImageBase64(base64Result);
    } catch (err) {
      console.error('Image compression error:', err);
      setFormError(currentLang === 'en' ? 'Failed to process image file' : 'فشل معالجة ملف الصورة');
    } finally {
      setCompressionLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formSubmitting || compressionLoading) return;

    // Validate fields
    if (!nameEn.trim() || !nameAr.trim() || !descEn.trim() || !descAr.trim() || !catEn.trim() || !catAr.trim() || !price || !imageBase64) {
      setFormError(currentLang === 'en' 
        ? 'All fields are required, including an image.' 
        : 'جميع الحقول مطلوبة، بما في ذلك صورة المنتج.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError(currentLang === 'en' 
        ? 'Price must be a valid, positive number' 
        : 'يجب أن يكون السعر رقماً صحيحاً وموجباً');
      return;
    }

    const payload = {
      name: { en: nameEn.trim(), ar: nameAr.trim() },
      description: { en: descEn.trim(), ar: descAr.trim() },
      category: { en: catEn.trim(), ar: catAr.trim() },
      price: priceNum,
      imageBase64,
      isActive,
      featured
    };

    try {
      setFormSubmitting(true);
      setFormError(null);

      let res;
      if (formType === 'create') {
        res = await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        res = await apiRequest(`/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }

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
    <div className="space-y-6">
      
      {/* 1. Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            {currentLang === 'en' ? 'Product Inventory' : 'مخزون المنتجات'}
          </h1>
          <p className="text-xs text-gray-400">
            {currentLang === 'en' ? 'Add, edit, or archive catalog products.' : 'إضافة، تعديل، أو أرشفة منتجات المتجر.'}
          </p>
        </div>

        {!editingProduct && (
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-650 hover:bg-red-750 rounded-xl transition-all shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'New Product' : 'منتج جديد'}</span>
          </button>
        )}
      </div>

      {/* List / Form views conditional render */}
      {!editingProduct ? (
        
        // --- INVENTORY LIST VIEW ---
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              placeholder={currentLang === 'en' ? 'Search inventory...' : 'بحث في المخزون...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rtl:pr-10 rtl:pl-4 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-950 dark:text-white"
            />
          </div>

          {/* Grid list of inventory */}
          {loading ? (
            <div className="text-center py-12 text-sm text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading inventory...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16181c]/30 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{currentLang === 'en' ? 'No inventory products match filter.' : 'لا توجد منتجات مطابقة للبحث.'}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
              <table className="w-full text-left rtl:text-right border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 text-gray-500 font-semibold text-xs tracking-wider uppercase">
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Product' : 'المنتج'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Category' : 'التصنيف'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Price' : 'السعر'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Status' : 'الحالة'}</th>
                    <th className="px-6 py-4 text-center">{currentLang === 'en' ? 'Actions' : 'العمليات'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredProducts.map(p => {
                    const name = p.name[currentLang] || p.name['en'] || '';
                    const cat = p.category[currentLang] || p.category['en'] || '';
                    
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors">
                        {/* Title & image */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={p.imageBase64} alt={name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-900" />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">{name}</div>
                            {p.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-red-500/10 text-red-500 text-[9px] font-bold rounded mt-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                {currentLang === 'en' ? 'FEATURED' : 'مميز'}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                          {cat}
                        </td>
                        {/* Price */}
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          ${p.price.toFixed(2)}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.isActive 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {p.isActive ? (currentLang === 'en' ? 'Active' : 'نشط') : (currentLang === 'en' ? 'Inactive' : 'غير نشط')}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditForm(p)}
                              className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, name)}
                              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
        
        // --- EDIT/CREATE MODAL FORM VIEW ---
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 transition-colors max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-850 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              {formType === 'create' 
                ? (currentLang === 'en' ? 'Create New Product' : 'إضافة منتج جديد') 
                : (currentLang === 'en' ? 'Edit Product Details' : 'تعديل بيانات المنتج')}
            </h2>
            <button 
              onClick={() => setEditingProduct(null)} 
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {formError && (
              <div className="flex items-center gap-2 p-4 bg-red-950/20 text-red-400 rounded-xl text-sm border border-red-900/50">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: English details */}
              <div className="space-y-4 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl">
                <h3 className="text-xs font-extrabold text-red-600 dark:text-red-500 uppercase tracking-widest border-b border-gray-200 dark:border-gray-850 pb-2">
                  English Fields (EN)
                </h3>
                
                {/* Name EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Product Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Premium Brake Pads"
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-950 dark:text-white"
                  />
                </div>

                {/* Category EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Category (EN) *</label>
                  <input
                    type="text"
                    required
                    value={catEn}
                    onChange={(e) => setCatEn(e.target.value)}
                    placeholder="Brakes"
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-950 dark:text-white"
                  />
                </div>

                {/* Desc EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Description (EN) *</label>
                  <textarea
                    rows="4"
                    required
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="High performance carbon metallic formula..."
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none text-gray-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Right Column: Arabic details */}
              <div className="space-y-4 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-200 dark:border-gray-850 p-6 rounded-2xl" dir="rtl">
                <h3 className="text-xs font-extrabold text-red-600 dark:text-red-500 uppercase tracking-widest border-b border-gray-200 dark:border-gray-850 pb-2">
                  الحقول باللغة العربية (AR)
                </h3>
                
                {/* Name AR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">اسم المنتج (العربية) *</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="فحمات فرامل متميزة"
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-950 dark:text-white"
                  />
                </div>

                {/* Category AR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">التصنيف (العربية) *</label>
                  <input
                    type="text"
                    required
                    value={catAr}
                    onChange={(e) => setCatAr(e.target.value)}
                    placeholder="الفرامل"
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-950 dark:text-white"
                  />
                </div>

                {/* Desc AR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">الوصف (العربية) *</label>
                  <textarea
                    rows="4"
                    required
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder="تركيبة كربون معدنية عالية الأداء..."
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none text-gray-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Shared parameters */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start border-t border-gray-150 dark:border-gray-850 pt-6">
                
                {/* Price input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="49.99"
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-gray-950 dark:text-white"
                  />
                </div>

                {/* Image Upload Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Product Image *</label>
                  <div className="relative border border-dashed border-gray-350 dark:border-gray-750 hover:bg-gray-50/50 dark:hover:bg-gray-900/10 rounded-lg p-2 transition-colors flex items-center justify-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    
                    {imageBase64 ? (
                      <div className="flex items-center gap-2">
                        <img src={imageBase64} alt="Upload Preview" className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-800" />
                        <span className="text-[10px] text-green-500 font-semibold uppercase tracking-wider flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" />
                          {currentLang === 'en' ? 'Loaded' : 'تم التحميل'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-gray-400 flex flex-col items-center">
                        <Upload className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-semibold">{currentLang === 'en' ? 'Upload Image' : 'اختر صورة'}</span>
                      </div>
                    )}
                  </div>
                  {compressionLoading && (
                    <span className="text-[10px] text-gray-400 animate-pulse">{currentLang === 'en' ? 'Compressing image...' : 'جاري ضغط الصورة...'}</span>
                  )}
                </div>

                {/* Toggles (Active & Featured) */}
                <div className="flex flex-row sm:flex-col items-center justify-around sm:items-start gap-4 py-2 border-l border-gray-200 dark:border-gray-850 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6 sm:h-full">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-red-655 focus:ring-red-500"
                    />
                    <span>{currentLang === 'en' ? 'Visible (Active)' : 'نشط (مرئي)'}</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-red-655 focus:ring-red-500"
                    />
                    <span>{currentLang === 'en' ? 'Featured Item' : 'منتج مميز'}</span>
                  </label>
                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-150 dark:border-gray-850 pt-6">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl"
              >
                {currentLang === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              
              <button
                type="submit"
                disabled={formSubmitting || compressionLoading}
                className="px-6 py-2 bg-red-650 hover:bg-red-750 disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow hover:shadow-md"
              >
                {formSubmitting
                  ? (currentLang === 'en' ? 'Saving...' : 'جاري الحفظ...')
                  : (currentLang === 'en' ? 'Save Product' : 'حفظ المنتج')}
              </button>
            </div>

          </form>

        </div>

      )}

    </div>
  );
}
