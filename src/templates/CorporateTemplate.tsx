import type { TemplateProps } from './shared';
import { TaxInfo, InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function CorporateTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      <div className="relative" style={{ backgroundColor: color }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80" style={{ background: `radial-gradient(circle, white 0%, transparent 70%)`, transform: 'translate(20%, -40%)' }} />
        </div>
        <div className="relative px-10 py-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-14 w-14 object-contain rounded-lg bg-white/20 p-1" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-white/20 flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
              {company.address && <p className="text-xs opacity-75 mt-0.5 max-w-[280px]">{company.address}</p>}
            </div>
          </div>
          <div className="text-right text-white">
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-medium">Tax Invoice</div>
            <p className="text-3xl font-bold mt-1 tracking-tight">{invoice.invoice_number}</p>
          </div>
        </div>
      </div>

      <div className="px-10 pt-6 pb-2">
        <div className="flex gap-2 flex-wrap">
          <TaxInfo company={company} />
        </div>
      </div>

      <div className="px-10 py-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color }}>Bill To</div>
            {client ? (
              <div className="text-sm">
                <p className="font-bold text-gray-900 text-base">{client.name}</p>
                {client.address && <p className="text-gray-500 text-xs mt-1">{client.address}</p>}
                {client.phone && <p className="text-gray-500 text-xs">{client.phone}</p>}
                {client.email && <p className="text-gray-500 text-xs">{client.email}</p>}
                {(client.bin || client.tin) && (
                  <div className="flex gap-3 mt-2">
                    {client.bin && <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-500">BIN: {client.bin}</span>}
                    {client.tin && <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-500">TIN: {client.tin}</span>}
                  </div>
                )}
              </div>
            ) : <p className="text-sm text-gray-300">--</p>}
          </div>
          <div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Issue Date</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(invoice.issue_date)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Due Date</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Status</p>
                <p className="text-sm font-semibold capitalize mt-0.5" style={{ color }}>{invoice.status}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase">Currency</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{invoice.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: `${color}0D` }}>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color }}>#</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color }}>Description</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color }}>Qty</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color }}>Rate</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color }}>VAT</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-400 text-xs">{String(i + 1).padStart(2, '0')}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="px-4 py-3 text-right text-gray-400 text-xs">{item.vat_rate}%</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-72">
            <div className="space-y-2 text-sm px-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.total_discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span>
                </div>
              )}
              {invoice.total_vat > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>VAT</span>
                  <span>{formatCurrency(invoice.total_vat, invoice.currency)}</span>
                </div>
              )}
            </div>
            <div className="mt-3 px-4 py-3 rounded-lg text-white flex justify-between items-center font-bold text-base" style={{ backgroundColor: color }}>
              <span>Total Due</span>
              <span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 p-3 rounded-lg bg-gray-50 text-xs text-gray-600 border-l-3" style={{ borderLeftWidth: '3px', borderLeftColor: color }}>
            <span className="font-semibold">Notes: </span>{invoice.notes}
          </div>
        )}
      </div>

      <div className="px-10 pb-8 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
