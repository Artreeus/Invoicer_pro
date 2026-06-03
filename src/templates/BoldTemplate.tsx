import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function BoldTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="min-h-[1122px] flex flex-col" style={{ width: '794px', backgroundColor: '#fafafa' }}>
      <div className="relative overflow-hidden" style={{ backgroundColor: color }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)' }} />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-black/10" />
        </div>
        <div className="relative px-10 py-10">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-4">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="" className="h-14 w-14 object-contain rounded-xl bg-white/20 p-1.5" />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black">
                    {company.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{company.name}</h1>
                  {company.address && <p className="text-xs opacity-60 mt-1">{company.address}</p>}
                </div>
              </div>
              <div className="flex gap-4 text-[11px] opacity-50">
                {company.phone && <span>{company.phone}</span>}
                {company.email && <span>{company.email}</span>}
                {company.website && <span>{company.website}</span>}
              </div>
            </div>
            <div className="text-right text-white">
              <p className="text-6xl font-black opacity-20 leading-none">INV</p>
              <p className="text-2xl font-black -mt-3">{invoice.invoice_number}</p>
              <p className="text-xs opacity-50 mt-2">{formatDate(invoice.issue_date)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
              {client ? (
                <div>
                  <p className="font-black text-gray-900 text-xl">{client.name}</p>
                  {client.address && <p className="text-xs text-gray-500 mt-1">{client.address}</p>}
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    {client.phone && <span>{client.phone}</span>}
                    {client.email && <span>{client.email}</span>}
                  </div>
                </div>
              ) : <p className="text-gray-300">--</p>}
            </div>
            <div className="flex gap-3">
              <div className="w-28 bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Due</p>
                <p className="text-xs font-bold text-gray-900 mt-1">{invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt'}</p>
              </div>
              <div className="w-28 bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Status</p>
                <p className="text-xs font-bold capitalize mt-1" style={{ color }}>{invoice.status}</p>
              </div>
              <div className="w-36 rounded-xl p-3 text-center text-white" style={{ backgroundColor: color }}>
                <p className="text-[10px] opacity-70">Total Due</p>
                <p className="text-lg font-black mt-0.5">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6 flex-1">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: color }}>
                <th className="text-left px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">#</th>
                <th className="text-left px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Item / Service</th>
                <th className="text-right px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest">Qty</th>
                <th className="text-right px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest">Rate</th>
                <th className="text-right px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest">VAT</th>
                <th className="text-right px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-5 py-3.5 text-xs font-bold" style={{ color }}>{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-gray-900">{item.item_name}</p>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3.5 text-right text-gray-600">{formatCurrency(item.unit_price, invoice.currency)}</td>
                  <td className="px-4 py-3.5 text-right text-gray-400 text-xs">{item.vat_rate}%</td>
                  <td className="px-5 py-3.5 text-right font-black text-gray-900">{formatCurrency(item.line_total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <div className="w-80 bg-white rounded-2xl shadow-sm p-5">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-gray-700">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between"><span className="text-gray-400">Discount</span><span className="text-red-500 font-medium">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-400"><span>VAT</span><span className="text-gray-700">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-black text-gray-900">GRAND TOTAL</span>
                <span className="text-2xl font-black" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-4 text-xs text-gray-600">
            <span className="font-black">Notes: </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="px-10 pb-8 pt-2">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
