import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAdminProducts } from '../../services/products.api';
import { apiRequest } from '../../services/api';
import { compressImage } from '../../utils/imageCompression';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Search, 
  Upload, Sparkles, Check, AlertCircle, RefreshCw, X, Save
} from 'lucide-react';

export default function ManageProducts() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">
            {currentLang === 'en' ? 'Product Inventory' : 'مخزون المنتجات'}
          </h1>
          <p className="text-xs text-zinc-400">
            {currentLang === 'en' ? 'Add, edit, or archive catalog products.' : 'إضافة، تعديل، أو أرشفة منتجات المتجر.'}
          </p>
        </div>

        {!editingProduct && (
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-650 hover:bg-red-755 rounded-xl transition-all shadow cursor-pointer shrink-0"
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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-450 rtl:right-3.5 rtl:left-auto" />
            <input
              type="text"
              placeholder={currentLang === 'en' ? 'Search inventory...' : 'بحث في المخزون...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all text-zinc-950 dark:text-white"
            />
          </div>

          {/* Table list of inventory */}
          {loading ? (
            <div className="text-center py-12 text-xs text-zinc-450 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading inventory...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#121215]/20 rounded-3xl">
              <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-semibold">{currentLang === 'en' ? 'No inventory products match filter.' : 'لا توجد منتجات مطابقة للبحث.'}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-sm transition-colors">
              <table className="w-full text-left rtl:text-right border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/10 text-zinc-400 font-semibold text-xs tracking-wider uppercase">
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Product' : 'المنتج'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Category' : 'التصنيف'}</th>
                    <th className="px-6 py-4">{currentLang === 'en' ? 'Price' : 'السعر'}</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">{currentLang === 'en' ? 'Actions' : 'العمليات'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                  {filteredProducts.map(p => {
                    const name = p.name[currentLang] || p.name['en'] || '';
                    const cat = p.category[currentLang] || p.category['en'] || '';
                    
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-colors">
                        
                        {/* Title & image */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={p.imageBase64} alt={name} className="w-9 h-9 rounded-lg object-cover bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/40 shrink-0" />
                          <div>
                            <div className="font-semibold text-zinc-900 dark:text-white line-clamp-1 font-heading">{name}</div>
                            {p.featured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-red-500/10 text-red-500 text-[8px] font-black rounded uppercase tracking-wider mt-0.5 font-heading">
                                <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                                {currentLang === 'en' ? 'FEATURED' : 'مميز'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider">
                          {cat}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-extrabold text-zinc-950 dark:text-white font-heading">
                          ${p.price.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
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
                              className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, name)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        
        // --- EDIT/CREATE VIEW ---
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl shadow-sm p-6 sm:p-8 transition-colors max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900/60 mb-6">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">
              {formType === 'create' 
                ? (currentLang === 'en' ? 'Create New Product' : 'إضافة منتج جديد') 
                : (currentLang === 'en' ? 'Edit Product Details' : 'تعديل بيانات المنتج')}
            </h2>
            <button 
              onClick={() => setEditingProduct(null)} 
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 rounded-full"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {formError && (
              <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-2xl text-xs border border-red-900/50">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: English details */}
              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl">
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-zinc-150 dark:border-zinc-900/60 pb-2 font-heading">
                  English Fields (EN)
                </h3>
                
                {/* Name EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">Product Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Premium Brake Pads"
                    className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all text-zinc-950 dark:text-white font-sans"
                  />
                </div>

                {/* Category EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Category (EN) *</label>
                  <input
                    type="text"
                    required
                    value={catEn}
                    onChange={(e) => setCatEn(e.target.value)}
                    placeholder="Brakes"
                    className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all text-zinc-950 dark:text-white font-sans"
                  />
                </div>

                {/* Desc EN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Description (EN) *</label>
                  <textarea
                    rows="4"
                    required
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="High performance carbon formula..."
                    className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all resize-none text-zinc-950 dark:text-white font-sans"
                  />
                </div>
              </div>

              {/* Right Column: Arabic details */}
              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl" dir="rtl">
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-zinc-150 dark:border-zinc-900/60 pb-2 font-heading text-right">
                  الحقول باللغة العربية (AR)
                </h3>
                
                {/* Name AR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right">اسم المنتج (العربية) *</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="فحمات فرامل متميزة"
                    className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all text-zinc-950 dark:text-white font-sans text-right"
                  />
                </div>

                {/* Category AR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right">التصنيف (العربية) *</label>
                  <input
                    type="text"
                    required
                    value={catAr}
                    onChange={(e) => setCatAr(e.target.value)}
                    placeholder="الفرامل"
                    className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all text-zinc-950 dark:text-white font-sans text-right"
                  />
                </div>

                {/* Desc AR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest text-right">الوصف (العربية) *</label>
                  <textarea
                    rows="4"
                    required
                    value={descAr}
                    onChange={(e) => setDescAr(e.target.value)}
                    placeholder="تركيبة كربون معدنية عالية الأداء..."
                    className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all resize-none text-zinc-950 dark:text-white font-sans text-right"
                  />
                </div>
              </div>

              {/* Shared parameters */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start border-t border-zinc-100 dark:border-zinc-900/60 pt-6">
                
                {/* Price input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="49.99"
                    className="px-3.5 py-2.5 bg-zinc-50 dark:bg-[#121215] border border-zinc-250 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-red-500 transition-all text-zinc-950 dark:text-white font-sans"
                  />
                </div>

                {/* Image Upload Box */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Product Image *</label>
                  <div className="relative border border-dashed border-zinc-300 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 rounded-xl p-2 transition-colors flex items-center justify-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 font-sans"
                    />
                    
                    {imageBase64 ? (
                      <div className="flex items-center gap-2">
                        <img src={imageBase64} alt="Upload Preview" className="w-12 h-12 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800" />
                        <span className="text-[9px] text-green-500 font-black uppercase tracking-widest flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" />
                          {currentLang === 'en' ? 'Loaded' : 'تم التحميل'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center py-2.5 text-zinc-400 flex flex-col items-center">
                        <Upload className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{currentLang === 'en' ? 'Upload Image' : 'اختر صورة'}</span>
                      </div>
                    )}
                  </div>
                  {compressionLoading && (
                    <span className="text-[9px] text-zinc-400 animate-pulse font-bold">{currentLang === 'en' ? 'Compressing image...' : 'جاري ضغط الصورة...'}</span>
                  )}
                </div>

                {/* Toggles (Active & Featured) */}
                <div className="flex flex-row sm:flex-col items-center justify-around sm:items-start gap-4 py-2 border-l border-zinc-150 dark:border-zinc-850 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6 sm:h-full">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-650 dark:text-zinc-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-800 text-red-655 focus:ring-red-500 cursor-pointer"
                    />
                    <span>{currentLang === 'en' ? 'Active (Visible)' : 'نشط (مرئي)'}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-655 dark:text-zinc-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-800 text-red-655 focus:ring-red-500 cursor-pointer"
                    />
                    <span>{currentLang === 'en' ? 'Featured Item' : 'منتج مميز'}</span>
                  </label>
                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900/60 pt-6">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 border border-zinc-300 dark:border-zinc-800 rounded-xl uppercase tracking-wider cursor-pointer"
              >
                {currentLang === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              
              <button
                type="submit"
                disabled={formSubmitting || compressionLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-red-650 hover:bg-red-755 disabled:bg-zinc-200 dark:disabled:bg-zinc-850 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{formSubmitting
                  ? (currentLang === 'en' ? 'Saving...' : 'جاري الحفظ...')
                  : (currentLang === 'en' ? 'Save Product' : 'حفظ المنتج')}</span>
              </button>
            </div>

          </form>

        </div>

      )}

    </div>
  );
}
