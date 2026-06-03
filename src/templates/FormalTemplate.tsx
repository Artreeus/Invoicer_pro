import type { TemplateProps } from './shared';
import { TaxInfo, InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function FormalTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '40px' }}>
      <div className="border-2 border-gray-800 p-1 mb-6">
        <div className="border border-gray-400 p-4">
          <div className="text-center">
            {company.logo_url && <img src={company.logo_url} alt="" className="h-14 mx-auto mb-2 object-contain" />}
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">{company.name}</h1>
            {company.address && <p className="text-xs text-gray-600 mt-1">{company.address}</p>}
            <div className="flex justify-center gap-6 text-xs text-gray-500 mt-1">
              {company.phone && <span>Tel: {company.phone}</span>}
              {company.email && <span>Email: {company.email}</span>}
            </div>
            <div className="mt-2 flex justify-center">
              <TaxInfo company={company} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block border-2 px-8 py-2" style={{ borderColor: color }}>
          <h2 className="text-lg font-bold uppercase tracking-widest" style={{ color }}>Invoice</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
        <div>
          <p className="font-bold text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">Bill To</p>
          {client ? (
            <>
              <p className="font-bold text-gray-900">{client.name}</p>
              {client.address && <p className="text-xs text-gray-600">{client.address}</p>}
              {client.phone && <p className="text-xs text-gray-600">Tel: {client.phone}</p>}
              {(client.bin || client.tin) && (
                <p className="text-xs text-gray-500 mt-1">
                  {client.bin && `BIN: ${client.bin}`} {client.tin && `TIN: ${client.tin}`}
                </p>
              )}
            </>
          ) : <p className="text-gray-400">--</p>}
        </div>
        <div>
          <p className="font-bold text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">Invoice Details</p>
          <div className="space-y-1 text-xs">
            <div className="flex gap-4"><span className="text-gray-500 w-24">Invoice No:</span><span className="font-bold">{invoice.invoice_number}</span></div>
            <div className="flex gap-4"><span className="text-gray-500 w-24">Date:</span><span>{formatDate(invoice.issue_date)}</span></div>
            {invoice.due_date && <div className="flex gap-4"><span className="text-gray-500 w-24">Due Date:</span><span>{formatDate(invoice.due_date)}</span></div>}
            <div className="flex gap-4"><span className="text-gray-500 w-24">Status:</span><span className="capitalize font-medium">{invoice.status}</span></div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full text-sm border-2 border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-center px-3 py-2.5 text-xs font-bold border-r border-gray-600 w-10">SL</th>
              <th className="text-left px-3 py-2.5 text-xs font-bold border-r border-gray-600">Particulars</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold border-r border-gray-600 w-16">Qty</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold border-r border-gray-600 w-24">Rate</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold border-r border-gray-600 w-16">VAT%</th>
              <th className="text-right px-3 py-2.5 text-xs font-bold w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-300">
                <td className="px-3 py-2 text-center border-r border-gray-200 text-xs">{i + 1}</td>
                <td className="px-3 py-2 border-r border-gray-200">
                  <p className="font-medium">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </td>
                <td className="px-3 py-2 text-right border-r border-gray-200">{item.quantity}</td>
                <td className="px-3 py-2 text-right border-r border-gray-200">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-3 py-2 text-right border-r border-gray-200 text-xs">{item.vat_rate}%</td>
                <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-400">
              <td colSpan={5} className="px-3 py-1.5 text-right text-xs text-gray-500 border-r border-gray-200">Subtotal</td>
              <td className="px-3 py-1.5 text-right text-sm">{formatCurrency(invoice.subtotal, invoice.currency)}</td>
            </tr>
            {invoice.total_discount > 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-1.5 text-right text-xs text-red-500 border-r border-gray-200">Discount</td>
                <td className="px-3 py-1.5 text-right text-sm text-red-500">-{formatCurrency(invoice.total_discount, invoice.currency)}</td>
              </tr>
            )}
            {invoice.total_vat > 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-1.5 text-right text-xs text-gray-500 border-r border-gray-200">VAT</td>
                <td className="px-3 py-1.5 text-right text-sm">{formatCurrency(invoice.total_vat, invoice.currency)}</td>
              </tr>
            )}
            <tr className="border-t-2 border-gray-800 bg-gray-50">
              <td colSpan={5} className="px-3 py-2.5 text-right font-bold border-r border-gray-200">Grand Total</td>
              <td className="px-3 py-2.5 text-right font-bold text-base" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 flex justify-between items-start">
          <div className="text-center w-48">
            <div className="border border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center text-xs text-gray-400">
              Company Seal / Stamp
            </div>
          </div>
        </div>
      </div>

      <InvoiceFooter invoice={invoice} brandColor={color} />
    </div>
  );
}
