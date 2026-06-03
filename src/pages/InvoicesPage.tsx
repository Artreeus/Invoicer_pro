import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Eye, Pencil, Trash2, Copy, CheckCircle, Clock, Send, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyStore } from '../store/companyStore';
import { useInvoiceStore } from '../store/invoiceStore';
import type { Invoice, InvoiceStatus } from '../types';
import { formatCurrency, formatDate, statusColor, effectiveStatus, isOverdue, daysFromToday } from '../lib/utils';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

const STATUS_OPTIONS: { value: InvoiceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function InvoicesPage() {
  const navigate = useNavigate();
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const { invoices, loading, fetchInvoices, deleteInvoice, updateInvoiceStatus, duplicateInvoice } = useInvoiceStore();
  const companies = useCompanyStore(s => s.companies);
  const incrementInvoiceNumber = useCompanyStore(s => s.incrementInvoiceNumber);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  useEffect(() => {
    if (activeCompanyId) fetchInvoices(activeCompanyId);
  }, [activeCompanyId, fetchInvoices]);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client as any)?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || effectiveStatus(inv) === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDuplicate = async (inv: Invoice) => {
    if (!activeCompanyId) return;
    const full = await useInvoiceStore.getState().fetchInvoiceById(inv.id);
    if (!full) return;
    const company = companies.find(c => c.id === activeCompanyId);
    const prefix = company?.invoice_prefix || 'INV';
    const num = company?.next_invoice_number || 1;
    const newNumber = `${prefix}-${String(num).padStart(4, '0')}`;
    const dup = await duplicateInvoice({ ...full, invoice_number: newNumber });
    if (dup) {
      await incrementInvoiceNumber(activeCompanyId);
      await fetchInvoices(activeCompanyId);
      toast.success('Invoice duplicated');
    }
  };

  const handleDelete = async (inv: Invoice) => {
    if (!confirm(`Delete invoice ${inv.invoice_number}?`)) return;
    await deleteInvoice(inv.id);
    toast.success('Invoice deleted');
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={12} />;
      case 'sent': return <Send size={12} />;
      case 'overdue': return <Clock size={12} />;
      case 'cancelled': return <Ban size={12} />;
      default: return null;
    }
  };

  // Inline due-date hint shown next to an unpaid invoice's date.
  const dueLabel = (inv: Invoice) => {
    if (inv.status !== 'sent' || !inv.due_date) return null;
    const days = daysFromToday(inv.due_date);
    if (isOverdue(inv)) {
      const n = Math.abs(days);
      return <span className="text-red-500 font-medium"> · Overdue by {n} day{n === 1 ? '' : 's'}</span>;
    }
    if (days === 0) return <span className="text-amber-500 font-medium"> · Due today</span>;
    if (days <= 7) return <span className="text-amber-500"> · Due in {days} day{days === 1 ? '' : 's'}</span>;
    return null;
  };

  if (!activeCompanyId) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <EmptyState icon={FileText} title="Select a company" description="Please select or add a company first." />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">{invoices.length} total invoices</p>
        </div>
        <button
          onClick={() => navigate('/invoices/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Invoice</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice number or client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg overflow-x-auto">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                statusFilter === opt.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div><div className="h-4 bg-gray-200 rounded w-24 mb-2" /><div className="h-3 bg-gray-100 rounded w-40" /></div>
                <div className="h-6 bg-gray-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search || statusFilter !== 'all' ? 'No matching invoices' : 'No invoices yet'}
          description={search || statusFilter !== 'all' ? 'Try a different filter.' : 'Create your first invoice.'}
          action={!search && statusFilter === 'all' ? (
            <button onClick={() => navigate('/invoices/new')} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
              <Plus size={16} /> New Invoice
            </button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(inv => (
            <div
              key={inv.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{inv.invoice_number}</span>
                      <Badge className={statusColor(effectiveStatus(inv))}>
                        <span className="flex items-center gap-1">{statusIcon(effectiveStatus(inv))} {effectiveStatus(inv)}</span>
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {(inv.client as any)?.name ?? 'No client'} &middot; {formatDate(inv.issue_date)}
                      {dueLabel(inv)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900 text-sm hidden sm:block">
                    {formatCurrency(inv.grand_total, inv.currency)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/invoices/${inv.id}/preview`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Preview">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => navigate(`/invoices/${inv.id}/edit`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDuplicate(inv)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Duplicate">
                      <Copy size={14} />
                    </button>
                    {inv.status === 'draft' && (
                      <button onClick={() => { updateInvoiceStatus(inv.id, 'sent'); toast.success('Marked as sent'); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Mark as Sent">
                        <Send size={14} />
                      </button>
                    )}
                    {inv.status === 'sent' && (
                      <button onClick={() => { updateInvoiceStatus(inv.id, 'paid'); toast.success('Marked as paid'); }} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors" title="Mark as Paid">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(inv)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
