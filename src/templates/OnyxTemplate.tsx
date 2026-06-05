import type { TemplateProps } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Onyx: a premium full-dark invoice. High-contrast, luxury feel — built
// self-contained because the shared (light) footer wouldn't read on black.
export default function OnyxTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#fbbf24';
  return (
    <div className="min-h-[1122px] flex flex-col" style={{ width: '794px', backgroundColor: '#0a0a0b', color: '#e5e5e7' }}>
      {/* Header */}
      <div className="px-12 pt-12 flex justify-between items-start">
        <div className="flex items-center gap-3">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-12 w-12 object-contain rounded-xl" style={{ backgroundColor: '#18181b', padding: '4px' }} />
          ) : (
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-black text-xl font-bold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{company.name}</h1>
            {company.address && <p className="text-xs text-gray-500 mt-0.5 max-w-[260px]">{company.address}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color }}>Invoice</p>
          <p className="text-2xl font-bold mt-1 text-white font-mono">{invoice.invoice_number}</p>
        </div>
      </div>

      <div className="px-12 mt-8">
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>

      {/* Amount + meta cards */}
      <div className="px-12 mt-8 grid grid-cols-3 gap-4">
        <div className="col-span-1 rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}>
          <p className="text-[10px] uppercase tracking-wider text-black/60 font-semibold">Amount due</p>
          <p className="text-2xl font-bold text-black mt-1 tracking-tight">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
          <p className="text-[11px] text-black/60 mt-1">{invoice.currency}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#161618' }}>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Issued</p>
          <p className="text-sm font-semibold text-white mt-1">{formatDate(invoice.issue_date)}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-4">Status</p>
          <p className="text-sm font-semibold capitalize mt-1" style={{ color }}>{invoice.status}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#161618' }}>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Due date</p>
          <p className="text-sm font-semibold text-white mt-1">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-4">Currency</p>
          <p className="text-sm font-semibold text-white mt-1">{invoice.currency}</p>
        </div>
      </div>

      {/* From / To */}
      <div className="px-12 mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">From</p>
          <p className="text-sm font-semibold text-white">{company.name}</p>
          {company.email && <p className="text-xs text-gray-400 mt-0.5">{company.email}</p>}
          {company.phone && <p className="text-xs text-gray-400">{company.phone}</p>}
          {(company.bin || company.tin) && (
            <p className="text-[10px] text-gray-500 mt-1">
              {company.bin && `BIN ${company.bin}`}{company.bin && company.tin ? '  ·  ' : ''}{company.tin && `TIN ${company.tin}`}
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Bill to</p>
          {client ? (
            <>
              <p className="text-sm font-semibold text-white">{client.name}</p>
              {client.address && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-400">{client.email}</p>}
            </>
          ) : <p className="text-sm text-gray-600">—</p>}
        </div>
      </div>

      {/* Items */}
      <div className="px-12 mt-8 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${color}40` }}>
              <th className="text-left pb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>Description</th>
              <th className="text-right pb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>Qty</th>
              <th className="text-right pb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>Rate</th>
              <th className="text-right pb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>VAT</th>
              <th className="text-right pb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1c1c1f' }}>
                <td className="py-3.5">
                  <p className="font-medium text-white">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                </td>
                <td className="py-3.5 text-right text-gray-300 tabular-nums">{item.quantity}</td>
                <td className="py-3.5 text-right text-gray-300 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-3.5 text-right text-gray-500 text-xs">{item.vat_rate}%</td>
                <td className="py-3.5 text-right font-semibold text-white tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_discount > 0 && <div className="flex justify-between text-red-400"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-400"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="flex justify-between items-center pt-3 mt-1" style={{ borderTop: `1px solid ${color}40` }}>
              <span className="font-semibold text-white">Total</span>
              <span className="text-lg font-bold tabular-nums" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-4 rounded-xl text-xs text-gray-400" style={{ backgroundColor: '#161618' }}>
            <span className="font-semibold" style={{ color }}>Notes · </span>{invoice.notes}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-12 pb-12 pt-6 mt-4" style={{ borderTop: '1px solid #1c1c1f' }}>
        <div className="grid grid-cols-2 gap-6 text-xs text-gray-400">
          {invoice.terms_and_conditions && (
            <div>
              <p className="font-semibold text-gray-200 mb-1">Terms &amp; Conditions</p>
              <p className="whitespace-pre-line leading-relaxed">{invoice.terms_and_conditions}</p>
            </div>
          )}
          {invoice.payment_instructions && (
            <div>
              <p className="font-semibold text-gray-200 mb-1">Payment Instructions</p>
              <p className="whitespace-pre-line leading-relaxed">{invoice.payment_instructions}</p>
            </div>
          )}
        </div>
        <div className="flex items-end justify-between mt-8">
          {invoice.footer_thank_you_note && (
            <p className="text-sm font-medium" style={{ color }}>{invoice.footer_thank_you_note}</p>
          )}
          {invoice.authorized_signatory_name && (
            <div className="text-center min-w-[180px]">
              <div className="pt-2" style={{ borderTop: '1px solid #2a2a2e' }}>
                <p className="text-sm font-semibold text-white">{invoice.authorized_signatory_name}</p>
                {invoice.authorized_signatory_title && <p className="text-xs text-gray-500">{invoice.authorized_signatory_title}</p>}
                <p className="text-[10px] text-gray-600 mt-0.5">Authorized Signature</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
