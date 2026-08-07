import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  Users, UserPlus, KeyRound, Shield, Trash2, 
  ArrowLeftRight, AlertCircle, CheckCircle2, RefreshCw, X 
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
          ? 'Super Admin role transferred successfully. Reloading profile...' 
          : 'تم نقل صلاحيات المدير العام بنجاح. جاري تحديث بيانات الجلسة...');
        
        // Update local session role
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-250 dark:border-gray-855 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-950 dark:text-white uppercase tracking-wider">
            {currentLang === 'en' ? 'Admin Accounts Management' : 'إدارة حسابات المشرفين'}
          </h1>
          <p className="text-xs text-gray-400">
            {currentLang === 'en' ? 'Manage admin panel access credentials and promote super admins.' : 'إدارة بيانات حسابات الدخول إلى لوحة التحكم ونقل صلاحيات المشرفين.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {otherAdmins.length > 0 && (
            <button
              onClick={() => {
                setShowTransferForm(true);
                setShowCreateForm(false);
                setFormError(null);
                setFormSuccess(null);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
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
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-650 hover:bg-red-755 rounded-xl shadow cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'New Admin' : 'مشرف جديد'}</span>
          </button>
        </div>
      </div>

      {/* Forms Popups / Drawer overlay */}
      {(showCreateForm || showTransferForm) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#16181c] w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-gray-150 dark:border-gray-800">
            
            <button 
              onClick={() => {
                setShowCreateForm(false);
                setShowTransferForm(false);
              }}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* --- Form 1: Create Admin --- */}
            {showCreateForm && (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-150 dark:border-gray-850 flex items-center gap-1.5">
                  <UserPlus className="w-4.5 h-4.5 text-red-500" />
                  <span>{currentLang === 'en' ? 'Create Admin Account' : 'إنشاء حساب مشرف جديد'}</span>
                </h2>

                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-450 uppercase">Full Name</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="px-3 py-2 bg-gray-55 dark:bg-gray-900 border border-gray-305 dark:border-gray-705 rounded-lg text-sm text-gray-950 dark:text-white" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-455 uppercase">Username</label>
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="px-3 py-2 bg-gray-55 dark:bg-gray-900 border border-gray-305 dark:border-gray-705 rounded-lg text-sm text-gray-950 dark:text-white" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-455 uppercase">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 bg-gray-55 dark:bg-gray-900 border border-gray-305 dark:border-gray-705 rounded-lg text-sm text-gray-955 dark:text-white" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-455 uppercase">Initial Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="px-3 py-2 bg-gray-55 dark:bg-gray-900 border border-gray-305 dark:border-gray-705 rounded-lg text-sm text-gray-955 dark:text-white" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-455 uppercase">Administrative Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 bg-gray-55 dark:bg-gray-900 border border-gray-305 dark:border-gray-705 rounded-lg text-sm text-gray-955 dark:text-white cursor-pointer">
                    <option value="admin">Standard Admin (No settings/carousel edits)</option>
                    <option value="super_admin">Super Admin (Full management access)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-150 dark:border-gray-850">
                  <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-500 rounded-lg text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={formSubmitting} className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white rounded-lg text-xs font-bold">
                    {formSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}

            {/* --- Form 2: Transfer Super Admin Role --- */}
            {showTransferForm && (
              <form onSubmit={handleTransferRole} className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-150 dark:border-gray-850 flex items-center gap-1.5">
                  <ArrowLeftRight className="w-4.5 h-4.5 text-blue-500" />
                  <span>{currentLang === 'en' ? 'Transfer Super Admin Role' : 'نقل منصب المدير العام'}</span>
                </h2>

                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                    <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <p className="text-xs text-gray-400 leading-relaxed">
                  {currentLang === 'en'
                    ? 'Select a standard admin account to promote to Super Admin. Your account will automatically demote to standard admin. This is transaction-safe and atomic.'
                    : 'اختر أحد المشرفين الحاليين لترقيته إلى مدير عام. سيتم خفض مستوى حسابك تلقائياً إلى مشرف عادي.'}
                </p>

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] font-bold text-gray-455 uppercase">Target Admin Account</label>
                  <select 
                    value={selectedAdminId} 
                    onChange={(e) => setSelectedAdminId(e.target.value)} 
                    className="px-3 py-2 bg-gray-55 dark:bg-gray-900 border border-gray-305 dark:border-gray-705 rounded-lg text-sm text-gray-955 dark:text-white cursor-pointer"
                  >
                    <option value="">-- Choose Admin Account --</option>
                    {otherAdmins.map(a => (
                      <option key={a.id} value={a.id}>{a.fullName} (@{a.username})</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-150 dark:border-gray-850">
                  <button type="button" onClick={() => setShowTransferForm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-500 rounded-lg text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={formSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold">
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
        <div className="text-center py-12 text-sm text-gray-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading admin accounts...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-955/20 text-red-400 rounded-xl text-sm border border-red-900/50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <table className="w-full text-left rtl:text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/10 text-gray-500 font-semibold text-xs tracking-wider uppercase">
                <th className="px-6 py-4">{currentLang === 'en' ? 'Admin Profile' : 'الملف'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Username' : 'اسم المستخدم'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Email' : 'البريد الإلكتروني'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Role' : 'الصلاحية'}</th>
                <th className="px-6 py-4 text-center">{currentLang === 'en' ? 'Actions' : 'العمليات'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {admins.map(a => (
                <tr key={a.id} className="hover:bg-gray-55/30 dark:hover:bg-gray-800/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {a.fullName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    @{a.username}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {a.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      a.role === 'super_admin' 
                        ? 'bg-red-500/10 text-red-500' 
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {a.role === 'super_admin' ? (currentLang === 'en' ? 'Super Admin' : 'مدير عام') : (currentLang === 'en' ? 'Admin' : 'مشرف')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {a.id !== currentAdmin.id ? (
                      <button
                        onClick={() => handleDeleteAdmin(a.id, a.fullName)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
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
