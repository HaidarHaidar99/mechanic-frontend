import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../services/api';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  Users, UserPlus, KeyRound, Shield, Trash2, 
  ArrowLeftRight, AlertCircle, CheckCircle2, RefreshCw, X, Save 
} from 'lucide-react';
import Button from '../../components/common/Button';
import IconButton from '../../components/common/IconButton';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

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
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            Team access keys
          </span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
            {currentLang === 'en' ? 'Admin Accounts Management' : 'إدارة حسابات المشرفين'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {currentLang === 'en' ? 'Manage admin panel access credentials and promote super admins.' : 'إدارة بيانات حسابات الدخول إلى لوحة التحكم ونقل صلاحيات المشرفين.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {otherAdmins.length > 0 && (
            <Button
              onClick={() => {
                setShowTransferForm(true);
                setShowCreateForm(false);
                setFormError(null);
                setFormSuccess(null);
              }}
              variant="secondary"
              icon={ArrowLeftRight}
            >
              {currentLang === 'en' ? 'Transfer Role' : 'نقل الصلاحية'}
            </Button>
          )}

          <Button
            onClick={() => {
              setShowCreateForm(true);
              setShowTransferForm(false);
              setFormError(null);
              setFormSuccess(null);
            }}
            variant="primary"
            icon={UserPlus}
          >
            {currentLang === 'en' ? 'New Admin' : 'مشرف جديد'}
          </Button>
        </div>
      </div>

      {formSuccess && (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-xs font-bold border border-[var(--success)]/20">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* List Table */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[var(--text-secondary)] flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent)]" />
          <span>Loading admin accounts...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs font-bold border border-[var(--danger)]/20">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] font-black text-[10px] tracking-wider uppercase">
                <th className="px-6 py-4">{currentLang === 'en' ? 'Admin Profile' : 'الملف'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Username' : 'اسم المستخدم'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Email' : 'البريد الإلكتروني'}</th>
                <th className="px-6 py-4">{currentLang === 'en' ? 'Role' : 'الصلاحية'}</th>
                <th className="px-6 py-4 text-center">{currentLang === 'en' ? 'Actions' : 'العمليات'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {admins.map(a => (
                <tr key={a.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="px-6 py-4 font-extrabold text-[var(--text-primary)] font-heading uppercase">
                    {a.fullName}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    @{a.username}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    {a.email}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={a.role === 'super_admin' ? 'primary' : 'neutral'} icon={Shield}>
                      {a.role === 'super_admin' ? (currentLang === 'en' ? 'Super Admin' : 'مدير عام') : (currentLang === 'en' ? 'Admin' : 'مشرف')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    {a.id !== currentAdmin.id ? (
                      <IconButton
                        icon={Trash2}
                        variant="ghost"
                        className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        onClick={() => handleDeleteAdmin(a.id, a.fullName)}
                        title="Delete account"
                      />
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
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

      {/* Add Admin Modal */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setFormError(null);
          setFormSuccess(null);
        }}
        title="Create Admin Account"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 rounded-xl text-xs font-bold font-sans">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input 
            label="Full Name"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input 
            label="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input 
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input 
            label="Initial Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Select 
            label="Administrative Role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'admin', label: 'Standard Admin' },
              { value: 'super_admin', label: 'Super Admin (Full Access)' }
            ]}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formSubmitting}
              icon={Save}
            >
              {formSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Transfer Super Admin Modal */}
      <Modal
        isOpen={showTransferForm}
        onClose={() => {
          setShowTransferForm(false);
          setFormError(null);
          setFormSuccess(null);
        }}
        title="Transfer Super Admin Role"
      >
        <form onSubmit={handleTransferRole} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 rounded-xl text-xs font-bold font-sans">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {currentLang === 'en'
              ? 'Select a standard admin account to promote to Super Admin. Your account will automatically demote to standard admin. This is transaction-safe and atomic.'
              : 'اختر أحد المشرفين الحاليين لترقيته إلى مدير عام. سيتم خفض مستوى حسابك تلقائياً إلى مشرف عادي.'}
          </p>

          <Select 
            label="Target Admin Account"
            id="transferTarget"
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            options={[
              { value: '', label: '-- Choose Admin Account --' },
              ...otherAdmins.map(a => ({ value: a.id, label: `${a.fullName} (@${a.username})` }))
            ]}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
            <Button
              variant="outline"
              onClick={() => setShowTransferForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formSubmitting}
            >
              Transfer Role Now
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
