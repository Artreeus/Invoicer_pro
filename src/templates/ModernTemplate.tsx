import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ModernTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      <div className="flex">
        <div className="w-2" style={{ backgroundColor: color }} />
        <div className="flex-1 px-10 py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-5">
              {company.logo_url ? (
                <img src={company.logo_url} alt="" className="h-16 w-16 object-contain rounded-2xl" />
              ) : (
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black" style={{ backgroundColor: color }}>
                  {company.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{company.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  {company.phone && <span>{company.phone}</span>}
                  {company.email && <span>{company.email}</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${color}10` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm font-bold" style={{ color }}>{invoice.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-2">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="text-center">
            <p className="text-4xl font-black tracking-tighter" style={{ color }}>INVOICE</p>
            <p className="text-sm font-semibold text-gray-400 mt-1">{invoice.invoice_number}</p>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      <div className="px-12 py-6">
        <div className="flex gap-6">
          <div className="flex-1 p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color }}>Billed To</p>
            {client ? (
              <div>
                <p className="font-bold text-gray-900 text-lg">{client.name}</p>
                {client.address && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{client.address}</p>}
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  {client.phone && <span>{client.phone}</span>}
                  {client.email && <span>{client.email}</span>}
                </div>
              </div>
            ) : <p className="text-gray-300">--</p>}
          </div>
          <div className="w-56 space-y-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}08` }}>
              <p className="text-[10px] text-gray-400 font-medium">Issue Date</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(invoice.issue_date)}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}08` }}>
              <p className="text-[10px] text-gray-400 font-medium">Due Date</p>
              <p className="text-sm font-bold text-gray-900">{invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt'}</p>
            </div>
            <div className="p-3 rounded-xl text-white" style={{ backgroundColor: color }}>
              <p className="text-[10px] opacity-70 font-medium">Amount Due</p>
              <p className="text-lg font-black">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 flex-1">
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Service / Item</th>
                <th className="text-right px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Qty</th>
                <th className="text-right px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Rate</th>
                <th className="text-right px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">VAT</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-900">{item.item_name}</p>
                    {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3.5 text-right text-gray-600">{formatCurrency(item.unit_price, invoice.currency)}</td>
                  <td className="px-4 py-3.5 text-right text-gray-400 text-xs">{item.vat_rate}%</td>
                  <td className="px-5 py-3.5 text-right font-bold text-gray-900">{formatCurrency(item.line_total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400 px-3"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_discount > 0 && <div className="flex justify-between text-red-500 px-3"><span>Discount</span><span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-400 px-3"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="flex justify-between font-black text-lg pt-3 mt-2 border-t-2 px-3" style={{ borderColor: color, color }}>
              <span>Total</span><span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50 text-xs text-gray-600">
            <span className="font-bold">Notes: </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="px-12 pb-8 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
