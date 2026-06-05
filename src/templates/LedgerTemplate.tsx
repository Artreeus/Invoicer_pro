import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Ledger: a classic accounting-ledger aesthetic — monospaced figures, ruled
// rows on a faint cream field, and a boxed running total. Trustworthy, formal.
export default function LedgerTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#15803d';
  return (
    <div className="min-h-[1122px] flex flex-col" style={{ width: '794px', backgroundColor: '#fdfcf7', padding: '52px 56px' }}>
      {/* Header */}
      <div className="flex justify-between items-start pb-4" style={{ borderBottom: `2px solid ${color}` }}>
        <div className="flex items-center gap-3">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-12 w-12 object-contain" />
          ) : (
            <div className="h-12 w-12 rounded flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{company.name}</h1>
            {company.address && <p className="text-[11px] text-gray-500 mt-0.5 max-w-[260px]">{company.address}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Statement / Invoice</p>
          <p className="text-lg font-bold text-gray-900 mt-1 font-mono">{invoice.invoice_number}</p>
        </div>
      </div>

      {/* Meta rows — ledger style label : value */}
      <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-1 text-sm font-mono">
        <div className="flex justify-between border-b border-dashed border-gray-300 py-1">
          <span className="text-gray-500">Account</span>
          <span className="text-gray-900 font-semibold">{client?.name || '—'}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-gray-300 py-1">
          <span className="text-gray-500">Issue date</span>
          <span className="text-gray-900">{formatDate(invoice.issue_date)}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-gray-300 py-1">
          <span className="text-gray-500">Currency</span>
          <span className="text-gray-900">{invoice.currency}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-gray-300 py-1">
          <span className="text-gray-500">Due date</span>
          <span className="text-gray-900">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</span>
        </div>
        {client?.email && (
          <div className="flex justify-between border-b border-dashed border-gray-300 py-1">
            <span className="text-gray-500">Email</span>
            <span className="text-gray-900">{client.email}</span>
          </div>
        )}
        <div className="flex justify-between border-b border-dashed border-gray-300 py-1">
          <span className="text-gray-500">Status</span>
          <span className="font-semibold capitalize" style={{ color }}>{invoice.status}</span>
        </div>
      </div>

      {/* Ledger table */}
      <div className="flex-1 mt-8">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr style={{ backgroundColor: `${color}12` }}>
              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 border border-gray-300">Description</th>
              <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 border border-gray-300 w-16">Qty</th>
              <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 border border-gray-300 w-28">Rate</th>
              <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 border border-gray-300 w-16">VAT</th>
              <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-700 border border-gray-300 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 ? '#fdfcf7' : '#f7f5ec' }}>
                <td className="px-3 py-2.5 border border-gray-200">
                  <p className="font-semibold text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-[11px] text-gray-400">{item.description}</p>}
                </td>
                <td className="px-3 py-2.5 text-right text-gray-700 border border-gray-200 tabular-nums">{item.quantity}</td>
                <td className="px-3 py-2.5 text-right text-gray-700 border border-gray-200 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-3 py-2.5 text-right text-gray-500 border border-gray-200">{item.vat_rate}%</td>
                <td className="px-3 py-2.5 text-right font-semibold text-gray-900 border border-gray-200 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-5">
          <div className="w-80 font-mono">
            <div className="space-y-1 text-sm px-3">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            </div>
            <div className="flex justify-between items-center mt-2 px-3 py-2.5 border-2 font-bold" style={{ borderColor: color, color }}>
              <span className="uppercase tracking-wider text-sm">Balance Due</span>
              <span className="text-lg tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-3 text-xs text-gray-600 font-mono border border-gray-300" style={{ backgroundColor: '#f7f5ec' }}>
            <span className="font-bold">MEMO: </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="mt-6">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
