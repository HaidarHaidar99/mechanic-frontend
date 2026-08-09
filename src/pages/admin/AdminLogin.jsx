import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Wrench, ShieldAlert, KeyRound, User, Eye, EyeOff } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { admin, login, error: authError, clearError } = useAdminAuth();
  const currentLang = i18n.language || 'en';

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setValidationError('');
    clearError();

    if (!usernameOrEmail.trim() || !password.trim()) {
      setValidationError(currentLang === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول');
      return;
    }

    try {
      setLoading(true);
      await login(usernameOrEmail.trim(), password.trim());
    } catch (err) {
      console.error('Login action error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--page-bg)] p-4 sm:p-6 transition-all duration-300 font-sans">
      
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 animate-scale-up">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-[var(--accent)] text-white rounded-2xl shadow-md">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold uppercase tracking-widest text-[var(--text-primary)] font-heading">
            {currentLang === 'en' ? 'Admin Portal' : 'بوابة المشرف'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
            {currentLang === 'en' ? 'Enter credentials to access console' : 'أدخل بيانات الاعتماد للوصول للوحة التحكم'}
          </p>
        </div>

        {/* Form panel */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Validation / Auth errors */}
          {(validationError || authError) && (
            <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 rounded-xl text-xs font-bold font-sans">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
              <span>{validationError || authError}</span>
            </div>
          )}

          {/* Username / Email */}
          <Input 
            label={currentLang === 'en' ? 'Username or Email' : 'اسم المستخدم أو البريد'}
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            icon={User}
            placeholder={currentLang === 'en' ? 'admin / admin@example.com' : 'اسم المستخدم أو البريد'}
          />

          {/* Password */}
          <div className="relative">
            <Input 
              label={currentLang === 'en' ? 'Password' : 'كلمة المرور'}
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={KeyRound}
              placeholder="••••••••"
            />
            {/* Show / Hide toggle button inside input wrapper */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-8.5 rtl:right-auto rtl:left-3.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Login Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3.5"
            >
              {currentLang === 'en' ? 'Sign In' : 'تسجيل الدخول'}
            </Button>
          </div>

        </form>

      </div>

    </div>
  );
}
