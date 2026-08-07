import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { apiRequest } from '../services/api';
import { Phone, Mail, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    
    // Prevent double clicks
    if (submitting) return;

    const { name, email: emailVal, phone: phoneVal, message } = formData;

    // Front-end validations
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
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
          {t('contact.title')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {currentLang === 'en' 
            ? 'Have a question or want to book an appointment? Get in touch with us.' 
            : 'لديك استفسار أو ترغب في حجز موعد؟ تواصل معنا مباشرة.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact details card */}
        <div className="bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm h-fit space-y-6 transition-colors">
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800">
            {currentLang === 'en' ? 'Store Info' : 'معلومات المحل'}
          </h2>

          <div className="space-y-4">
            {phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentLang === 'en' ? 'Call Us' : 'اتصل بنا'}
                  </h3>
                  <a href={`tel:${phone}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-500 transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {whatsapp && (
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentLang === 'en' ? 'WhatsApp' : 'واتساب'}
                  </h3>
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-green-500 transition-colors"
                  >
                    {currentLang === 'en' ? 'Start WhatsApp Chat' : 'بدء محادثة واتساب'}
                  </a>
                </div>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentLang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                  </h3>
                  <a href={`mailto:${email}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-500 transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            )}

            {address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {currentLang === 'en' ? 'Location' : 'الموقع'}
                  </h3>
                  <span className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Contact form card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm transition-colors">
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800 mb-6">
            {currentLang === 'en' ? 'Send Us a Message' : 'أرسل لنا رسالة'}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Feedback notifications */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-900">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-55 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-xl text-sm border border-green-200 dark:border-green-900">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{t('contact.form.success')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-bold text-gray-700 dark:text-gray-350 uppercase tracking-wider">
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
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-350 uppercase tracking-wider">
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
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="phone" className="text-xs font-bold text-gray-700 dark:text-gray-350 uppercase tracking-wider">
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
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="message" className="text-xs font-bold text-gray-700 dark:text-gray-350 uppercase tracking-wider">
                  {t('contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder={currentLang === 'en' ? 'Describe your request here...' : 'اكتب تفاصيل طلبك هنا...'}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white font-bold rounded-xl shadow hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? t('contact.form.submitting') : t('contact.form.submit')}</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
