import type { TemplateProps } from './shared';
import { TaxInfo, InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function LogisticsTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '40px' }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-14 object-contain" />
          ) : (
            <div className="h-14 w-14 rounded flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-xs text-gray-500">{company.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color }}>Shipping Invoice</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{invoice.invoice_number}</p>
        </div>
      </div>

      <TaxInfo company={company} />

      <div className="grid grid-cols-3 gap-3 my-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Bill To</p>
          {client ? (
            <div className="text-xs">
              <p className="font-semibold text-gray-900">{client.name}</p>
              {client.address && <p className="text-gray-500">{client.address}</p>}
            </div>
          ) : <p className="text-xs text-gray-300">--</p>}
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Invoice Date</p>
          <p className="text-xs font-semibold text-gray-900">{formatDate(invoice.issue_date)}</p>
          {invoice.due_date && (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 mt-2">Due Date</p>
              <p className="text-xs font-semibold text-gray-900">{formatDate(invoice.due_date)}</p>
            </>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
          <p className="text-xs font-semibold capitalize" style={{ color }}>{invoice.status}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 mt-2">Currency</p>
          <p className="text-xs font-semibold text-gray-900">{invoice.currency}</p>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: color }}>
              <th className="text-left px-3 py-2.5 text-white text-xs font-bold">#</th>
              <th className="text-left px-3 py-2.5 text-white text-xs font-bold">Item / Description</th>
              <th className="text-right px-3 py-2.5 text-white text-xs font-bold">Qty</th>
              <th className="text-right px-3 py-2.5 text-white text-xs font-bold">Rate</th>
              <th className="text-right px-3 py-2.5 text-white text-xs font-bold">VAT</th>
              <th className="text-right px-3 py-2.5 text-white text-xs font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                <td className="px-3 py-2">
                  <p className="font-medium text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </td>
                <td className="px-3 py-2 text-right">{item.quantity}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-3 py-2 text-right text-xs text-gray-400">{item.vat_rate}%</td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 border-2 rounded-lg p-3 space-y-1.5 text-sm" style={{ borderColor: color }}>
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ color, borderColor: `${color}40` }}>
              <span>Total</span><span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <InvoiceFooter invoice={invoice} brandColor={color} />
    </div>
  );
}
