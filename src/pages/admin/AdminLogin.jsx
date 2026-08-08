import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Wrench, ShieldAlert, KeyRound, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  const { admin, login, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'en';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (!authLoading && admin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [admin, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!email.trim() || !password.trim()) {
      setErrorMsg(currentLang === 'en' ? 'Email and password are required' : 'البريد الإلكتروني وكلمة المرور مطلوبان');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await login(email.trim(), password.trim());
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      setErrorMsg(err.message || (currentLang === 'en' ? 'Invalid credentials' : 'بيانات الدخول غير صحيحة'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-xs font-black uppercase tracking-widest text-zinc-500 animate-pulse font-heading">
          Loading authentication gateway...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-650/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex p-3.5 bg-red-500/10 rounded-2xl border border-red-500/20">
          <Wrench className="w-8 h-8 text-red-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-wider uppercase font-heading">
          {currentLang === 'en' ? 'Admin Gateway' : 'بوابة الإدارة'}
        </h2>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          {currentLang === 'en' ? 'Authorized personnel access only' : 'مخصص للموظفين المصرح لهم فقط'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#121215] py-8 px-6 shadow-2xl rounded-3xl border border-zinc-900/60 sm:px-10">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-4 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                {currentLang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mechanic.com"
                  className="block w-full pl-10 pr-3.5 py-3 bg-zinc-950 border border-zinc-905 rounded-xl text-white text-xs placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                {currentLang === 'en' ? 'Password' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-zinc-950 border border-zinc-905 rounded-xl text-white text-xs placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-xs font-black uppercase tracking-widest text-white bg-red-650 hover:bg-red-755 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all cursor-pointer shadow-red-500/10 active:scale-98"
              >
                {submitting 
                  ? (currentLang === 'en' ? 'Logging in...' : 'جاري الدخول...') 
                  : (currentLang === 'en' ? 'Sign In' : 'تسجيل الدخول')}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
