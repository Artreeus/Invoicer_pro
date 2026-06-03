import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, Clock, AlertTriangle, Plus, Users, ArrowRight } from 'lucide-react';
import { useCompanyStore } from '../store/companyStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { useClientStore } from '../store/clientStore';
import { formatCurrency, formatDate, statusColor, effectiveStatus } from '../lib/utils';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function Dashboard() {
  const navigate = useNavigate();
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companies = useCompanyStore(s => s.companies);
  const activeCompany = useCompanyStore(s => s.activeCompany)();
  const { invoices, fetchInvoices } = useInvoiceStore();
  const { clients, fetchClients } = useClientStore();

  useEffect(() => {
    if (activeCompanyId) {
      fetchInvoices(activeCompanyId);
      fetchClients(activeCompanyId);
    }
  }, [activeCompanyId, fetchInvoices, fetchClients]);

  if (!activeCompanyId || companies.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <EmptyState
          icon={FileText}
          title="Welcome to InvoiceBD"
          description="Add your first company to start creating professional invoices."
          action={
            <button
              onClick={() => navigate('/companies')}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus size={16} /> Add Company
            </button>
          }
        />
      </div>
    );
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.grand_total, 0);
  const outstanding = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.grand_total, 0);
  const overdueCount = invoices.filter(i => effectiveStatus(i) === 'overdue').length;
  const draftCount = invoices.filter(i => i.status === 'draft').length;
  const recentInvoices = invoices.slice(0, 5);

  const thisMonth = new Date();
  const monthlyRevenue = invoices
    .filter(i => i.status === 'paid' && new Date(i.issue_date).getMonth() === thisMonth.getMonth() && new Date(i.issue_date).getFullYear() === thisMonth.getFullYear())
    .reduce((s, i) => s + i.grand_total, 0);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue, 'BDT'), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', trend: `${formatCurrency(monthlyRevenue, 'BDT')} this month` },
    { label: 'Outstanding', value: formatCurrency(outstanding, 'BDT'), icon: Clock, color: 'bg-blue-50 text-blue-600', trend: `${invoices.filter(i => i.status === 'sent').length} pending invoices` },
    { label: 'Overdue', value: String(overdueCount), icon: AlertTriangle, color: 'bg-red-50 text-red-600', trend: 'Needs attention' },
    { label: 'Total Clients', value: String(clients.length), icon: Users, color: 'bg-amber-50 text-amber-600', trend: `${draftCount} draft invoices` },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{activeCompany?.name} overview</p>
        </div>
        <button
          onClick={() => navigate('/invoices/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Invoices</h2>
            <button onClick={() => navigate('/invoices')} className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-2">
              {recentInvoices.map(inv => (
                <div
                  key={inv.id}
                  onClick={() => navigate(`/invoices/${inv.id}/preview`)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{inv.invoice_number}</span>
                      <Badge className={statusColor(effectiveStatus(inv))}>{effectiveStatus(inv)}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{(inv.client as any)?.name ?? 'No client'} &middot; {formatDate(inv.issue_date)}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(inv.grand_total, inv.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Invoice Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Paid', count: invoices.filter(i => i.status === 'paid').length, color: '#10b981' },
              { label: 'Sent', count: invoices.filter(i => effectiveStatus(i) === 'sent').length, color: '#3b82f6' },
              { label: 'Draft', count: invoices.filter(i => i.status === 'draft').length, color: '#9ca3af' },
              { label: 'Overdue', count: invoices.filter(i => effectiveStatus(i) === 'overdue').length, color: '#ef4444' },
            ].map(item => {
              const total = invoices.length || 1;
              const pct = (item.count / total) * 100;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-400">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => navigate('/invoices/new')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                Create New Invoice
              </button>
              <button onClick={() => navigate('/clients')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                Manage Clients
              </button>
              <button onClick={() => navigate('/reports')} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
