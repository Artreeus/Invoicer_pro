import type { TemplateProps } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

// Terminal: a developer-flavoured invoice styled like a code editor / shell —
// monospace throughout, a window chrome bar, and syntax-highlight accents.
// Built self-contained (dark) so the light shared footer isn't reused.
export default function TerminalTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#22c55e';
  const muted = '#6b7280';
  return (
    <div className="min-h-[1122px] flex flex-col font-mono" style={{ width: '794px', backgroundColor: '#0d1117', color: '#c9d1d9' }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: '#161b22', borderBottom: '1px solid #21262d' }}>
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27c93f' }} />
        <span className="ml-3 text-xs" style={{ color: muted }}>~/invoices/{invoice.invoice_number}.txt</span>
      </div>

      <div className="px-10 py-10 flex-1 flex flex-col">
        {/* Header as shell prompt */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm"><span style={{ color }}>$</span> <span className="text-white">whoami</span></p>
            <h1 className="text-2xl font-bold text-white mt-1">{company.name}</h1>
            <div className="text-xs mt-1 space-y-0.5" style={{ color: muted }}>
              {company.email && <p>&gt; {company.email}</p>}
              {company.phone && <p>&gt; {company.phone}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest" style={{ color }}>// INVOICE</p>
            <p className="text-xl font-bold text-white mt-1">{invoice.invoice_number}</p>
          </div>
        </div>

        {/* Meta as key-value pairs */}
        <div className="mt-8 p-5 rounded-lg text-sm" style={{ backgroundColor: '#161b22', border: '1px solid #21262d' }}>
          <p className="text-xs mb-3" style={{ color: muted }}>const invoice = {'{'}</p>
          <div className="pl-5 space-y-1.5">
            <KV k="billTo" v={client?.name || 'null'} color={color} />
            <KV k="email" v={client?.email || 'null'} color={color} />
            <KV k="issued" v={formatDate(invoice.issue_date)} color={color} />
            <KV k="due" v={invoice.due_date ? formatDate(invoice.due_date) : 'on_receipt'} color={color} />
            <KV k="status" v={invoice.status} color={color} />
            <KV k="currency" v={invoice.currency} color={color} />
          </div>
          <p className="text-xs mt-3" style={{ color: muted }}>{'}'}</p>
        </div>

        {/* Items */}
        <div className="flex-1 mt-8">
          <p className="text-xs mb-3" style={{ color: muted }}># line items</p>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${color}40` }}>
                <th className="text-left pb-2 text-[11px] uppercase tracking-wider" style={{ color }}>item</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider" style={{ color }}>qty</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider" style={{ color }}>rate</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider" style={{ color }}>vat</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider" style={{ color }}>amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #21262d' }}>
                  <td className="py-3">
                    <p className="text-white font-medium">{item.item_name}</p>
                    {item.description && <p className="text-xs mt-0.5" style={{ color: muted }}>{item.description}</p>}
                  </td>
                  <td className="py-3 text-right tabular-nums" style={{ color: '#79c0ff' }}>{item.quantity}</td>
                  <td className="py-3 text-right tabular-nums" style={{ color: '#79c0ff' }}>{formatCurrency(item.unit_price, invoice.currency)}</td>
                  <td className="py-3 text-right text-xs" style={{ color: muted }}>{item.vat_rate}%</td>
                  <td className="py-3 text-right font-semibold text-white tabular-nums">{formatCurrency(item.line_total, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-72 space-y-1.5 text-sm">
              <div className="flex justify-between" style={{ color: muted }}><span>subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between" style={{ color: '#ff7b72' }}><span>discount</span><span className="tabular-nums">-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between" style={{ color: muted }}><span>vat</span><span className="tabular-nums">{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
              <div className="flex justify-between items-center mt-2 px-4 py-2.5 rounded-lg font-bold" style={{ backgroundColor: `${color}1a`, border: `1px solid ${color}55` }}>
                <span style={{ color }}>TOTAL</span>
                <span className="text-lg text-white tabular-nums">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 p-3.5 rounded-lg text-xs" style={{ backgroundColor: '#161b22', border: '1px solid #21262d', color: muted }}>
              <span style={{ color }}>/* </span>{invoice.notes}<span style={{ color }}> */</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #21262d' }}>
          <div className="grid grid-cols-2 gap-6 text-xs" style={{ color: muted }}>
            {invoice.terms_and_conditions && (
              <div>
                <p className="font-semibold mb-1" style={{ color }}># terms</p>
                <p className="whitespace-pre-line leading-relaxed">{invoice.terms_and_conditions}</p>
              </div>
            )}
            {invoice.payment_instructions && (
              <div>
                <p className="font-semibold mb-1" style={{ color }}># payment</p>
                <p className="whitespace-pre-line leading-relaxed">{invoice.payment_instructions}</p>
              </div>
            )}
          </div>
          <div className="flex items-end justify-between mt-6">
            {invoice.footer_thank_you_note && (
              <p className="text-sm" style={{ color }}>$ echo "{invoice.footer_thank_you_note}"</p>
            )}
            {invoice.authorized_signatory_name && (
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{invoice.authorized_signatory_name}</p>
                {invoice.authorized_signatory_title && <p className="text-xs" style={{ color: muted }}>{invoice.authorized_signatory_title}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v, color }: { k: string; v: string; color: string }) {
  return (
    <p>
      <span style={{ color: '#79c0ff' }}>{k}</span>
      <span style={{ color: '#6b7280' }}>: </span>
      <span style={{ color }}>"{v}"</span>
      <span style={{ color: '#6b7280' }}>,</span>
    </p>
  );
}
