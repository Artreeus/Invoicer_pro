import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function MinimalTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '50px 60px' }}>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">{company.name}</h1>
          {company.address && <p className="text-xs text-gray-400 mt-2 max-w-[250px]">{company.address}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Invoice</p>
          <p className="text-lg font-light text-gray-900 mt-1">{invoice.invoice_number}</p>
          <p className="text-xs text-gray-400 mt-2">{formatDate(invoice.issue_date)}</p>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
        {client ? (
          <div className="text-sm text-gray-700">
            <p className="font-medium">{client.name}</p>
            {client.address && <p className="text-gray-400 text-xs mt-0.5">{client.address}</p>}
          </div>
        ) : (
          <p className="text-sm text-gray-300">--</p>
        )}
      </div>

      <div className="flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-3 text-xs text-gray-400 font-normal">Description</th>
              <th className="text-right pb-3 text-xs text-gray-400 font-normal">Qty</th>
              <th className="text-right pb-3 text-xs text-gray-400 font-normal">Rate</th>
              <th className="text-right pb-3 text-xs text-gray-400 font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-3">
                  <p className="text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </td>
                <td className="py-3 text-right text-gray-500">{item.quantity}</td>
                <td className="py-3 text-right text-gray-500">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-3 text-right text-gray-900">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-56 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.total_vat > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>VAT</span>
                <span>{formatCurrency(invoice.total_vat, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <InvoiceFooter invoice={invoice} brandColor={color} />
    </div>
  );
}
