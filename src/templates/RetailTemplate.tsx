import type { TemplateProps } from './shared';
import { InvoiceFooter } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function RetailTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px' }}>
      <div className="px-10 py-8 flex justify-between items-start" style={{ borderBottom: `3px solid ${color}` }}>
        <div className="flex items-center gap-4">
          {company.logo_url ? (
            <img src={company.logo_url} alt="" className="h-14 object-contain" />
          ) : (
            <div className="h-14 w-14 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: color }}>
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-xs text-gray-400">{company.phone} {company.email && `| ${company.email}`}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <div className="inline-block px-3 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: color }}>
              {invoice.status}
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">{invoice.invoice_number}</p>
          <p className="text-xs text-gray-400">{formatDate(invoice.issue_date)}</p>
        </div>
      </div>

      <div className="px-10 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-gray-50 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Customer</p>
            {client ? (
              <>
                <p className="font-bold text-gray-900 text-base">{client.name}</p>
                {client.address && <p className="text-xs text-gray-500 mt-1">{client.address}</p>}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  {client.phone && <span>{client.phone}</span>}
                  {client.email && <span>{client.email}</span>}
                </div>
              </>
            ) : <p className="text-gray-300">--</p>}
          </div>
          <div className="space-y-2">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-400 font-medium">Due</p>
              <p className="text-sm font-bold text-gray-900">{invoice.due_date ? formatDate(invoice.due_date) : 'On Receipt'}</p>
            </div>
            <div className="rounded-xl p-3 text-center text-white" style={{ backgroundColor: color }}>
              <p className="text-[10px] opacity-70">Total</p>
              <p className="text-lg font-bold">{formatCurrency(invoice.grand_total, invoice.currency)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Items</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: color }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{item.item_name}</p>
                {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{item.quantity} x {formatCurrency(item.unit_price, invoice.currency)}</span>
                  {item.vat_rate > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{item.vat_rate}% VAT</span>}
                  {item.discount_value > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-50 rounded text-red-500">
                      -{item.discount_type === 'percentage' ? `${item.discount_value}%` : formatCurrency(item.discount_value, invoice.currency)}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-bold text-sm flex-shrink-0" style={{ color }}>{formatCurrency(item.line_total, invoice.currency)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-72 bg-gray-50 rounded-xl p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
              {invoice.total_discount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-{formatCurrency(invoice.total_discount, invoice.currency)}</span></div>}
              {invoice.total_vat > 0 && <div className="flex justify-between text-gray-500"><span>VAT</span><span>{formatCurrency(invoice.total_vat, invoice.currency)}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200" style={{ color }}>
                <span>Total</span><span>{formatCurrency(invoice.grand_total, invoice.currency)}</span>
              </div>
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
