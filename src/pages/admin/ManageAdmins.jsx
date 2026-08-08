import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  Users, UserPlus, KeyRound, Shield, Trash2, 
  ArrowLeftRight, AlertCircle, CheckCircle2, RefreshCw, X, Save
} from 'lucide-react';

export default function ManageAdmins() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { admin: currentAdmin, setAdmin: setCurrentAdminState } = useAdminAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form toggles
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Create form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  // Transfer form states
  const [selectedAdminId, setSelectedAdminId] = useState('');

  // Status alerts
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchAdminsList = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/admins');
      if (res.success) {
        setAdmins(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch admin list');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load admin accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminsList();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setFormError(currentLang === 'en' ? 'All fields are required' : 'جميع الحقول مطلوبة');
      return;
    }

    if (password.length < 6) {
      setFormError(currentLang === 'en' ? 'Password must be at least 6 characters' : 'يجب أن لا تقل كلمة المرور عن 6 أحرف');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);
      setFormSuccess(null);

      const res = await apiRequest('/admins', {
        method: 'POST',
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password,
          role
        })
      });

      if (res.success) {
        setFormSuccess(currentLang === 'en' ? 'Admin account created successfully' : 'تم إنشاء حساب المشرف بنجاح');
        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('admin');
        setShowCreateForm(false);
        fetchAdminsList();
      } else {
        throw new Error(res.message || 'Creation failed');
      }

    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Error occurred while creating admin account');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id, nameStr) => {
    if (id === currentAdmin.id) {
      alert(currentLang === 'en' 
        ? 'You cannot delete your own account from this tab. Go to your Profile settings.' 
        : 'لا يمكنك حذف حسابك الشخصي من هذه الصفحة. توجه لإعدادات الملف الشخصي.');
      return;
    }

    const confirmMsg = currentLang === 'en'
      ? `Are you sure you want to delete admin account "${nameStr}"?`
      : `هل أنت متأكد من حذف حساب المشرف "${nameStr}"؟`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const res = await apiRequest(`/admins/${id}`, {
        method: 'DELETE'
      });

      if (res.success) {
        fetchAdminsList();
      } else {
        throw new Error(res.message || 'Failed to delete admin');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not delete admin account');
      setLoading(false);
    }
  };

  const handleTransferRole = async (e) => {
    e.preventDefault();
    if (formSubmitting) return;

    if (!selectedAdminId) {
      setFormError(currentLang === 'en' ? 'Please select an admin' : 'يرجى اختيار مشرف');
      return;
    }

    const targetAdmin = admins.find(a => a.id === selectedAdminId);
    const targetName = targetAdmin ? targetAdmin.fullName : '';

    const confirmMsg = currentLang === 'en'
      ? `WARNING: You are about to transfer the Super Admin role to "${targetName}". This will demote your account to a standard Admin role and reload the session. Do you want to proceed?`
      : `تحذير: أنت على وشك نقل صلاحيات المدير العام للمشرف "${targetName}". هذا سيؤدي لخفض مستوى حسابك إلى مشرف عادي وإعادة تحميل الجلسة. هل تريد الاستمرار؟`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setFormSubmitting(true);
      setFormError(null);
      setFormSuccess(null);

      const res = await apiRequest('/admins/transfer', {
        method: 'POST',
        body: JSON.stringify({ newSuperAdminId: selectedAdminId })
      });

      if (res.success) {
        alert(currentLang === 'en' 
          ? 'Super Admin role transferred successfully. Demoting account...' 
          : 'تم نقل صلاحيات المدير العام بنجاح. جاري تعديث الجلسة...');
        
        setCurrentAdminState(prev => ({ ...prev, role: 'admin' }));
        setShowTransferForm(false);
        fetchAdminsList();
      } else {
        throw new Error(res.message || 'Transfer failed');
      }

    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Error transferring role');
    } finally {
      setFormSubmitting(false);
    }
  };

  const otherAdmins = admins.filter(a => a.id !== currentAdmin.id && a.role === 'admin');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">
            {currentLang === 'en' ? 'Admin Accounts Management' : 'إدارة حسابات المشرفين'}
          </h1>
          <p className="text-xs text-zinc-400">
            {currentLang === 'en' ? 'Manage admin panel access credentials and promote super admins.' : 'إدارة بيانات حسابات الدخول إلى لوحة التحكم ونقل صلاحيات المشرفين.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {otherAdmins.length > 0 && (
            <button
              onClick={() => {
                setShowTransferForm(true);
                setShowCreateForm(false);
                setFormError(null);
                setFormSuccess(null);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-350 cursor-pointer transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Transfer Role' : 'نقل الصلاحية'}</span>
            </button>
          )}

          <button
            onClick={() => {
              setShowCreateForm(true);
              setShowTransferForm(false);
              setFormError(null);
              setFormSuccess(null);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-650 hover:bg-red-755 rounded-xl shadow cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'New Admin' : 'مشرف جديد'}</span>
          </button>
        </div>
      </div>

      {/* Forms Popups / Drawer overlay */}
      {(showCreateForm || showTransferForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#121215] w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-zinc-200 dark:border-zinc-900 animate-scale-up">
            
            <button 
              onClick={() => {
                setShowCreateForm(false);
                setShowTransferForm(false);
              }}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 rounded-full cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* --- Form 1: Create Admin --- */}
            {showCreateForm && (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <h2 className="text-base font-bold text-zinc-950 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center gap-1.5 font-heading">
                  <UserPlus className="w-4.5 h-4.5 text-red-500" />
                  <span>{currentLang === 'en' ? 'Create Admin Account' : 'إنشاء حساب مشرف جديد'}</span>
                </h2>

                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Username</label>
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Initial Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Administrative Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-955 dark:text-white cursor-pointer font-sans">
                    <option value="admin">Standard Admin (No settings/carousel edits)</option>
                    <option value="super_admin">Super Admin (Full management access)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={formSubmitting} className="inline-flex items-center gap-1 px-4 py-2 bg-red-650 hover:bg-red-755 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow">
                    <Save className="w-3.5 h-3.5" />
                    <span>{formSubmitting ? 'Creating...' : 'Create Account'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* --- Form 2: Transfer Super Admin Role --- */}
            {showTransferForm && (
              <form onSubmit={handleTransferRole} className="space-y-4">
                <h2 className="text-base font-bold text-zinc-955 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center gap-1.5 font-heading">
                  <ArrowLeftRight className="w-4.5 h-4.5 text-blue-500" />
                  <span>{currentLang === 'en' ? 'Transfer Super Admin Role' : 'نقل منصب المدير العام'}</span>
                </h2>

                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                  {currentLang === 'en'
                    ? 'Select a standard admin account to promote to Super Admin. Your account will automatically demote to standard admin. This is transaction-safe and atomic.'
                    : 'اختر أحد المشرفين الحاليين لترقيته إلى مدير عام. سيتم خفض مستوى حسابك تلقائياً إلى مشرف عادي.'}
                </p>

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Target Admin Account</label>
                  <select 
                    value={selectedAdminId} 
                    onChange={(e) => setSelectedAdminId(e.target.value)} 
                    className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-955 dark:text-white cursor-pointer font-sans"
                  >
                    <option value="">-- Choose Admin Account --</option>
                    {otherAdmins.map(a => (
                      <option key={a.id} value={a.id}>{a.fullName} (@{a.username})</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                  <button type="button" onClick={() => setShowTransferForm(false)} className="px-4 py-2 border border-zinc-300 dark:border-zinc-800 text-zinc-500 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={formSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow">
                    {formSubmitting ? 'Transferring...' : 'Transfer Role Now'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Admins List Table */}
      {loading ? (
        <div className="text-center py-12 text-xs text-zinc-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4.5 h-4.5 animate-spin" />
          <span>Loading admin accounts...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-sm transition-colors">
          <table className="w-full text-left rtl:text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/10 text-zinc-400 font-semibold text-xs tracking-wider uppercase">
                <th className="px-6 py-4">{currentLang === 'en' ? 'Admin Profile' : 'الملف'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Username' : 'اسم المستخدم'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Email' : 'البريد الإلكتروني'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Role' : 'الصلاحية'}</th>
                <th className="px-6 py-4 text-center">{currentLang === 'en' ? 'Actions' : 'العمليات'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {admins.map(a => (
                <tr key={a.id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white font-heading">
                    {a.fullName}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    @{a.username}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    {a.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider ${
                      a.role === 'super_admin' 
                        ? 'bg-red-500/10 text-red-500' 
                        : 'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      <Shield className="w-3 h-3 shrink-0" />
                      {a.role === 'super_admin' ? (currentLang === 'en' ? 'Super Admin' : 'مدير عام') : (currentLang === 'en' ? 'Admin' : 'مشرف')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    {a.id !== currentAdmin.id ? (
                      <button
                        onClick={() => handleDeleteAdmin(a.id, a.fullName)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest">
                        {currentLang === 'en' ? 'You' : 'أنت'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
