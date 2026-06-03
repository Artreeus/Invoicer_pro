import type { TemplateProps } from './shared';
import { TaxInfo, InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ElegantTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      <div className="px-12 pt-10 pb-8">
        <div className="flex justify-between items-start">
          <div>
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-10 object-contain mb-4" />
            ) : null}
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
              {company.name.split('').map((char, i) => (
                <span key={i} style={i === 0 ? { color, fontWeight: 700 } : {}}>{char}</span>
              ))}
            </h1>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              {company.phone && <span>{company.phone}</span>}
              {company.email && <span>{company.email}</span>}
              {company.website && <span>{company.website}</span>}
            </div>
            {company.address && <p className="text-xs text-gray-400 mt-1">{company.address}</p>}
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.5em] font-light text-gray-300">Invoice</p>
            <div className="mt-2 h-px w-24 ml-auto" style={{ backgroundColor: color }} />
            <p className="text-xl font-light text-gray-900 mt-3">{invoice.invoice_number}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(invoice.issue_date)}</p>
          </div>
        </div>
      </div>

      <div className="mx-12 h-px" style={{ background: `linear-gradient(to right, ${color}, ${color}20)` }} />

      <div className="px-12 pt-6 pb-2">
        <TaxInfo company={company} />
      </div>

      <div className="px-12 py-6">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] font-light text-gray-300 mb-3">Billed To</p>
            {client ? (
              <div>
                <p className="text-lg font-light text-gray-900">{client.name}</p>
                {client.address && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{client.address}</p>}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  {client.phone && <span>{client.phone}</span>}
                  {client.email && <span>{client.email}</span>}
                </div>
              </div>
            ) : <p className="text-gray-300 font-light">--</p>}
          </div>
          <div className="col-span-2 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 text-xs">Due</span>
              <span className="font-medium text-gray-900">{invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 text-xs">Status</span>
              <span className="font-medium capitalize" style={{ color }}>{invoice.status}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Amount Due</span>
              <span className="text-xl font-light" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left pb-3 text-[10px] uppercase tracking-[0.2em] font-light text-gray-300 border-b" style={{ borderColor: color }}>Service</th>
              <th className="text-right pb-3 text-[10px] uppercase tracking-[0.2em] font-light text-gray-300 border-b" style={{ borderColor: color }}>Qty</th>
              <th className="text-right pb-3 text-[10px] uppercase tracking-[0.2em] font-light text-gray-300 border-b" style={{ borderColor: color }}>Rate</th>
              <th className="text-right pb-3 text-[10px] uppercase tracking-[0.2em] font-light text-gray-300 border-b" style={{ borderColor: color }}>VAT</th>
              <th className="text-right pb-3 text-[10px] uppercase tracking-[0.2em] font-light text-gray-300 border-b" style={{ borderColor: color }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-4">
                  <p className="font-medium text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5 font-light">{item.description}</p>}
                </td>
                <td className="py-4 text-right text-gray-500 font-light">{item.quantity}</td>
                <td className="py-4 text-right text-gray-500 font-light">{formatCurrency(item.unit_price, invoice.currency)}</td>
                <td className="py-4 text-right text-gray-400 text-xs font-light">{item.vat_rate}%</td>
                <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(item.line_total, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-8">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400 font-light"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.total_discount > 0 && <div className="flex justify-between text-red-400 font-light"><span>Discount</span><span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
            {invoice.total_vat > 0 && <div className="flex justify-between text-gray-400 font-light"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
            <div className="h-px" style={{ backgroundColor: color }} />
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs uppercase tracking-wider text-gray-400">Total</span>
              <span className="text-2xl font-light" style={{ color }}>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8 text-xs text-gray-500 font-light" style={{ borderLeft: `2px solid ${color}`, paddingLeft: '12px' }}>
            <p className="font-medium text-gray-700 mb-1">Notes</p>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>

      <div className="px-12 pb-10 pt-4">
        <InvoiceFooter invoice={invoice} brandColor={color} />
      </div>
    </div>
  );
}
