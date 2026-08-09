import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsContext';
import { apiRequest } from '../services/api';
import { Phone, Mail, MapPin, Send, MessageSquare, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import Container from '../components/common/Container';
import SectionHeader from '../components/common/SectionHeader';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

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
    <Container className="py-8 space-y-12">
      
      {/* Header */}
      <SectionHeader 
        category={currentLang === 'en' ? 'Support Desk' : 'مكتب الدعم'}
        title={t('nav.contact')}
        subtitle={currentLang === 'en' 
          ? 'Have a question or want to book an appointment? Get in touch with us.' 
          : 'لديك استفسار أو ترغب في حجز موعد؟ تواصل معنا مباشرة.'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Contact details card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 shadow-sm space-y-8">
          
          <h2 className="text-sm font-extrabold text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading uppercase tracking-widest">
            {currentLang === 'en' ? 'Direct Contact' : 'الاتصال المباشر'}
          </h2>

          <div className="space-y-6">
            {phone && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'Call Us' : 'اتصل بنا'}
                  </h3>
                  <a href={`tel:${phone}`} className="text-xs sm:text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {whatsapp && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl shrink-0">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'WhatsApp' : 'واتساب'}
                  </h3>
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs sm:text-sm font-bold text-[var(--text-primary)] hover:text-green-600 transition-colors"
                  >
                    {currentLang === 'en' ? 'Start WhatsApp Chat' : 'بدء محادثة واتساب'}
                  </a>
                </div>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                  </h3>
                  <a href={`mailto:${email}`} className="text-xs sm:text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            )}

            {address && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">
                    {currentLang === 'en' ? 'Location' : 'الموقع'}
                  </h3>
                  <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-relaxed">
                    {address}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Contact form card */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-sm">
          
          <h2 className="text-sm font-extrabold text-[var(--text-primary)] pb-3 border-b border-[var(--border)] mb-6 font-heading uppercase tracking-widest">
            {currentLang === 'en' ? 'Send Us a Message' : 'أرسل لنا رسالة'}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Feedback notifications */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl text-xs border border-[var(--danger)]/20 font-sans">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2.5 p-4 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-xs border border-[var(--success)]/20 font-sans">
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{t('contact.form.success')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <Input 
                label={t('contact.form.name')}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={currentLang === 'en' ? 'John Doe' : 'اسمك الكريم'}
              />

              {/* Email */}
              <Input 
                label={t('contact.form.email')}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="name@example.com"
              />

              {/* Phone */}
              <div className="sm:col-span-2">
                <Input 
                  label={t('contact.form.phone')}
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder={currentLang === 'en' ? '+962790000000' : 'رقم هاتفك'}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="message" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block font-heading">
                  {t('contact.form.message')} <span className="text-[var(--danger)]">*</span>
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder={currentLang === 'en' ? 'Describe your request here...' : 'اكتب تفاصيل طلبك هنا...'}
                  className="px-4 py-3 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs placeholder-[var(--input-placeholder)] focus:outline-none focus:border-[var(--input-focus)] focus:ring-4 focus:ring-[var(--input-focus)]/10 transition-all resize-none font-sans"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={Send}
              >
                {t('contact.form.submit')}
              </Button>
            </div>

          </form>

        </div>

      </div>

    </Container>
  );
}
