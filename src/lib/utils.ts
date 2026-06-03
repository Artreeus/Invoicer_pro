import { CURRENCIES } from '../types';

export function getCurrencySymbol(code: string): string {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency?.symbol ?? code;
}

export function formatCurrency(amount: number, currencyCode: string = 'BDT'): string {
  const symbol = getCurrencySymbol(currencyCode);
  const formatted = amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateLineItem(
  quantity: number,
  unitPrice: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  vatRate: number
): { lineTotal: number; vatAmount: number; discountAmount: number } {
  const gross = quantity * unitPrice;
  const discountAmount = discountType === 'percentage'
    ? (gross * discountValue) / 100
    : discountValue;
  const afterDiscount = gross - discountAmount;
  const vatAmount = (afterDiscount * vatRate) / 100;
  const lineTotal = afterDiscount + vatAmount;
  return { lineTotal, vatAmount, discountAmount };
}

export function calculateInvoiceTotals(items: Array<{
  quantity: number;
  unit_price: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  vat_rate: number;
}>) {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalVat = 0;

  for (const item of items) {
    const gross = item.quantity * item.unit_price;
    const { vatAmount, discountAmount } = calculateLineItem(
      item.quantity,
      item.unit_price,
      item.discount_type,
      item.discount_value,
      item.vat_rate
    );
    subtotal += gross;
    totalDiscount += discountAmount;
    totalVat += vatAmount;
  }

  return {
    subtotal,
    totalDiscount,
    totalVat,
    grandTotal: subtotal - totalDiscount + totalVat,
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function statusColor(status: string): string {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-700';
    case 'sent': return 'bg-blue-100 text-blue-700';
    case 'paid': return 'bg-emerald-100 text-emerald-700';
    case 'overdue': return 'bg-red-100 text-red-700';
    case 'cancelled': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
