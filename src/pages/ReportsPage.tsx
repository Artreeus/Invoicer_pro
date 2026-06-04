import { useEffect, useState, useMemo } from 'react';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { useCompanyStore } from '../store/companyStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { formatCurrency } from '../lib/utils';
import EmptyState from '../components/ui/EmptyState';

export default function ReportsPage() {
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const { invoices, fetchInvoices } = useInvoiceStore();
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (activeCompanyId) fetchInvoices(activeCompanyId);
  }, [activeCompanyId, fetchInvoices]);

  const filtered = useMemo(() =>
    invoices.filter(inv => inv.issue_date >= dateFrom && inv.issue_date <= dateTo),
    [invoices, dateFrom, dateTo]
  );

  const totalVat = useMemo(
    () => filtered.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_vat, 0),
    [filtered]
  );

  const monthlySummary = useMemo(() => {
    const months: Record<string, { revenue: number; count: number }> = {};
    filtered.filter(i => i.status === 'paid').forEach(inv => {
      const key = inv.issue_date.substring(0, 7);
      if (!months[key]) months[key] = { revenue: 0, count: 0 };
      months[key].revenue += inv.grand_total;
      months[key].count++;
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const clientSummary = useMemo(() => {
    const clients: Record<string, { name: string; total: number; count: number }> = {};
    filtered.forEach(inv => {
      const clientName = (inv as any).client?.name || 'No Client';
      const clientId = inv.client_id || 'none';
      if (!clients[clientId]) clients[clientId] = { name: clientName, total: 0, count: 0 };
      clients[clientId].total += inv.grand_total;
      clients[clientId].count++;
    });
    return Object.values(clients).sort((a, b) => b.total - a.total);
  }, [filtered]);

  const maxMonthlyRevenue = Math.max(...monthlySummary.map(([, d]) => d.revenue), 1);

  const totalRevenue = filtered.filter(i => i.status === 'paid').reduce((s, i) => s + i.grand_total, 0);
  const totalOutstanding = filtered.filter(i => i.status === 'sent').reduce((s, i) => s + i.grand_total, 0);

  const exportCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Client', 'Status', 'Subtotal', 'VAT', 'Discount', 'Grand Total'];
    const rows = filtered.map(inv => [
      inv.invoice_number,
      inv.issue_date,
      (inv as any).client?.name || '',
      inv.status,
      inv.subtotal,
      inv.total_vat,
      inv.total_discount,
      inv.grand_total,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-report-${dateFrom}-to-${dateTo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!activeCompanyId) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <EmptyState icon={BarChart3} title="Select a company" description="Please select a company to view reports." />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Revenue and tax reporting</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm dark:bg-gray-800 dark:text-gray-100" />
        <span className="text-gray-400 dark:text-gray-500 text-sm">to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm dark:bg-gray-800 dark:text-gray-100" />
        <span className="text-xs text-gray-400 dark:text-gray-500">{filtered.length} invoices</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Revenue (Paid)</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalRevenue, 'BDT')}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Outstanding</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(totalOutstanding, 'BDT')}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">VAT Collected</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{formatCurrency(totalVat, 'BDT')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Revenue</h2>
          {monthlySummary.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No revenue data</p>
          ) : (
            <div className="space-y-2">
              {monthlySummary.map(([month, data]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">{month}</span>
                  <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / maxMonthlyRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-28 text-right">{formatCurrency(data.revenue, 'BDT')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenue by Client</h2>
          {clientSummary.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No client data</p>
          ) : (
            <div className="space-y-3">
              {clientSummary.slice(0, 8).map((client, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{client.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{client.count} invoices</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">{formatCurrency(client.total, 'BDT')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
