import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Sunset: a warm multi-stop diagonal gradient sidebar running the full height,
// with the document body to its right. Bold, lifestyle-brand energy.
export default function SunsetTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#f97316';
  return (
    <div className="bg-white min-h-[1122px] flex" style={{ width: '794px' }}>
      {/* Gradient sidebar */}
      <div className="relative w-[230px] flex-none overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${color} 0%, ${color}cc 50%, ${color}88 100%)` }}>
        <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 -right-12 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 70%)' }} />

        <div className="relative px-6 pt-10 pb-10 h-full flex flex-col text-white">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-14 w-14 object-contain rounded-2xl bg-white/25 p-1.5" />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {company.name.charAt(0)}
            </div>
          )}
          <h1 className="text-xl font-bold mt-4 tracking-tight leading-snug">{company.name}</h1>
          <div className="text-[11px] text-white/80 mt-2 space-y-0.5">
            {company.address && <p>{company.address}</p>}
            {company.phone && <p>{company.phone}</p>}
            {company.email && <p>{company.email}</p>}
          </div>

          <div className="mt-auto">
            <div className="rounded-2xl p-4 bg-white/15 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Total due</p>
              <p className="text-2xl font-black mt-1 tracking-tight">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
              <p className="text-[10px] text-white/70 mt-0.5">{invoice.currency}</p>
            </div>
            {(company.bin || company.tin) && (
              <div className="text-[10px] text-white/70 mt-4 space-y-0.5">
                {company.bin && <p>BIN: {company.bin}</p>}
                {company.tin && <p>TIN: {company.tin}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-10 py-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-4xl font-black tracking-tighter text-gray-900">Invoice</p>
            <p className="text-sm font-mono text-gray-400 mt-1">{invoice.invoice_number}</p>
          </div>
          <div className="text-right text-xs">
            <p className="text-gray-400 uppercase tracking-wider font-semibold">Issued</p>
            <p className="text-gray-900 font-semibold mt-0.5">{formatDate(invoice.issue_date)}</p>
            <p className="text-gray-400 uppercase tracking-wider font-semibold mt-3">Due</p>
            <p className="text-gray-900 font-semibold mt-0.5">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color }}>Bill to</p>
          {client ? (
            <>
              <p className="text-base font-bold text-gray-900">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500 mt-0.5">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
            </>
          ) : <p className="text-sm text-gray-300">—</p>}
        </div>

        <div className="flex-1 mt-8">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `2px solid ${color}` }}>
                <th className="text-left pb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Item</th>
                <th className="text-right pb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Qty</th>
                <th className="text-right pb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Rate</th>
                <th className="text-right pb-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3">
                    <p className="font-semibold text-gray-900">{item.item_name}</p>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-3 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                  <td className="py-3 text-right font-semibold text-gray-900 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
              <div className="flex justify-between font-black text-lg pt-2 border-t-2" style={{ borderColor: color, color }}>
                <span>Total</span><span className="tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 p-3.5 rounded-xl text-xs text-gray-600" style={{ backgroundColor: `${color}0c` }}>
              <span className="font-bold" style={{ color }}>Notes · </span>{invoice.notes}
            </div>
          )}
        </div>

        <div className="mt-6">
          <InvoiceFooter invoice={invoice} brandColor={color} />
        </div>
      </div>
    </div>
  );
}
