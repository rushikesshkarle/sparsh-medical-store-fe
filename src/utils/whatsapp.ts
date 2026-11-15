import { STORE_INFO } from '../config/store';
import type { CartItem } from '../types/product';
import { formatPrice } from './format';

/** wa.me link to the store with a pre-filled message. */
export const whatsappUrl = (message?: string): string =>
  `https://wa.me/${STORE_INFO.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const buildWhatsAppOrderUrl = (items: CartItem[]): string => {
  const lines = items.map(
    (item, i) => `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
  );
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return whatsappUrl(
    [`Hello ${STORE_INFO.name}, I would like to order:`, '', ...lines, '', `Total: ${formatPrice(total)}`].join('\n'),
  );
};

export const prescriptionUrl = (): string =>
  whatsappUrl(`Hello ${STORE_INFO.name}, I'd like to order the medicines on my prescription (photo attached).`);

export const enquiryUrl = (): string =>
  whatsappUrl(`Hello ${STORE_INFO.name}, I'm looking for a medicine: `);

export const notifyUrl = (productName: string): string =>
  whatsappUrl(`Hello ${STORE_INFO.name}, please tell me when "${productName}" is back in stock.`);
