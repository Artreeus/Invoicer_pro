import type { TemplateProps } from './shared';
import { TaxInfo, InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ClassicTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '40px' }}>
      <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: color }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          {company.logo_url && <img src={company.logo_url} alt="" className="h-12 object-contain" />}
          <h1 className="text-2xl font-bold" style={{ color }}>{company.name}</h1>
        </div>
        {company.address && <p className="text-xs text-gray-500">{company.address}</p>}
        <div className="flex justify-center gap-4 text-xs text-gray-500 mt-1">
          {company.phone && <span>{company.phone}</span>}
          {company.email && <span>{company.email}</span>}
        </div>
        <div className="mt-2">
          <TaxInfo company={company} />
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold" style={{ color }}>INVOICE</h2>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
        <div className="border border-gray-200 rounded p-3">
          <p className="text-xs font-bold text-gray-500 mb-2">BILL TO:</p>
          {client ? (
            <>
              <p className="font-semibold">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500">{client.address}</p>}
              {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
            </>
          ) : <p className="text-gray-400">--</p>}
        </div>
        <div className="border border-gray-200 rounded p-3">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="font-bold text-gray-500">Invoice No:</span><span>{invoice.invoice_number}</span></div>
            <div className="flex justify-between"><span className="font-bold text-gray-500">Date:</span><span>{formatDate(invoice.issue_date)}</span></div>
            {invoice.due_date && <div className="flex justify-between"><span className="font-bold text-gray-500">Due Date:</span><span>{formatDate(invoice.due_date)}</span></div>}
            <div className="flex justify-between"><span className="font-bold text-gray-500">Status:</span><span className="capitalize">{invoice.status}</span></div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="border-b-2 border-gray-300" style={{ backgroundColor: `${color}15` }}>
              <th className="text-left px-3 py-2 text-xs font-bold border-r border-gray-200">SL</th>
              <th className="text-left px-3 py-2 text-xs font-bold border-r border-gray-200">Description</th>
              <th className="text-right px-3 py-2 text-xs font-bold border-r border-gray-200">Qty</th>
              <th className="text-right px-3 py-2 text-xs font-bold border-r border-gray-200">Unit Price</th>
              <th className="text-right px-3 py-2 text-xs font-bold border-r border-gray-200">VAT</th>
              <th className="text-right px-3 py-2 text-xs font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="px-3 py-2 border-r border-gray-200 text-center text-xs">{i + 1}</td>
                <td className="px-3 py-2 border-r border-gray-200">
                  <p className="font-medium">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </td>
                <td className="px-3 py-2 border-r border-gray-200 text-right">{item.quantity}</td>
                <td className="px-3 py-2 border-r border-gray-200 text-right">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-3 py-2 border-r border-gray-200 text-right text-xs">{item.vat_rate}%</td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 font-bold" style={{ backgroundColor: `${color}10` }}>
              <td colSpan={5} className="px-3 py-2 text-right">Grand Total:</td>
              <td className="px-3 py-2 text-right" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <InvoiceFooter invoice={invoice} brandColor={color} />
    </div>
  );
}
