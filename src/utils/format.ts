const whole = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const paise = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** ₹199 for whole rupees, ₹249.50 when there are paise. */
export const formatPrice = (value: number): string =>
  Number.isInteger(value) ? whole.format(value) : paise.format(value);
