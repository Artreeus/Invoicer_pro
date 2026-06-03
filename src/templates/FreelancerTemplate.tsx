import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function FreelancerTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '48px' }}>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-16 w-16 rounded-full object-cover border-2" style={{ borderColor: color }} />
          ) : (
            <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-xs text-gray-400">{company.email} | {company.phone}</p>
            {company.website && <p className="text-xs" style={{ color }}>{company.website}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-light" style={{ color }}>Invoice</p>
          <p className="text-sm text-gray-500 mt-1">{invoice.invoice_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b" style={{ borderColor: `${color}20` }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>Billed To</p>
          {client ? (
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{client.name}</p>
              {client.address && <p className="text-gray-500 text-xs">{client.address}</p>}
              {client.email && <p className="text-gray-500 text-xs">{client.email}</p>}
            </div>
          ) : <p className="text-sm text-gray-300">--</p>}
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-medium">{formatDate(invoice.issue_date)}</span></div>
          {invoice.due_date && <div className="flex justify-between"><span className="text-gray-400">Due</span><span className="font-medium">{formatDate(invoice.due_date)}</span></div>}
          <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="font-medium capitalize">{invoice.status}</span></div>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2" style={{ borderColor: color }}>
              <th className="text-left pb-3 text-xs font-bold uppercase" style={{ color }}>Service</th>
              <th className="text-right pb-3 text-xs font-bold uppercase" style={{ color }}>Hours/Qty</th>
              <th className="text-right pb-3 text-xs font-bold uppercase" style={{ color }}>Rate</th>
              <th className="text-right pb-3 text-xs font-bold uppercase" style={{ color }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3">
                  <p className="font-medium text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                <td className="py-3 text-right text-gray-600">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-3 text-right font-semibold">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-56 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-400"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="flex justify-between font-bold text-lg pt-2 border-t-2" style={{ borderColor: color, color }}>
              <span>Total Due</span><span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <InvoiceFooter invoice={invoice} brandColor={color} />
    </div>
  );
}
