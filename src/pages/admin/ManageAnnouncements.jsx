import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '../../contexts/AnnouncementsContext';
import { 
  Megaphone, Plus, Trash2, Edit2, CheckCircle, 
  AlertCircle, RefreshCw, X, ChevronUp, ChevronDown, Save 
} from 'lucide-react';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

export default function ManageAnnouncements() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const { 
    adminAnnouncements, loading, error, fetchAdminAnnouncements, 
    createAnnouncement, updateAnnouncement, deleteAnnouncement 
  } = useAnnouncements();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [textEn, setTextEn] = useState('');
  const [textAr, setTextAr] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [order, setOrder] = useState('1');

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
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            Top Banner Controls
          </span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
            {currentLang === 'en' ? 'Manage Announcements' : 'إدارة الإعلانات الترويجية'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {currentLang === 'en' ? 'Configure promotion bars rotating above the main navigation.' : 'تعديل وترتيب إعلانات الشريط العلوي التي تدور في واجهة الموقع.'}
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          variant="primary"
          icon={Plus}
        >
          {currentLang === 'en' ? 'New Announcement' : 'إضافة إعلان جديد'}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-xs font-bold border border-[var(--success)]/20">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Announcements Table */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent)]" />
          <span>Loading announcements...</span>
        </div>
      ) : adminAnnouncements.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-strong)] rounded-3xl bg-[var(--surface-elevated)]/30">
          <Megaphone className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">No announcements found. Add one to start.</p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] font-black text-[10px] tracking-wider uppercase">
                <th className="px-6 py-4">Display Order</th>
                <th className="px-6 py-4">Announcement Text (EN)</th>
                <th className="px-6 py-4 text-right rtl:text-left">نص الإعلان (AR)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {adminAnnouncements.map((item, idx) => (
                <tr key={item.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                  
                  {/* Order */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-[var(--surface-elevated)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg font-heading">
                        {item.order}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => handleOrderChange(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-30 rounded-lg cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleOrderChange(idx, 'down')}
                          disabled={idx === adminAnnouncements.length - 1}
                          className="p-1 hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-30 rounded-lg cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Text EN */}
                  <td className="px-6 py-4 font-bold text-[var(--text-primary)] max-w-xs truncate">
                    {item.text.en}
                  </td>

                  {/* Text AR */}
                  <td className="px-6 py-4 font-bold text-[var(--text-primary)] max-w-xs truncate text-right rtl:text-left" dir="rtl">
                    {item.text.ar}
                  </td>

                  {/* Toggle Visible Status */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleEnable(item)}
                      className="cursor-pointer"
                    >
                      <Badge variant={item.enabled ? 'success' : 'neutral'}>
                        {item.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <IconButton
                        icon={Edit2}
                        variant="ghost"
                        onClick={() => {
                          setEditingItem(item);
                          setTextEn(item.text.en);
                          setTextAr(item.text.ar);
                          setEnabled(item.enabled);
                          setOrder(item.order.toString());
                        }}
                        title="Edit announcement"
                      />
                      
                      <IconButton
                        icon={Trash2}
                        variant="ghost"
                        className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        onClick={() => handleDelete(item.id, item.text.en)}
                        title="Delete announcement"
                      />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal dialogues */}
      <Modal
        isOpen={showAddForm || !!editingItem}
        onClose={() => {
          setShowAddForm(false);
          setEditingItem(null);
          resetForm();
        }}
        title={showAddForm ? 'Add New Announcement' : 'Edit Announcement'}
      >
        <form onSubmit={showAddForm ? handleAddSubmit : handleEditSubmit} className="space-y-5">
          {actionError && (
            <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 rounded-xl text-xs font-bold font-sans">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Text EN */}
          <Input 
            label="Text (EN)"
            id="textEn"
            value={textEn}
            onChange={(e) => setTextEn(e.target.value)}
            required
            placeholder="Free delivery on orders over $150"
          />

          {/* Text AR */}
          <Input 
            label="النص (العربية)"
            id="textAr"
            value={textAr}
            onChange={(e) => setTextAr(e.target.value)}
            required
            dir="rtl"
            placeholder="شحن مجاني للطلبات فوق 150 دولار"
          />

          {/* Order */}
          <Input 
            label="Display Order"
            id="order"
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
          />

          {/* Enabled toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
            <input 
              type="checkbox" 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)} 
              className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]/10 cursor-pointer bg-[var(--surface-elevated)]" 
            />
            <span className="text-xs font-bold text-[var(--text-secondary)]">Visible on top banner immediately</span>
          </label>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={Save}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
