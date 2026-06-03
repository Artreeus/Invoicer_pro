import type { TemplateProps } from './shared';
import { CompanyHeader, TaxInfo, ClientInfo, InvoiceFooter, TotalsSection } from './shared';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ServiceTemplate({ invoice, company, client, items }: TemplateProps) {
  const color = company.brand_color || '#0d9488';
  return (
    <div className="bg-white min-h-[1122px] flex flex-col" style={{ width: '794px', padding: '40px' }}>
      <CompanyHeader company={company} brandColor={color} />
      <TaxInfo company={company} />

      <div className="my-6 p-4 rounded-xl" style={{ backgroundColor: `${color}08`, borderLeft: `4px solid ${color}` }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Service Invoice</p>
            <p className="text-lg font-bold text-gray-900">{invoice.invoice_number}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Issued: {formatDate(invoice.issue_date)}</p>
            {invoice.due_date && <p>Due: {formatDate(invoice.due_date)}</p>}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <ClientInfo client={client} invoice={invoice} />
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Services Provided</p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{item.item_name}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>}
                </div>
                <p className="font-semibold text-sm ml-4" style={{ color }}>{formatCurrency(item.line_total, invoice.currency)}</p>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>Qty: {item.quantity}</span>
                <span>Rate: {formatCurrency(item.unit_price, invoice.currency)}</span>
                {item.vat_rate > 0 && <span>VAT: {item.vat_rate}%</span>}
                {item.discount_value > 0 && (
                  <span>Discount: {item.discount_type === 'percentage' ? `${item.discount_value}%` : formatCurrency(item.discount_value, invoice.currency)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <TotalsSection invoice={invoice} brandColor={color} />
      </div>

      <InvoiceFooter invoice={invoice} brandColor={color} />
    </div>
  );
}
