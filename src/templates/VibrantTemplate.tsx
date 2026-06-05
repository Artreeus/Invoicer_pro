import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Vibrant: a bold colour-block header that wraps the brand colour across the
// full width, with a duotone total banner. Energetic and modern.
export default function VibrantTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#ec4899';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      {/* Bold colour-block header */}
      <div className="relative px-12 pt-12 pb-16" style={{ backgroundColor: color }}>
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-20" style={{ background: 'repeating-linear-gradient(45deg, white 0, white 2px, transparent 2px, transparent 14px)' }} />
        <div className="relative flex justify-between items-start">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-14 w-14 object-contain rounded-2xl bg-white p-1.5" />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-2xl font-black" style={{ color }}>
                {company.name.charAt(0)}
              </div>
            )}
            <div className="text-white">
              <h1 className="text-3xl font-black tracking-tight">{company.name}</h1>
              {company.address && <p className="text-xs text-white/80 mt-1 max-w-[280px]">{company.address}</p>}
            </div>
          </div>
          <div className="text-right text-white">
            <p className="text-5xl font-black tracking-tighter leading-none">INVOICE</p>
            <p className="text-sm font-mono text-white/90 mt-2">{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Overlapping info cards */}
      <div className="px-12 -mt-8 relative grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Issued</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{formatDate(invoice.issue_date)}</p>
        </div>
        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Due</p>
          <p className="text-sm font-bold text-gray-900 mt-1">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
        </div>
        <div className="rounded-2xl shadow-lg p-4" style={{ backgroundColor: color }}>
          <p className="text-[10px] uppercase tracking-wider text-white/70 font-bold">Amount due</p>
          <p className="text-lg font-black text-white mt-1 tracking-tight">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
        </div>
      </div>

      {/* Bill to */}
      <div className="px-12 mt-8">
        <div className="rounded-2xl p-5" style={{ backgroundColor: `${color}0c` }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>Bill to</p>
          {client ? (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-black text-gray-900">{client.name}</p>
                {client.address && <p className="text-xs text-gray-500 mt-0.5">{client.address}</p>}
                {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
              </div>
              {(company.bin || company.tin) && (
                <div className="text-right text-[10px] text-gray-400 space-y-0.5">
                  {company.bin && <p>BIN {company.bin}</p>}
                  {company.tin && <p>TIN {company.tin}</p>}
                </div>
              )}
            </div>
          ) : <p className="text-sm text-gray-300">—</p>}
        </div>
      </div>

      {/* Items */}
      <div className="px-12 mt-8 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: color }}>
              <th className="text-left px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-l-xl">Item</th>
              <th className="text-right px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest">Qty</th>
              <th className="text-right px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest">Rate</th>
              <th className="text-right px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest">VAT</th>
              <th className="text-right px-4 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-r-xl">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3.5">
                  <p className="font-bold text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-4 py-3.5 text-right text-gray-400 text-xs">{item.vat_rate}%</td>
                <td className="px-4 py-3.5 text-right font-black text-gray-900 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-80">
            <div className="space-y-2 text-sm px-4">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            </div>
            <div className="mt-3 px-5 py-4 rounded-2xl flex justify-between items-center" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
              <span className="text-white font-black uppercase tracking-wide text-sm">Total Due</span>
              <span className="text-2xl font-black text-white tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-4 rounded-2xl text-xs text-gray-600" style={{ backgroundColor: `${color}0c` }}>
            <span className="font-black" style={{ color }}>Notes · </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="px-12 pb-10 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
