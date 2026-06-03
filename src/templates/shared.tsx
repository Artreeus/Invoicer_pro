import type { Invoice, Company, Client, InvoiceItem } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

export interface TemplateProps {
  invoice: Invoice;
  company: Company;
  client: Client | null;
  items: InvoiceItem[];
  brandColor?: string;
}

export function CompanyHeader({ company, brandColor }: { company: Company; brandColor: string }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {company.logo_url ? (
          <img src={company.logo_url} alt={company.name} className="h-14 w-14 object-contain rounded-lg" />
        ) : (
          <div className="h-14 w-14 rounded-lg flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: brandColor }}>
            {company.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold" style={{ color: brandColor }}>{company.name}</h1>
          {company.address && <p className="text-xs text-gray-500 max-w-[250px]">{company.address}</p>}
        </div>
      </div>
      <div className="text-right text-xs text-gray-500 space-y-0.5">
        {company.phone && <p>{company.phone}</p>}
        {company.email && <p>{company.email}</p>}
        {company.website && <p>{company.website}</p>}
      </div>
    </div>
  );
}

export function TaxInfo({ company }: { company: Company }) {
  const items = [
    company.bin && `BIN: ${company.bin}`,
    company.tin && `TIN: ${company.tin}`,
    company.vat_registration_number && `VAT Reg: ${company.vat_registration_number}`,
    company.trade_license_number && `Trade License: ${company.trade_license_number}`,
  ].filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-gray-400">
      {items.map((item, i) => <span key={i}>{item}</span>)}
    </div>
  );
}

export function ClientInfo({ client }: { client: Client | null; invoice?: Invoice }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
      {client ? (
        <div className="text-sm">
          <p className="font-semibold text-gray-900">{client.name}</p>
          {client.address && <p className="text-gray-500 text-xs">{client.address}</p>}
          {client.phone && <p className="text-gray-500 text-xs">{client.phone}</p>}
          {client.email && <p className="text-gray-500 text-xs">{client.email}</p>}
          {(client.bin || client.tin) && (
            <p className="text-gray-400 text-[10px] mt-1">
              {client.bin && `BIN: ${client.bin}`}{client.bin && client.tin ? ' | ' : ''}{client.tin && `TIN: ${client.tin}`}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No client selected</p>
      )}
    </div>
  );
}

export function InvoiceMeta({ invoice, brandColor }: { invoice: Invoice; brandColor: string }) {
  return (
    <div className="text-right">
      <h2 className="text-2xl font-bold" style={{ color: brandColor }}>INVOICE</h2>
      <p className="text-sm font-semibold text-gray-900 mt-1">{invoice.invoice_number}</p>
      <div className="text-xs text-gray-500 mt-2 space-y-0.5">
        <p>Date: {formatDate(invoice.issue_date)}</p>
        {invoice.due_date && <p>Due: {formatDate(invoice.due_date)}</p>}
      </div>
    </div>
  );
}

export function ItemsTable({ items, currency, brandColor }: { items: InvoiceItem[]; currency: string; brandColor: string }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr style={{ backgroundColor: brandColor }}>
          <th className="text-left px-3 py-2 text-white text-xs font-semibold">#</th>
          <th className="text-left px-3 py-2 text-white text-xs font-semibold">Item</th>
          <th className="text-right px-3 py-2 text-white text-xs font-semibold">Qty</th>
          <th className="text-right px-3 py-2 text-white text-xs font-semibold">Price</th>
          <th className="text-right px-3 py-2 text-white text-xs font-semibold">VAT</th>
          <th className="text-right px-3 py-2 text-white text-xs font-semibold">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.id || i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
            <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
            <td className="px-3 py-2">
              <p className="font-medium text-gray-900">{item.item_name}</p>
              {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
            </td>
            <td className="px-3 py-2 text-right text-gray-700">{item.quantity}</td>
            <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(item.unit_price, currency)}</td>
            <td className="px-3 py-2 text-right text-gray-500 text-xs">{item.vat_rate}%</td>
            <td className="px-3 py-2 text-right font-medium text-gray-900">{formatCurrency(item.line_total, currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TotalsSection({ invoice, brandColor }: { invoice: Invoice; brandColor: string }) {
  return (
    <div className="flex justify-end mt-4">
      <div className="w-64 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
        </div>
        {invoice.total_discount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span>
          </div>
        )}
        {invoice.total_vat > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>VAT</span>
            <span>{formatCurrency(invoice.total_vat, invoice.currency)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t-2" style={{ borderColor: brandColor, color: brandColor }}>
          <span>Total</span>
          <span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
        </div>
      </div>
    </div>
  );
}

export function InvoiceFooter({ invoice, brandColor }: { invoice: Invoice; brandColor: string }) {
  return (
    <div className="border-t border-gray-200 pt-4 mt-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
        {invoice.terms_and_conditions && (
          <div>
            <p className="font-semibold text-gray-700 mb-1">Terms & Conditions</p>
            <p className="whitespace-pre-line">{invoice.terms_and_conditions}</p>
          </div>
        )}
        {invoice.payment_instructions && (
          <div>
            <p className="font-semibold text-gray-700 mb-1">Payment Instructions</p>
            <p className="whitespace-pre-line">{invoice.payment_instructions}</p>
          </div>
        )}
      </div>
      {invoice.vat_disclaimer && (
        <p className="text-[10px] text-gray-400 italic">{invoice.vat_disclaimer}</p>
      )}
      <div className="flex items-end justify-between pt-4">
        <div className="text-center">
          {invoice.footer_thank_you_note && (
            <p className="text-sm font-medium" style={{ color: brandColor }}>{invoice.footer_thank_you_note}</p>
          )}
        </div>
        <div className="text-center min-w-[180px]">
          <div className="border-t border-gray-300 pt-2 mt-8">
            {invoice.authorized_signatory_name && (
              <p className="text-sm font-semibold text-gray-900">{invoice.authorized_signatory_name}</p>
            )}
            {invoice.authorized_signatory_title && (
              <p className="text-xs text-gray-500">{invoice.authorized_signatory_title}</p>
            )}
            <p className="text-[10px] text-gray-400 mt-0.5">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
