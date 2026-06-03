import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function CreativeTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: color, opacity: 0.06, transform: 'translate(30%, -50%)' }} />
        <div className="absolute top-20 right-20 w-[200px] h-[200px] rounded-full" style={{ backgroundColor: color, opacity: 0.04, transform: 'translate(40%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[150px] h-[150px] rounded-full" style={{ backgroundColor: color, opacity: 0.05, transform: 'translate(-40%, 40%)' }} />

        <div className="relative px-10 pt-10 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="" className="h-12 object-contain" />
                ) : (
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-black" style={{ backgroundColor: color }}>
                    {company.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-black tracking-tight" style={{ color }}>{company.name}</h1>
                  {company.address && <p className="text-[11px] text-gray-400">{company.address}</p>}
                </div>
              </div>
              <div className="flex gap-4 text-[11px] text-gray-400">
                {company.phone && <span>{company.phone}</span>}
                {company.email && <span>{company.email}</span>}
                {company.website && <span>{company.website}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-3">
                <span className="inline-block px-5 py-2 rounded-full text-white text-xs font-black uppercase tracking-widest" style={{ backgroundColor: color }}>
                  Invoice
                </span>
              </div>
              <p className="text-2xl font-black text-gray-900">{invoice.invoice_number}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(invoice.issue_date)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-5">
        <div className="flex gap-5">
          <div className="flex-1 relative p-5 rounded-2xl overflow-hidden" style={{ backgroundColor: `${color}08` }}>
            <div className="absolute top-0 left-0 w-1 h-full rounded-full" style={{ backgroundColor: color }} />
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color }}>Client Details</p>
            {client ? (
              <div>
                <p className="font-black text-gray-900 text-lg">{client.name}</p>
                {client.address && <p className="text-xs text-gray-500 mt-1">{client.address}</p>}
                {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
                {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
              </div>
            ) : <p className="text-gray-300">--</p>}
          </div>
          <div className="flex gap-3">
            <div className="w-36 p-4 rounded-2xl bg-gray-900 text-white">
              <p className="text-[10px] text-gray-400 font-medium uppercase">Due Date</p>
              <p className="text-sm font-bold mt-1">{invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt'}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase mt-4">Status</p>
              <p className="text-sm font-bold capitalize mt-1">{invoice.status}</p>
            </div>
            <div className="w-40 p-4 rounded-2xl text-white flex flex-col justify-center" style={{ backgroundColor: color }}>
              <p className="text-[10px] opacity-70 font-medium uppercase">Amount Due</p>
              <p className="text-2xl font-black mt-1">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
              <p className="text-[10px] opacity-60 mt-1">{invoice.currency}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 flex-1">
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${color}15` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: `${color}0A` }}>
                <th className="text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest" style={{ color }}>Service</th>
                <th className="text-right px-4 py-3.5 text-[10px] font-black uppercase tracking-widest" style={{ color }}>Qty</th>
                <th className="text-right px-4 py-3.5 text-[10px] font-black uppercase tracking-widest" style={{ color }}>Rate</th>
                <th className="text-right px-4 py-3.5 text-[10px] font-black uppercase tracking-widest" style={{ color }}>VAT</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-black uppercase tracking-widest" style={{ color }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b" style={{ borderColor: `${color}08` }}>
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
          <div className="w-72 p-5 rounded-2xl" style={{ backgroundColor: `${color}06` }}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
              <div className="flex justify-between font-black text-xl pt-3 border-t-2" style={{ borderColor: `${color}30`, color }}>
                <span>Total</span><span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-4 rounded-2xl bg-gray-50 text-xs text-gray-600">
            <span className="font-black">Notes: </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="px-10 pb-8 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
