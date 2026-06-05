import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Wave: a friendly, organic header capped with a curved SVG wave that flows
// into the white body. Approachable and modern.
export default function WaveTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0ea5e9';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      {/* Curved header */}
      <div className="relative" style={{ backgroundColor: color }}>
        <div className="px-12 pt-12 pb-20 flex justify-between items-start">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-14 w-14 object-contain rounded-2xl bg-white/20 p-1.5" />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
              {company.email && <p className="text-xs text-white/80 mt-0.5">{company.email}</p>}
            </div>
          </div>
          <div className="text-right text-white">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Invoice</p>
            <p className="text-2xl font-bold mt-1 font-mono">{invoice.invoice_number}</p>
          </div>
        </div>
        {/* SVG wave */}
        <svg viewBox="0 0 794 60" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full" style={{ height: '60px' }}>
          <path d="M0,40 C200,80 400,0 600,30 C700,45 760,35 794,25 L794,60 L0,60 Z" fill="white" />
        </svg>
      </div>

      {/* Meta + bill-to */}
      <div className="px-12 pt-6 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>Bill to</p>
          {client ? (
            <>
              <p className="text-base font-bold text-gray-900">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
            </>
          ) : <p className="text-sm text-gray-300">—</p>}
        </div>
        <div className="flex gap-3 justify-end">
          <div className="rounded-2xl px-4 py-3 text-center" style={{ backgroundColor: `${color}0d` }}>
            <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Issued</p>
            <p className="text-xs font-bold text-gray-900 mt-1">{formatDate(invoice.issue_date)}</p>
          </div>
          <div className="rounded-2xl px-4 py-3 text-center" style={{ backgroundColor: `${color}0d` }}>
            <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Due</p>
            <p className="text-xs font-bold text-gray-900 mt-1">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
          </div>
          <div className="rounded-2xl px-4 py-3 text-center text-white" style={{ backgroundColor: color }}>
            <p className="text-[9px] uppercase tracking-wider text-white/70 font-bold">Total</p>
            <p className="text-xs font-bold mt-1">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-12 mt-8 flex-1">
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: `${color}0d` }}>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Description</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Qty</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Rate</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>VAT</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-900">{item.item_name}</p>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                  <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                  <td className="px-4 py-3.5 text-right text-gray-400 text-xs">{item.vat_rate}%</td>
                  <td className="px-5 py-3.5 text-right font-bold text-gray-900 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="mt-2 px-5 py-3 rounded-2xl text-white flex justify-between items-center font-bold" style={{ backgroundColor: color }}>
              <span>Total Due</span>
              <span className="text-lg tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-4 rounded-2xl text-xs text-gray-600" style={{ backgroundColor: `${color}08` }}>
            <span className="font-bold" style={{ color }}>Notes · </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="px-12 pb-10 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
