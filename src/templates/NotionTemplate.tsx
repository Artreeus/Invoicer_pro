import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Notion: the calm, document-style look — a soft callout block, subtle grey
// property rows, and an understated table. Reads like a clean workspace doc.
export default function NotionTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#2563eb';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '56px 72px' }}>
      {/* Title block */}
      <div className="flex items-center gap-3">
        {company.logo_url ? (
          <img src={company.logo_url} alt="" className="h-12 w-12 object-contain rounded-lg" />
        ) : (
          <div className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: `${color}15` }}>
            <span role="img" aria-label="receipt">🧾</span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoice {invoice.invoice_number}</h1>
          <p className="text-sm text-gray-400">{company.name}</p>
        </div>
      </div>

      {/* Property rows (Notion-style) */}
      <div className="mt-8 space-y-1 text-sm">
        <PropRow label="Billed to" value={client?.name || '—'} />
        <PropRow label="Issue date" value={formatDate(invoice.issue_date)} />
        <PropRow label="Due date" value={invoice.due_date ? formatDate(invoice.due_date) : 'On receipt'} />
        <PropRow label="Status">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium capitalize"
            style={{ backgroundColor: `${color}15`, color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {invoice.status}
          </span>
        </PropRow>
        <PropRow label="Amount">
          <span className="font-semibold text-gray-900">{formatCurrency(invoice.grand_total, invoice.currency)} {invoice.currency}</span>
        </PropRow>
      </div>

      {/* Callout block */}
      <div className="mt-8 flex gap-3 p-4 rounded-lg" style={{ backgroundColor: `${color}0a` }}>
        <span className="text-lg">💡</span>
        <div className="text-sm text-gray-600">
          <p>Please settle the balance of <span className="font-semibold text-gray-900">{formatCurrency(invoice.grand_total, invoice.currency)}</span> by{' '}
            <span className="font-semibold text-gray-900">{invoice.due_date ? formatDate(invoice.due_date) : 'receipt'}</span>.
            {client?.name ? ` Thank you, ${client.name}.` : ''}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-gray-100" />

      {/* Items */}
      <div className="flex-1 mt-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Line items</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100">
              <th className="text-left pb-2 font-medium text-xs">Name</th>
              <th className="text-right pb-2 font-medium text-xs">Qty</th>
              <th className="text-right pb-2 font-medium text-xs">Price</th>
              <th className="text-right pb-2 font-medium text-xs">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3">
                  <p className="font-medium text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="py-3 text-right text-gray-500 tabular-nums">{item.quantity}</td>
                <td className="py-3 text-right text-gray-500 tabular-nums">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-3 text-right font-medium text-gray-900 tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_discount > 0 && <div className="flex justify-between text-gray-500"><span>Discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold tabular-nums" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 flex gap-3 p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
            <span>📝</span><p>{invoice.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}

function PropRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center py-1.5">
      <span className="w-32 flex-none text-gray-400 text-sm">{label}</span>
      <span className="text-gray-900">{children ?? value}</span>
    </div>
  );
}
