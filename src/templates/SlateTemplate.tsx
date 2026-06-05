import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Slate: editorial, typography-led. Oversized "INVOICE" wordmark, a thick
// accent rule, and a near-monochrome palette with a single colour highlight.
export default function SlateTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0f172a';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '60px' }}>
      {/* Masthead */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-11 w-11 object-contain rounded-lg" />
          ) : (
            <div className="h-11 w-11 rounded-lg flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-base font-bold text-gray-900 tracking-tight">{company.name}</p>
            {company.email && <p className="text-xs text-gray-400">{company.email}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-gray-400">{invoice.invoice_number}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(invoice.issue_date)}</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="mt-10">
        <h2 className="text-7xl font-black tracking-tighter leading-none text-gray-900">
          Invoice<span style={{ color }}>.</span>
        </h2>
        <div className="h-1.5 mt-5 rounded-full" style={{ backgroundColor: color, width: '80px' }} />
      </div>

      {/* Meta row */}
      <div className="mt-10 grid grid-cols-3 gap-6 pb-8 border-b-2 border-gray-900">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Billed to</p>
          {client ? (
            <>
              <p className="text-sm font-bold text-gray-900 mt-1.5">{client.name}</p>
              {client.address && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{client.address}</p>}
              {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
            </>
          ) : <p className="text-sm text-gray-300 mt-1.5">—</p>}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Due date</p>
          <p className="text-sm font-bold text-gray-900 mt-1.5">{invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">Status</p>
          <p className="text-sm font-bold capitalize mt-1.5" style={{ color }}>{invoice.status}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total due</p>
          <p className="text-3xl font-black text-gray-900 mt-1.5 tracking-tight tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
          <p className="text-xs text-gray-400">{invoice.currency}</p>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 mt-2">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Item</th>
              <th className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Qty</th>
              <th className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Rate</th>
              <th className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-4">
                  <p className="font-bold text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="py-4 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-4 text-right font-bold text-gray-900 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-8">
          <div className="w-72">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-900">
              <span className="text-base font-black text-gray-900 uppercase tracking-wide">Total</span>
              <span className="text-2xl font-black tabular-nums" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 pl-4 border-l-2 text-xs text-gray-500 leading-relaxed" style={{ borderColor: color }}>
            <span className="font-bold text-gray-700">Note · </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="mt-8">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
