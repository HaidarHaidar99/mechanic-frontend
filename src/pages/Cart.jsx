import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import IconButton from '../components/common/IconButton';
import Container from '../components/common/Container';
import EmptyState from '../components/common/EmptyState';
import { useScrollReveal } from '../hooks/useScrollReveal';

function AnimatedCartItem({ children, index }) {
  const itemRef = useScrollReveal({ once: false });
  return (
    <div ref={itemRef} style={{ transitionDelay: `${(index % 5) * 70}ms` }}>
      {children}
    </div>
  );
}

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const { settings } = useSettings();
  
  const summaryRef = useScrollReveal({ once: false });

  const currentLang = i18n.language || 'en';
  const total = getTotal();

  const handleCheckout = () => {
    if (!settings || !settings.whatsapp) {
      alert(currentLang === 'en' 
        ? 'WhatsApp checkout is temporarily unavailable. Missing shop details.' 
        : 'إتمام الشراء عبر واتساب غير متاح مؤقتاً لعدم توفر تفاصيل رقم المحل.');
      return;
    }

    const whatsappLink = buildWhatsAppLink(
      settings.whatsapp,
      cartItems,
      total,
      currentLang
    );

    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-20 flex items-center justify-center">
        <EmptyState 
          icon={ShoppingBag} 
          title={t('cart.empty')}
          description={currentLang === 'en' 
            ? 'Browse our catalogs and add genuine parts or services to your cart to checkout.'
            : 'تصفح قائمة المنتجات لدينا وأضف قطع الغيار أو الخدمات إلى سلتك لإتمام الطلب.'}
          actionText={currentLang === 'en' ? 'Start Shopping' : 'ابدأ التسوق'}
          actionLink={Link}
          actionTo="/products"
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
        <div>
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
            {currentLang === 'en' ? 'Shopping Cart' : 'حقيبة التسوق'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase tracking-tight mt-1 font-heading">
            {t('cart.title')}
          </h1>
          <p className="text-[11px] font-bold text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
            {cartItems.length} {t('cart.items')} {currentLang === 'en' ? 'in your cart' : 'في سلتك'}
          </p>
        </div>
        
        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1 text-[10px] font-black text-[var(--accent)] hover:text-red-750 uppercase tracking-widest cursor-pointer hover:underline font-heading"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('cart.clear')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list (Left side on Desktop, Stacked on Mobile) */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => {
            const name = item.name?.[currentLang] || item.name?.['en'] || '';
            const category = item.category ? (item.category[currentLang] || item.category['en'] || '') : '';
            const subtotal = item.price * item.quantity;
            
            return (
              <AnimatedCartItem key={item.id} index={index}>
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-4 sm:p-5 rounded-2xl border border-[var(--border)] shadow-sm hover:border-[var(--border-strong)] transition-all"
                >
                
                {/* Details left section */}
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-16 sm:w-20 aspect-square rounded-xl overflow-hidden bg-[var(--page-bg)] border border-[var(--border)] shrink-0">
                    <img 
                      src={item.imageBase64} 
                      alt={name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="min-w-0 space-y-1">
                    <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
                      {category}
                    </span>
                    <h3 className="text-sm font-extrabold text-[var(--text-primary)] line-clamp-1 font-heading uppercase">
                      {name}
                    </h3>
                    <div className="text-xs font-bold text-[var(--text-secondary)]">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Controls right section */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                  
                  {/* Quantity Modifier */}
                  <div className="flex items-center border border-[var(--border-strong)] rounded-xl overflow-hidden bg-[var(--surface-elevated)] shrink-0">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity > 1 ? item.quantity - 1 : 1)}
                      className="p-2 hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 text-xs font-extrabold text-[var(--text-primary)] font-heading">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal & Delete Action */}
                  <div className="text-right shrink-0 min-w-[90px]">
                    <div className="text-sm font-extrabold text-[var(--text-primary)] font-heading">
                      ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-bold text-[var(--danger)] hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer font-heading uppercase tracking-wider"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{currentLang === 'en' ? 'Remove' : 'حذف'}</span>
                    </button>
                  </div>

                </div>
              </div>
            </AnimatedCartItem>
          );
          })}
        </div>

        {/* Checkout Summary Card */}
        <div ref={summaryRef} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-24">
          <h2 className="text-base font-extrabold text-[var(--text-primary)] pb-3 border-b border-[var(--border)] font-heading uppercase tracking-widest">
            {currentLang === 'en' ? 'Order Summary' : 'ملخص الطلب'}
          </h2>

          <div className="space-y-4 text-xs font-bold text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span className="text-[var(--text-primary)] font-extrabold">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between border-t border-[var(--border)] pt-4 text-sm font-black text-[var(--text-primary)] font-heading">
              <span>{t('cart.total')}</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Warnings */}
          {(!settings || !settings.whatsapp) && (
            <div className="flex gap-2.5 p-4 bg-[var(--warning)]/10 text-[var(--warning)] rounded-2xl text-[10px] font-bold border border-[var(--warning)]/20 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {currentLang === 'en'
                  ? 'No WhatsApp phone number configured. Checkout is locked.'
                  : 'لم يتم تعيين رقم هاتف واتساب للمتجر في الإعدادات. إتمام الطلب مغلق.'}
              </span>
            </div>
          )}

          {/* Checkout Action Button */}
          <button
            onClick={handleCheckout}
            disabled={!settings || !settings.whatsapp}
            className="w-full inline-flex items-center justify-center gap-2.5 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-[var(--button-disabled-bg)] disabled:text-[var(--button-disabled-text)] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer font-heading border border-emerald-500/30"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-white shrink-0" />
            <span>{t('cart.checkout')}</span>
          </button>

          <p className="text-center text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-relaxed">
            {currentLang === 'en'
              ? 'No payment is required online. Your order will be sent to our WhatsApp, and our agent will follow up.'
              : 'لا يلزم الدفع عبر الإنترنت. سيتم إرسال طلبك إلى واتساب الخاص بنا، وسيقوم وكيلنا بمتابعة الطلب معك.'}
          </p>

        </div>

      </div>

    </Container>
  );
}
