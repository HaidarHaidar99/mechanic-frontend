import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { apiRequest } from '../../services/api';
import { 
  User, KeyRound, Mail, AlertCircle, CheckCircle2, 
  Trash2, ShieldCheck, Eye, EyeOff, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { admin, setAdmin, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Profile info states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Status alerts
  const [infoSubmitting, setInfoSubmitting] = useState(false);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [infoError, setInfoError] = useState(null);
  const [infoSuccess, setInfoSuccess] = useState(null);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(null);

  // Populate data
  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName || '');
      setUsername(admin.username || '');
      setEmail(admin.email || '');
    }
  }, [admin]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (infoSubmitting) return;

    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setInfoError(currentLang === 'en' ? 'All fields are required' : 'جميع الحقول مطلوبة');
      return;
    }

    try {
      setInfoSubmitting(true);
      setInfoError(null);
      setInfoSuccess(null);

      const res = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase()
        })
      });

      if (res.success && res.data) {
        setInfoSuccess(currentLang === 'en' ? 'Profile updated successfully' : 'تم تحديث الملف الشخصي بنجاح');
        setAdmin(res.data); // Update context state
      } else {
        throw new Error(res.message || 'Profile update failed');
      }

    } catch (err) {
      console.error(err);
      setInfoError(err.message || 'Error occurred while saving profile info');
    } finally {
      setInfoSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdSubmitting) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError(currentLang === 'en' ? 'All password fields are required' : 'جميع حقول كلمة المرور مطلوبة');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError(currentLang === 'en' ? 'New passwords do not match' : 'كلمات المرور الجديدة غير متطابقة');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError(currentLang === 'en' ? 'Password must be at least 6 characters' : 'يجب أن لا تقل كلمة المرور عن 6 أحرف');
      return;
    }

    try {
      setPwdSubmitting(true);
      setPwdError(null);
      setPwdSuccess(null);

      const res = await apiRequest('/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (res.success) {
        setPwdSuccess(currentLang === 'en' ? 'Password changed successfully' : 'تم تغيير كلمة المرور بنجاح');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(res.message || 'Failed to change password');
      }

    } catch (err) {
      console.error(err);
      setPwdError(err.message || 'Error changing password');
    } finally {
      setPwdSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMsg = currentLang === 'en'
      ? 'WARNING: This will permanently delete your admin account. Are you sure you want to proceed?'
      : 'تحذير: سيتم حذف حساب المشرف الخاص بك نهائياً. هل أنت متأكد من المتابعة؟';

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await apiRequest('/profile', {
        method: 'DELETE'
      });

      if (res.success) {
        alert(currentLang === 'en' ? 'Account deleted successfully. Logging out...' : 'تم حذف الحساب بنجاح. جاري تسجيل الخروج...');
        logout();
        navigate('/admin', { replace: true });
      } else {
        throw new Error(res.message || 'Self deletion failed');
      }

    } catch (err) {
      console.error(err);
      alert(err.message || 'Error deleting account');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-4">
        <h1 className="text-xl font-bold text-zinc-950 dark:text-white uppercase tracking-wider font-heading">
          {currentLang === 'en' ? 'My Admin Profile' : 'ملفي الشخصي كمشرف'}
        </h1>
        <p className="text-xs text-zinc-400">
          {currentLang === 'en' ? 'Manage your personal details, credentials, and password settings.' : 'إدارة بياناتك الشخصية، وبيانات تسجيل الدخول، وكلمة المرور.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Info Edit Pane */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
          <h2 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center gap-1.5 font-heading">
            <User className="w-4 h-4" />
            <span>{currentLang === 'en' ? 'Profile Details' : 'البيانات الشخصية'}</span>
          </h2>

          <form onSubmit={handleInfoSubmit} className="space-y-4">
            {infoError && (
              <div className="flex items-center gap-2 p-3.5 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50 font-sans">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{infoError}</span>
              </div>
            )}
            
            {infoSuccess && (
              <div className="flex items-center gap-2 p-3.5 bg-green-955/20 text-green-400 rounded-xl text-xs border border-green-900/50 font-sans">
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{infoSuccess}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Username (Unique)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Email Address (Unique)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={infoSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-755 disabled:bg-zinc-250 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{infoSubmitting ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Password Edit Pane */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors space-y-6">
          
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-red-500 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center gap-1.5 font-heading">
              <KeyRound className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}</span>
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {pwdError && (
                <div className="flex items-center gap-2 p-3.5 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50 font-sans">
                  <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}
              
              {pwdSuccess && (
                <div className="flex items-center gap-2 p-3.5 bg-green-955/20 text-green-400 rounded-xl text-xs border border-green-900/50 font-sans">
                  <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute inset-y-0 right-3 rtl:left-3 rtl:right-auto flex items-center text-zinc-400 hover:text-zinc-500 dark:hover:text-white cursor-pointer"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-zinc-555 dark:text-zinc-400 uppercase tracking-widest">Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-955 dark:text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwdSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-755 disabled:bg-zinc-250 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{pwdSubmitting ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Delete Account Block */}
          <div className="border-t border-zinc-100 dark:border-zinc-900/60 pt-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-500 font-heading">
              {currentLang === 'en' ? 'Danger Zone' : 'منطقة الخطر'}
            </h3>
            <p className="text-xs text-zinc-450">
              {currentLang === 'en'
                ? 'Permanently delete your admin account. If you are the active Super Admin, you must transfer your role to another admin first.'
                : 'حذف حساب المشرف الخاص بك نهائياً. إذا كنت المدير العام، يجب عليك نقل منصبك لمشرف آخر أولاً.'}
            </p>
            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-1 px-4 py-2 border border-red-500 hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Delete My Account' : 'حذف حسابي'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
