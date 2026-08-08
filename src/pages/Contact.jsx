import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { apiRequest } from '../services/api';
import { Phone, Mail, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const currentLang = i18n.language || 'en';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const phone = settings ? settings.phone : '';
  const email = settings ? settings.email : '';
  const address = settings ? settings.address[currentLang] : '';
  const whatsapp = settings ? settings.whatsapp : '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const { name, email: emailVal, phone: phoneVal, message } = formData;

    if (!name.trim() || !emailVal.trim() || !phoneVal.trim() || !message.trim()) {
      setErrorMsg(currentLang === 'en' ? 'All fields are required' : 'جميع الحقول مطلوبة');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal.trim())) {
      setErrorMsg(currentLang === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (name.trim().length > 100) {
      setErrorMsg(currentLang === 'en' ? 'Name must be under 100 characters' : 'الاسم يجب أن يكون أقل من 100 حرف');
      return;
    }

    if (message.trim().length > 2000) {
      setErrorMsg(currentLang === 'en' ? 'Message must be under 2000 characters' : 'الرسالة يجب أن تكون أقل من 2000 حرف');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      setSuccess(false);

      const res = await apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: emailVal.trim(),
          phone: phoneVal.trim(),
          message: message.trim()
        })
      });

      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(res.message || 'Failed to send message');
      }

    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMsg(err.message || (currentLang === 'en' ? 'Something went wrong. Please try again later.' : 'حدث خطأ ما، يرجى المحاولة لاحقاً.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-heading">
          {currentLang === 'en' ? 'Support Desk' : 'مكتب الدعم'}
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight mt-1 font-heading">
          {t('contact.title')}
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-450 mt-1 max-w-xl">
          {currentLang === 'en' 
            ? 'Have a question or want to book an appointment? Get in touch with us.' 
            : 'لديك استفسار أو ترغب في حجز موعد؟ تواصل معنا مباشرة.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Contact details card */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-zinc-900/60 rounded-3xl p-8 shadow-sm space-y-8 transition-colors">
          
          <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-900/60 font-heading">
            {currentLang === 'en' ? 'Direct Contact' : 'الاتصال المباشر'}
          </h2>

          <div className="space-y-6">
            {phone && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                  <Phone className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'Call Us' : 'اتصل بنا'}
                  </h3>
                  <a href={`tel:${phone}`} className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white hover:text-red-500 transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {whatsapp && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                  <MessageSquare className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'WhatsApp' : 'واتساب'}
                  </h3>
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white hover:text-green-500 transition-colors"
                  >
                    {currentLang === 'en' ? 'Start WhatsApp Chat' : 'بدء محادثة واتساب'}
                  </a>
                </div>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                  <Mail className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                  </h3>
                  <a href={`mailto:${email}`} className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white hover:text-red-500 transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            )}

            {address && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                  <MapPin className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'Location' : 'الموقع'}
                  </h3>
                  <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Contact form card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-zinc-900/60 rounded-3xl p-8 sm:p-10 shadow-sm transition-colors">
          
          <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-900/60 mb-6 font-heading">
            {currentLang === 'en' ? 'Send Us a Message' : 'أرسل لنا رسالة'}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Feedback notifications */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-4 bg-red-955/20 text-red-400 rounded-xl text-xs border border-red-900/50">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-955/20 text-green-400 rounded-xl text-xs border border-green-900/50">
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{t('contact.form.success')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">
                  {t('contact.form.name')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={currentLang === 'en' ? 'John Doe' : 'اسمك الكريم'}
                  className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-sans"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">
                  {t('contact.form.email')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="name@example.com"
                  className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-sans"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="phone" className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">
                  {t('contact.form.phone')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder={currentLang === 'en' ? '+962790000000' : 'رقم هاتفك'}
                  className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-sans"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="message" className="text-[10px] font-black text-zinc-550 dark:text-zinc-400 uppercase tracking-widest">
                  {t('contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder={currentLang === 'en' ? 'Describe your request here...' : 'اكتب تفاصيل طلبك هنا...'}
                  className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-none font-sans"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-650 hover:bg-red-755 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm hover:shadow active:scale-98"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('contact.form.submitting')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('contact.form.submit')}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
