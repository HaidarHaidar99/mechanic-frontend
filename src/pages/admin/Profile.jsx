import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { apiRequest } from '../../services/api';
import { 
  User, KeyRound, Mail, AlertCircle, CheckCircle2, 
  Trash2, ShieldCheck, Eye, EyeOff, Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Profile() {
  const { t, i18n } = useTranslation();
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
        setAdmin(res.data);
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
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (res.success) {
        setPwdSuccess(currentLang === 'en' ? 'Password changed successfully' : 'تم تغيير كلمة المرور بنجاح');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(res.message || 'Password change failed');
      }

    } catch (err) {
      console.error(err);
      setPwdError(err.message || 'Error occurred while changing password');
    } finally {
      setPwdSubmitting(false);
    }
  };

  const handleDeleteSelf = async () => {
    if (admin.role === 'super_admin') {
      alert(currentLang === 'en'
        ? 'As the Super Admin, you cannot delete your account. Transfer the super_admin role to another admin first.'
        : 'بصفتك المشرف العام، لا يمكنك حذف حسابك. قم بنقل رتبة المشرف العام إلى مشرف آخر أولاً.');
      return;
    }

    const firstConfirm = currentLang === 'en'
      ? 'WARNING: You are about to permanently delete your admin account. You will be logged out immediately. Proceed?'
      : 'تحذير: أنت على وشك حذف حساب المشرف الخاص بك نهائياً. سيتم تسجيل خروجك فوراً. هل تريد الاستمرار؟';

    if (!window.confirm(firstConfirm)) return;

    const secondConfirm = currentLang === 'en'
      ? 'Are you absolutely sure? This action is irreversible.'
      : 'هل أنت متأكد تماماً؟ هذا الإجراء لا يمكن التراجع عنه.';

    if (!window.confirm(secondConfirm)) return;

    try {
      const res = await apiRequest('/profile', {
        method: 'DELETE'
      });

      if (res.success) {
        logout();
        navigate('/admin/login');
      } else {
        throw new Error(res.message || 'Delete account failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error deleting account');
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
          Account control
        </span>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
          {t('admin.nav.profile') || 'My Profile'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {currentLang === 'en' ? 'Manage your personal admin credentials and password.' : 'إدارة بيانات حساب المشرف الخاص بك وكلمة المرور.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Profile Info Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading">
            Personal Details
          </h2>

          <form onSubmit={handleInfoSubmit} className="space-y-5">
            {infoError && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20 font-sans">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{infoError}</span>
              </div>
            )}
            
            {infoSuccess && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-xs font-bold border border-[var(--success)]/20 font-sans">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                <span>{infoSuccess}</span>
              </div>
            )}

            <Input 
              label="Full Name *"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input 
              label="Username *"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input 
              label="Email Address *"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={infoSubmitting}
                icon={Save}
              >
                Save Details
              </Button>
            </div>
          </form>
        </div>

        {/* Password Reset Form */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading">
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            {pwdError && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20 font-sans">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}
            
            {pwdSuccess && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-xs font-bold border border-[var(--success)]/20 font-sans">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            <Input 
              label="Current Password *"
              id="currentPassword"
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              icon={KeyRound}
            />

            <Input 
              label="New Password *"
              id="newPassword"
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              icon={KeyRound}
            />

            <Input 
              label="Confirm New Password *"
              id="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={KeyRound}
            />

            <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]/10 cursor-pointer bg-[var(--surface-elevated)]"
              />
              <span className="text-xs font-bold text-[var(--text-secondary)]">Show password values</span>
            </label>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={pwdSubmitting}
                icon={Save}
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>

      </div>

      {/* Danger Zone */}
      {admin && admin.role !== 'super_admin' && (
        <div className="bg-[var(--surface)] border border-[var(--danger)]/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[var(--border)] pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[var(--danger)] font-heading">
              Danger Zone
            </h2>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold uppercase tracking-wider">
              Irreversible account deletions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold text-[var(--text-primary)] font-heading">
                Delete My Admin Account
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Permanently delete your profile. You will lose access to this admin console immediately.
              </p>
            </div>

            <Button
              onClick={handleDeleteSelf}
              variant="danger"
              icon={Trash2}
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
