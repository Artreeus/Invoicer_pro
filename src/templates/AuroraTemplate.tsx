import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Aurora: a vivid gradient-mesh header with a frosted "amount due" card that
// overlaps into the body — a contemporary, premium fintech look.
export default function AuroraTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#7c3aed';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      {/* Gradient mesh header */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 45%, ${color}77 100%)` }} />
        <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)' }} />
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full" style={{ background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)`, transform: 'translate(30%, -20%)' }} />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 70%)' }} />

        <div className="relative px-12 pt-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-12 w-12 object-contain rounded-xl bg-white/25 backdrop-blur-sm p-1" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm">{company.name}</h1>
              {company.website && <p className="text-xs text-white/70">{company.website}</p>}
            </div>
          </div>
          <div className="text-right text-white">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Invoice</p>
            <p className="text-xl font-bold mt-0.5 font-mono drop-shadow-sm">{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      {/* Floating glass amount card */}
      <div className="px-12 -mt-16 relative">
        <div className="rounded-2xl p-6 flex justify-between items-center shadow-xl border border-white/60"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Amount due</p>
            <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Issued</p>
              <p className="text-sm font-semibold text-gray-800">{formatDate(invoice.issue_date)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Due</p>
              <p className="text-sm font-semibold" style={{ color }}>{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* From / To */}
      <div className="px-12 mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>From</p>
          <p className="text-sm font-bold text-gray-900">{company.name}</p>
          {company.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{company.address}</p>}
          {company.email && <p className="text-xs text-gray-500">{company.email}</p>}
          {(company.bin || company.tin) && (
            <div className="flex gap-2 mt-2">
              {company.bin && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}12`, color }}>BIN {company.bin}</span>}
              {company.tin && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}12`, color }}>TIN {company.tin}</span>}
            </div>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>Bill to</p>
          {client ? (
            <>
              <p className="text-sm font-bold text-gray-900">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
              {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
            </>
          ) : <p className="text-sm text-gray-300">—</p>}
        </div>
      </div>

      {/* Items */}
      <div className="px-12 mt-8 flex-1">
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: `linear-gradient(90deg, ${color}0d, ${color}05)` }}>
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
            <div className="mt-2 px-5 py-3 rounded-xl text-white flex justify-between items-center font-bold"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
              <span>Total</span>
              <span className="text-lg tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-4 rounded-xl text-xs text-gray-600" style={{ backgroundColor: `${color}08` }}>
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
