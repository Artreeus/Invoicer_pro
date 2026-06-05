import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Stripe-style: the clean, restrained SaaS invoice — generous whitespace,
// hairline rules, tabular figures, one accent colour used sparingly.
export default function StripeTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#635bff';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '56px 64px' }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-10 w-10 object-contain rounded-lg" />
          ) : (
            <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-base font-semibold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <span className="text-base font-semibold text-gray-900">{company.name}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">Invoice</p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{invoice.invoice_number}</p>
        </div>
      </div>

      {/* Amount + key dates strip */}
      <div className="mt-12 pb-8 border-b border-gray-100">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Amount due</p>
        <p className="text-4xl font-semibold text-gray-900 mt-1 tracking-tight tabular-nums">
          {formatCurrency(invoice.grand_total, invoice.currency)}
        </p>
        <div className="flex gap-10 mt-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Issued</p>
            <p className="text-sm text-gray-900 mt-1">{formatDate(invoice.issue_date)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Due</p>
            <p className="text-sm text-gray-900 mt-1">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Currency</p>
            <p className="text-sm text-gray-900 mt-1">{invoice.currency}</p>
          </div>
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-10 mt-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">From</p>
          <p className="text-sm font-medium text-gray-900">{company.name}</p>
          {company.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{company.address}</p>}
          {company.email && <p className="text-xs text-gray-500">{company.email}</p>}
          {(company.bin || company.tin) && (
            <p className="text-[11px] text-gray-400 mt-1">
              {company.bin && `BIN ${company.bin}`}{company.bin && company.tin ? '  ·  ' : ''}{company.tin && `TIN ${company.tin}`}
            </p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-2">Bill to</p>
          {client ? (
            <>
              <p className="text-sm font-medium text-gray-900">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
            </>
          ) : <p className="text-sm text-gray-300">—</p>}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 mt-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Description</th>
              <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Qty</th>
              <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Unit price</th>
              <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-3.5">
                  <p className="font-medium text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="py-3.5 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                <td className="py-3.5 text-right text-gray-600 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-3.5 text-right font-medium text-gray-900 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-64 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.total_discount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span>
              </div>
            )}
            {invoice.total_vat > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>VAT</span>
                <span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2.5 border-t border-gray-200 font-semibold text-gray-900">
              <span>Amount due</span>
              <span className="tabular-nums" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">Note · </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="mt-6">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
