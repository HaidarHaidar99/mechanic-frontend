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

    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] space-y-6 text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-400">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('cart.empty')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            {currentLang === 'en' 
              ? 'Browse our catalogs and add genuine parts or services to your cart to checkout.'
              : 'تصفح قائمة المنتجات لدينا وأضف قطع الغيار أو الخدمات إلى سلتك لإتمام الطلب.'}
          </p>
        </div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-1 px-5 py-2.5 bg-red-650 hover:bg-red-750 text-white font-bold rounded-xl shadow transition-all hover:scale-103"
        >
          <span>{currentLang === 'en' ? 'Start Shopping' : 'ابدأ التسوق'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
            {t('cart.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {cartItems.length} {t('cart.items')} {currentLang === 'en' ? 'in your cart' : 'في سلتك'}
          </p>
        </div>
        
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 dark:text-red-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
                className="flex items-center gap-4 bg-white dark:bg-[#1f2028] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors"
              >
                {/* Product Image */}
                <div className="w-16 sm:w-20 aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                  <img 
                    src={item.imageBase64} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                    {name}
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    ${item.price.toFixed(2)}
                  </div>
                  
                  {/* Remove mobile button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="sm:hidden text-xs text-red-500 font-semibold hover:underline mt-1.5 flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{currentLang === 'en' ? 'Remove' : 'حذف'}</span>
                  </button>
                </div>

                {/* Quantity Editor */}
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity > 1 ? item.quantity - 1 : 1)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 py-0.5 text-xs font-semibold text-gray-950 dark:text-white">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Action */}
                <div className="text-right flex-shrink-0 pl-2 rtl:pl-0 rtl:pr-2 hidden sm:block">
                  <div className="text-sm font-bold text-gray-950 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline mt-1 inline-flex items-center gap-0.5"
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
        <div className="bg-white dark:bg-[#1f2028] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm transition-colors space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800">
            {currentLang === 'en' ? 'Order Summary' : 'ملخص الطلب'}
          </h2>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between border-t border-gray-150 dark:border-gray-800 pt-3 text-base font-bold text-gray-950 dark:text-white">
              <span>{t('cart.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Warning check */}
          {(!settings || !settings.whatsapp) && (
            <div className="flex gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 rounded-lg text-xs border border-yellow-200 dark:border-yellow-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 dark:disabled:bg-gray-850 text-white font-bold rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer disabled:cursor-not-allowed"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            <span>{t('cart.checkout')}</span>
          </button>

          <p className="text-center text-xs text-gray-500">
            {currentLang === 'en'
              ? 'No payment is required online. Your order will be sent to our WhatsApp, and our agent will follow up.'
              : 'لا يلزم الدفع عبر الإنترنت. سيتم إرسال طلبك إلى واتساب الخاص بنا، وسيقوم وكيلنا بمتابعة الطلب معك.'}
          </p>

        </div>

      </div>

    </div>
  );
}
