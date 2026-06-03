import type { TemplateProps } from './shared';
import { TaxInfo, InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ExecutiveTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      <div className="relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full" style={{ background: `linear-gradient(135deg, ${color}30 0%, transparent 50%)` }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: color, opacity: 0.08, transform: 'translate(30%, 40%)' }} />
        </div>
        <div className="relative px-10 py-10 flex justify-between items-center">
          <div className="flex items-center gap-5">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-16 w-16 object-contain rounded-xl bg-white/10 p-2" />
            ) : (
              <div className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-black" style={{ backgroundColor: color, color: 'white' }}>
                {company.name.charAt(0)}
              </div>
            )}
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
              {company.address && <p className="text-xs text-gray-400 mt-1 max-w-[280px]">{company.address}</p>}
              <div className="flex gap-3 mt-1.5 text-[11px] text-gray-500">
                {company.phone && <span>{company.phone}</span>}
                {company.email && <span>{company.email}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.4em] font-medium" style={{ color }}>Invoice</div>
            <p className="text-4xl font-black text-white mt-2 tracking-tight">{invoice.invoice_number}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-300 font-medium capitalize">{invoice.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-2 bg-gray-50 flex items-center gap-4">
        <TaxInfo company={company} />
      </div>

      <div className="px-10 py-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Bill To</div>
            {client ? (
              <div>
                <p className="font-bold text-gray-900 text-lg">{client.name}</p>
                {client.address && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{client.address}</p>}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  {client.phone && <span>{client.phone}</span>}
                  {client.email && <span>{client.email}</span>}
                </div>
                {(client.bin || client.tin) && (
                  <div className="flex gap-3 mt-2">
                    {client.bin && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">BIN: {client.bin}</span>}
                    {client.tin && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">TIN: {client.tin}</span>}
                  </div>
                )}
              </div>
            ) : <p className="text-gray-300">--</p>}
          </div>
          <div className="w-64 grid grid-cols-2 gap-2">
            {[
              { label: 'Issue Date', value: formatDate(invoice.issue_date) },
              { label: 'Due Date', value: invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt' },
              { label: 'Currency', value: invoice.currency },
              { label: 'Amount Due', value: formatCurrency(invoice.grand_total, invoice.currency), highlight: true },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-lg ${item.highlight ? 'text-white' : 'bg-gray-50'}`} style={item.highlight ? { backgroundColor: color } : {}}>
                <p className={`text-[10px] font-medium ${item.highlight ? 'opacity-70' : 'text-gray-400'}`}>{item.label}</p>
                <p className={`text-sm font-bold mt-0.5 ${item.highlight ? '' : 'text-gray-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-10 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900">
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider rounded-tl-lg">#</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
              <th className="text-right px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty</th>
              <th className="text-right px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rate</th>
              <th className="text-right px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">VAT</th>
              <th className="text-right px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider rounded-tr-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3 text-xs text-gray-300">{String(i + 1).padStart(2, '0')}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-4 py-3 text-right text-gray-400 text-xs">{item.vat_rate}%</td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-72">
            <div className="space-y-2 text-sm px-4">
              <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-400"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            </div>
            <div className="mt-3 px-4 py-3.5 rounded-lg bg-gray-900 text-white flex justify-between items-center">
              <span className="font-medium text-sm">Grand Total</span>
              <span className="font-black text-lg" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 pb-8 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
