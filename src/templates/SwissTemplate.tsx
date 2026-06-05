import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Swiss: International Typographic Style — strict grid, heavy rules, a single
// red-style accent, flush-left numerals. Rational and design-forward.
export default function SwissTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#e11d48';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '56px 60px' }}>
      {/* Top rule + masthead */}
      <div className="border-t-4 border-gray-900 pt-4 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight uppercase">{company.name}</h1>
          {company.address && <p className="text-xs text-gray-500 mt-1 max-w-[260px] leading-relaxed">{company.address}</p>}
        </div>
        <div className="text-right">
          {company.email && <p className="text-xs text-gray-500">{company.email}</p>}
          {company.phone && <p className="text-xs text-gray-500">{company.phone}</p>}
          {company.website && <p className="text-xs text-gray-500">{company.website}</p>}
        </div>
      </div>

      {/* Giant title block */}
      <div className="mt-12 grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <p className="text-[64px] font-black leading-none tracking-tighter text-gray-900 uppercase">Invoice</p>
        </div>
        <div className="col-span-4 flex flex-col justify-end">
          <div className="h-2 w-full" style={{ backgroundColor: color }} />
          <p className="text-sm font-mono text-gray-900 mt-3 font-bold">{invoice.invoice_number}</p>
        </div>
      </div>

      {/* Data grid */}
      <div className="mt-10 grid grid-cols-12 gap-4 border-t border-b border-gray-900 py-5">
        <div className="col-span-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Billed to</p>
          {client ? (
            <>
              <p className="text-sm font-bold text-gray-900 mt-2">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
            </>
          ) : <p className="text-sm text-gray-300 mt-2">—</p>}
        </div>
        <div className="col-span-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Issue / Due</p>
          <p className="text-sm font-medium text-gray-900 mt-2">{formatDate(invoice.issue_date)}</p>
          <p className="text-sm font-medium text-gray-500">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Status</p>
          <p className="text-sm font-bold capitalize mt-2" style={{ color }}>{invoice.status}</p>
        </div>
        <div className="col-span-3 text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Total</p>
          <p className="text-2xl font-black text-gray-900 mt-1 tracking-tight tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 mt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-900">
              <th className="text-left py-3 text-[10px] font-bold uppercase tracking-widest text-gray-900 w-8">№</th>
              <th className="text-left py-3 text-[10px] font-bold uppercase tracking-widest text-gray-900">Description</th>
              <th className="text-right py-3 text-[10px] font-bold uppercase tracking-widest text-gray-900">Qty</th>
              <th className="text-right py-3 text-[10px] font-bold uppercase tracking-widest text-gray-900">Rate</th>
              <th className="text-right py-3 text-[10px] font-bold uppercase tracking-widest text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-3.5 text-gray-400 font-mono text-xs align-top">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-3.5">
                  <p className="font-bold text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                </td>
                <td className="py-3.5 text-right text-gray-700 tabular-nums align-top">{item.quantity}</td>
                <td className="py-3.5 text-right text-gray-700 tabular-nums align-top">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-3.5 text-right font-bold text-gray-900 tabular-nums align-top">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-8">
          <div className="w-80">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span className="uppercase text-xs tracking-wide">Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span className="uppercase text-xs tracking-wide">Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span className="uppercase text-xs tracking-wide">VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            </div>
            <div className="flex justify-between items-baseline mt-4 pt-4 border-t-4 border-gray-900">
              <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total</span>
              <span className="text-2xl font-black tabular-nums" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 text-xs text-gray-500 leading-relaxed border-t border-gray-200 pt-4">
            <span className="font-bold text-gray-900 uppercase tracking-wide">Note — </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="mt-8">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
