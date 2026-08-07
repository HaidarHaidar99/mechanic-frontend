/**
 * Generates a wa.me URL-encoded link to start a WhatsApp chat checkout.
 * 
 * @param {string} whatsappNumber The target WhatsApp phone number from global settings
 * @param {Array} cartItems Array of cart items { id, name: {en, ar}, price, quantity }
 * @param {number} total Grand total amount
 * @param {string} currentLang The active language ('en' | 'ar')
 * @returns {string} The fully formatted whatsapp link
 */
export function buildWhatsAppLink(whatsappNumber, cartItems, total, currentLang) {
  let message = '';

  if (currentLang === 'ar') {
    message = 'مرحباً، أود طلب المنتجات التالية:\n\n';
    
    cartItems.forEach((item, index) => {
      const name = item.name.ar || item.name.en || '';
      message += `${index + 1}. ${name}\n`;
      message += `الكمية: ${item.quantity}\n`;
      message += `سعر الوحدة: $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
      message += `المجموع الفرعي: $${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
    });
    
    message += `المجموع الكلي: $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    message = 'Hello, I would like to order the following products:\n\n';
    
    cartItems.forEach((item, index) => {
      const name = item.name.en || item.name.ar || '';
      message += `${index + 1}. ${name}\n`;
      message += `Quantity: ${item.quantity}\n`;
      message += `Unit price: $${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
      message += `Subtotal: $${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
    });
    
    message += `Total: $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Normalize WhatsApp number (remove +, dashes, spaces)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const urlEncodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanNumber}?text=${urlEncodedMessage}`;
}
