import { create } from 'zustand';
import { toast } from 'sonner';
import { api, qs } from '../lib/api';
import type { Invoice, InvoiceItem } from '../types';

interface InvoiceState {
  invoices: Invoice[];
  loading: boolean;
  fetchInvoices: (companyId: string) => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<Invoice | null>;
  addInvoice: (invoice: Partial<Invoice>, items: Partial<InvoiceItem>[]) => Promise<Invoice | null>;
  updateInvoice: (id: string, updates: Partial<Invoice>, items: Partial<InvoiceItem>[]) => Promise<void>;
  updateInvoiceStatus: (id: string, status: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  duplicateInvoice: (invoice: Invoice) => Promise<Invoice | null>;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  loading: false,

  fetchInvoices: async (companyId: string) => {
    set({ loading: true });
    const invoices = await api.get<Invoice[]>(`/invoices${qs({ company_id: companyId })}`);
    set({ invoices, loading: false });
  },

  fetchInvoiceById: async (id: string) => {
    try {
      return await api.get<Invoice>(`/invoices/${id}`);
    } catch {
      return null;
    }
  },

  addInvoice: async (invoice: Partial<Invoice>, items: Partial<InvoiceItem>[]) => {
    try {
      const newInvoice = await api.post<Invoice>('/invoices', { invoice, items });
      set(s => ({ invoices: [newInvoice, ...s.invoices] }));
      return newInvoice;
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error('Failed to create invoice');
      return null;
    }
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>, items: Partial<InvoiceItem>[]) => {
    try {
      await api.put(`/invoices/${id}`, { updates, items });
      set(s => ({
        invoices: s.invoices.map(inv =>
          inv.id === id ? { ...inv, ...updates } : inv
        ),
      }));
    } catch (err) {
      console.error('Error updating invoice:', err);
      toast.error('Failed to update invoice');
    }
  },

  updateInvoiceStatus: async (id: string, status: string) => {
    await api.patch(`/invoices/${id}/status`, { status });
    set(s => ({
      invoices: s.invoices.map(inv =>
        inv.id === id ? { ...inv, status: status as Invoice['status'] } : inv
      ),
    }));
  },

  deleteInvoice: async (id: string) => {
    await api.del(`/invoices/${id}`);
    set(s => ({ invoices: s.invoices.filter(inv => inv.id !== id) }));
  },

  duplicateInvoice: async (invoice: Invoice) => {
    const { id, created_at, updated_at, invoice_number, items, client, company, ...rest } = invoice;
    const dup: Partial<Invoice> = {
      ...rest,
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
    };
    const dupItems = (items ?? []).map(({ id, invoice_id, ...item }) => item);
    return get().addInvoice(dup, dupItems as Partial<InvoiceItem>[]);
  },
}));
