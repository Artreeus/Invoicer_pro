import { create } from 'zustand';
import { api } from '../lib/api';
import type { Company } from '../types';

interface CompanyState {
  companies: Company[];
  activeCompanyId: string | null;
  loading: boolean;
  activeCompany: () => Company | null;
  fetchCompanies: () => Promise<void>;
  setActiveCompany: (id: string) => void;
  addCompany: (company: Partial<Company>) => Promise<Company | null>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getNextInvoiceNumber: (companyId: string) => Promise<string>;
  incrementInvoiceNumber: (companyId: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  activeCompanyId: null,
  loading: false,

  activeCompany: () => {
    const { companies, activeCompanyId } = get();
    return companies.find(c => c.id === activeCompanyId) ?? null;
  },

  fetchCompanies: async () => {
    set({ loading: true });
    const companies = await api.get<Company[]>('/companies');
    set({ companies, loading: false });
    if (companies.length > 0 && !get().activeCompanyId) {
      set({ activeCompanyId: companies[0].id });
    }
  },

  setActiveCompany: (id: string) => set({ activeCompanyId: id }),

  addCompany: async (company: Partial<Company>) => {
    const newCompany = await api.post<Company>('/companies', company);
    if (newCompany) {
      set(s => ({
        companies: [...s.companies, newCompany],
        activeCompanyId: s.activeCompanyId ?? newCompany.id,
      }));
      return newCompany;
    }
    return null;
  },

  updateCompany: async (id: string, updates: Partial<Company>) => {
    await api.patch(`/companies/${id}`, updates);
    set(s => ({
      companies: s.companies.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  },

  deleteCompany: async (id: string) => {
    await api.del(`/companies/${id}`);
    set(s => {
      const companies = s.companies.filter(c => c.id !== id);
      return {
        companies,
        activeCompanyId: s.activeCompanyId === id
          ? (companies[0]?.id ?? null)
          : s.activeCompanyId,
      };
    });
  },

  getNextInvoiceNumber: async (companyId: string) => {
    const company = get().companies.find(c => c.id === companyId);
    if (!company) return 'INV-0001';
    const prefix = company.invoice_prefix || 'INV';
    const num = company.next_invoice_number || 1;
    const padded = String(num).padStart(4, '0');
    return `${prefix}-${padded}`;
  },

  incrementInvoiceNumber: async (companyId: string) => {
    const company = get().companies.find(c => c.id === companyId);
    if (!company) return;
    const num = (company.next_invoice_number || 1) + 1;
    await api.patch(`/companies/${companyId}`, { next_invoice_number: num });
    set(s => ({
      companies: s.companies.map(c =>
        c.id === companyId ? { ...c, next_invoice_number: num } : c
      ),
    }));
  },
}));
