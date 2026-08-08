import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const { settings } = useSettings();
  
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
      <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-6 text-center max-w-md mx-auto py-12 animate-fade-in">
        <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-400 dark:text-zinc-600 animate-pulse">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white font-heading uppercase tracking-tight">
            {t('cart.empty')}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed">
            {currentLang === 'en' 
              ? 'Browse our catalogs and add genuine parts or services to your cart to checkout.'
              : 'تصفح قائمة المنتجات لدينا وأضف قطع الغيار أو الخدمات إلى سلتك لإتمام الطلب.'}
          </p>
        </div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-red-650 hover:bg-red-755 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-102 cursor-pointer shadow-md shadow-red-500/10"
        >
          <span>{currentLang === 'en' ? 'Start Shopping' : 'ابدأ التسوق'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-5">
        <div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block font-heading">
            {currentLang === 'en' ? 'Shopping Cart' : 'حقيبة التسوق'}
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white uppercase tracking-tight mt-1 font-heading">
            {t('cart.title')}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1 font-bold">
            {cartItems.length} {t('cart.items')} {currentLang === 'en' ? 'in your cart' : 'في سلتك'}
          </p>
        </div>
        
        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1 text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest cursor-pointer hover:underline"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('cart.clear')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const name = item.name[currentLang] || item.name['en'] || '';
            const subtotal = item.price * item.quantity;
            
            return (
              <div 
                key={item.id}
                className="flex items-center gap-4 bg-white dark:bg-[#121215] p-4 sm:p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm transition-colors"
              >
                {/* Product Image */}
                <div className="w-16 sm:w-20 aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900/50 shrink-0">
                  <img 
                    src={item.imageBase64} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white line-clamp-1 font-heading">
                    {name}
                  </h3>
                  <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  
                  {/* Remove mobile button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="sm:hidden text-xs font-bold text-red-500 hover:underline mt-2 flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Remove' : 'حذف'}</span>
                  </button>
                </div>

                {/* Quantity Modifier */}
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 shrink-0">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity > 1 ? item.quantity - 1 : 1)}
                    className="p-2 hover:bg-zinc-150 dark:hover:bg-zinc-900 text-zinc-500 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-xs font-extrabold text-zinc-950 dark:text-white font-heading">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-zinc-150 dark:hover:bg-zinc-900 text-zinc-500 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Action */}
                <div className="text-right shrink-0 pl-4 rtl:pl-0 rtl:pr-4 hidden sm:block">
                  <div className="text-sm font-extrabold text-zinc-950 dark:text-white font-heading">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline mt-1 inline-flex items-center gap-0.5 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{currentLang === 'en' ? 'Remove' : 'حذف'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Checkout Summary Card */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200/60 dark:border-zinc-900/60 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors space-y-6">
          <h2 className="text-lg font-extrabold text-zinc-950 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-900/60 font-heading">
            {currentLang === 'en' ? 'Order Summary' : 'ملخص الطلب'}
          </h2>

          <div className="space-y-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span className="font-extrabold text-zinc-950 dark:text-white">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-900/60 pt-4 text-sm font-black text-zinc-950 dark:text-white font-heading">
              <span>{t('cart.total')}</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Warning check */}
          {(!settings || !settings.whatsapp) && (
            <div className="flex gap-2.5 p-4 bg-yellow-955/20 text-yellow-500 rounded-2xl text-[11px] font-bold border border-yellow-900/50">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {currentLang === 'en'
                  ? 'No WhatsApp phone number configured. Checkout is locked.'
                  : 'لم يتم تعيين رقم هاتف واتساب للمتجر في الإعدادات. إتمام الطلب مغلق.'}
              </span>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={!settings || !settings.whatsapp}
            className="w-full inline-flex items-center justify-center gap-2 py-4 bg-green-650 hover:bg-green-700 active:bg-green-750 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-650 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-102 cursor-pointer disabled:cursor-not-allowed"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-white" />
            <span>{t('cart.checkout')}</span>
          </button>

          <p className="text-center text-[10px] text-zinc-500 font-medium leading-relaxed">
            {currentLang === 'en'
              ? 'No payment is required online. Your order will be sent to our WhatsApp, and our agent will follow up.'
              : 'لا يلزم الدفع عبر الإنترنت. سيتم إرسال طلبك إلى واتساب الخاص بنا، وسيقوم وكيلنا بمتابعة الطلب معك.'}
          </p>

        </div>

      </div>

    </div>
  );
}
