import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';
import { 
  Megaphone, Plus, Trash2, Edit2, CheckCircle, 
  AlertCircle, RefreshCw, X, ChevronUp, ChevronDown, Save
} from 'lucide-react';

export default function ManageAnnouncements() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const { 
    adminAnnouncements, loading, error, fetchAdminAnnouncements, 
    createAnnouncement, updateAnnouncement, deleteAnnouncement 
  } = useAnnouncements();

  // Dialog toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [textEn, setTextEn] = useState('');
  const [textAr, setTextAr] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [order, setOrder] = useState('1');

  // Submit alerts
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    fetchAdminAnnouncements();
  }, []);

  const resetForm = () => {
    setTextEn('');
    setTextAr('');
    setEnabled(true);
    setOrder((adminAnnouncements.length + 1).toString());
    setActionError(null);
    setActionSuccess(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!textEn.trim() || !textAr.trim() || order === '') {
      setActionError(currentLang === 'en' ? 'All fields are required' : 'جميع الحقول مطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      setActionError(null);
      
      const payload = {
        text: { en: textEn.trim(), ar: textAr.trim() },
        enabled,
        order: parseInt(order, 10)
      };

      await createAnnouncement(payload);
      setActionSuccess(currentLang === 'en' ? 'Announcement created successfully' : 'تم إضافة الإعلان بنجاح');
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setActionError(err.message || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!textEn.trim() || !textAr.trim() || order === '') {
      setActionError(currentLang === 'en' ? 'All fields are required' : 'جميع الحقول مطلوبة');
      return;
    }

    try {
      setSubmitting(true);
      setActionError(null);
      
      const payload = {
        text: { en: textEn.trim(), ar: textAr.trim() },
        enabled,
        order: parseInt(order, 10)
      };

      await updateAnnouncement(editingItem.id, payload);
      setActionSuccess(currentLang === 'en' ? 'Announcement updated successfully' : 'تم تحديث الإعلان بنجاح');
      setEditingItem(null);
      resetForm();
    } catch (err) {
      console.error(err);
      setActionError(err.message || 'Failed to update announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, textStr) => {
    const confirmMsg = currentLang === 'en'
      ? `Are you sure you want to delete announcement "${textStr}"?`
      : `هل أنت متأكد من حذف الإعلان "${textStr}"؟`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteAnnouncement(id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete announcement');
    }
  };

  const handleToggleEnable = async (item) => {
    try {
      const payload = {
        text: item.text,
        enabled: !item.enabled,
        order: item.order
      };
      await updateAnnouncement(item.id, payload);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to toggle visibility');
    }
  };

  const handleOrderChange = async (index, direction) => {
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= adminAnnouncements.length) return;

    const currentItem = adminAnnouncements[index];
    const targetItem = adminAnnouncements[nextIdx];

    try {
      // Swap order values atomically in API calls
      const currentOrder = currentItem.order;
      const targetOrder = targetItem.order;

      await updateAnnouncement(currentItem.id, {
        text: currentItem.text,
        enabled: currentItem.enabled,
        order: targetOrder
      });

      await updateAnnouncement(targetItem.id, {
        text: targetItem.text,
        enabled: targetItem.enabled,
        order: currentOrder
      });

    } catch (err) {
      console.error('Error swapping orders:', err);
      alert('Failed to reorder items');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">
            {currentLang === 'en' ? 'Manage Announcements' : 'إدارة الإعلانات الترويجية'}
          </h1>
          <p className="text-xs text-zinc-400">
            {currentLang === 'en' ? 'Configure promotion bars rotating above the main navigation.' : 'تعديل وترتيب إعلانات الشريط العلوي التي تدور في واجهة الموقع.'}
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-650 hover:bg-red-755 rounded-xl shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{currentLang === 'en' ? 'New Announcement' : 'إضافة إعلان جديد'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-xl text-sm border border-red-900/50">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-955/20 text-green-400 rounded-xl text-sm border border-green-900/50">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grid listing */}
      {loading ? (
        <div className="text-center py-12 text-sm text-zinc-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading announcements...</span>
        </div>
      ) : adminAnnouncements.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-3xl bg-white dark:bg-[#121215]/20">
          <Megaphone className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-550 dark:text-zinc-450 text-sm font-semibold">No announcements found. Add one to start.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-sm transition-colors">
          <table className="w-full text-left rtl:text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/10 text-zinc-400 font-semibold text-xs tracking-wider uppercase">
                <th className="px-6 py-4">Display Order</th>
                <th className="px-6 py-4">Announcement Text (EN)</th>
                <th className="px-6 py-4 text-right rtl:text-left">نص الإعلان (AR)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {adminAnnouncements.map((item, idx) => (
                <tr key={item.id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-colors">
                  
                  {/* Order controls */}
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded font-heading">
                        {item.order}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => handleOrderChange(idx, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 hover:bg-zinc-150 dark:hover:bg-zinc-800 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleOrderChange(idx, 'down')}
                          disabled={idx === adminAnnouncements.length - 1}
                          className="p-0.5 hover:bg-zinc-150 dark:hover:bg-zinc-800 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Text EN */}
                  <td className="px-6 py-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                    {item.text.en}
                  </td>

                  {/* Text AR */}
                  <td className="px-6 py-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-xs truncate text-right rtl:text-left" dir="rtl">
                    {item.text.ar}
                  </td>

                  {/* Enabled Toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleEnable(item)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider cursor-pointer ${
                        item.enabled 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-zinc-500/10 text-zinc-500'
                      }`}
                    >
                      {item.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setTextEn(item.text.en);
                          setTextAr(item.text.ar);
                          setEnabled(item.enabled);
                          setOrder(item.order.toString());
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit announcement"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(item.id, item.text.en)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popups Forms */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#121215] w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-zinc-200 dark:border-zinc-900 animate-scale-up">
            
            <button 
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                resetForm();
              }}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 rounded-full"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <form onSubmit={showAddForm ? handleAddSubmit : handleEditSubmit} className="space-y-5">
              
              <h2 className="text-base font-extrabold text-zinc-950 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center gap-1.5 font-heading">
                <Megaphone className="w-4.5 h-4.5 text-red-500" />
                <span>{showAddForm ? 'Add New Announcement' : 'Edit Announcement'}</span>
              </h2>

              {actionError && (
                <div className="flex items-center gap-2 p-3 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                  <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Text EN */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">Text (EN)</label>
                <input 
                  type="text" 
                  required 
                  value={textEn} 
                  onChange={(e) => setTextEn(e.target.value)} 
                  placeholder="Free installation today"
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" 
                />
              </div>

              {/* Text AR */}
              <div className="flex flex-col gap-1.5" dir="rtl">
                <label className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest text-right">النص (العربية)</label>
                <input 
                  type="text" 
                  required 
                  value={textAr} 
                  onChange={(e) => setTextAr(e.target.value)} 
                  placeholder="تركيب مجاني اليوم"
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" 
                />
              </div>

              {/* Order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Display Order</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={order} 
                  onChange={(e) => setOrder(e.target.value)} 
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" 
                />
              </div>

              {/* Enabled toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={enabled} 
                  onChange={(e) => setEnabled(e.target.checked)} 
                  className="w-4 h-4 rounded border-zinc-350 text-red-600 focus:ring-red-500 cursor-pointer" 
                />
                <span className="text-xs font-bold text-zinc-650 dark:text-zinc-300">Visible on top banner immediately</span>
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    resetForm();
                  }} 
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="inline-flex items-center gap-1 px-4 py-2 bg-red-650 hover:bg-red-755 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Saving...' : 'Save'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
