import { create } from 'zustand';
import { api, qs } from '../lib/api';
import type { Client } from '../types';

interface ClientState {
  clients: Client[];
  loading: boolean;
  fetchClients: (companyId: string) => Promise<void>;
  addClient: (client: Partial<Client>) => Promise<Client | null>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  loading: false,

  fetchClients: async (companyId: string) => {
    set({ loading: true });
    const clients = await api.get<Client[]>(`/clients${qs({ company_id: companyId })}`);
    set({ clients, loading: false });
  },

  addClient: async (client: Partial<Client>) => {
    const newClient = await api.post<Client>('/clients', client);
    if (newClient) {
      set(s => ({ clients: [...s.clients, newClient] }));
      return newClient;
    }
    return null;
  },

  updateClient: async (id: string, updates: Partial<Client>) => {
    await api.patch(`/clients/${id}`, updates);
    set(s => ({
      clients: s.clients.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  },

  deleteClient: async (id: string) => {
    await api.del(`/clients/${id}`);
    set(s => ({ clients: s.clients.filter(c => c.id !== id) }));
  },
}));
