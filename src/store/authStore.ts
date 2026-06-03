import { create } from 'zustand';
import { api, setAuthToken, getAuthToken, setUnauthorizedHandler } from '../lib/api';
import { useCompanyStore } from './companyStore';
import { useClientStore } from './clientStore';
import { useInvoiceStore } from './invoiceStore';
import { useItemLibraryStore } from './itemLibraryStore';
import type { User } from '../types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  status: AuthStatus;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

// Clear any data the previous session loaded into memory.
function resetDataStores() {
  useCompanyStore.setState({ companies: [], activeCompanyId: null });
  useClientStore.setState({ clients: [] });
  useInvoiceStore.setState({ invoices: [] });
  useItemLibraryStore.setState({ items: [] });
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',

  // Called once on app start: validate any stored token and restore the session.
  initialize: async () => {
    setUnauthorizedHandler(() => {
      setAuthToken(null);
      resetDataStores();
      set({ user: null, status: 'unauthenticated' });
    });

    if (!getAuthToken()) {
      set({ status: 'unauthenticated' });
      return;
    }
    try {
      const user = await api.get<User>('/auth/me');
      set({ user, status: 'authenticated' });
    } catch {
      setAuthToken(null);
      set({ user: null, status: 'unauthenticated' });
    }
  },

  login: async (email, password) => {
    const { token, user } = await api.post<AuthResponse>('/auth/login', { email, password });
    setAuthToken(token);
    resetDataStores();
    set({ user, status: 'authenticated' });
  },

  register: async (name, email, password) => {
    const { token, user } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setAuthToken(token);
    resetDataStores();
    set({ user, status: 'authenticated' });
  },

  updateProfile: async (updates) => {
    const user = await api.patch<User>('/auth/me', updates);
    set({ user });
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  logout: () => {
    setAuthToken(null);
    resetDataStores();
    set({ user: null, status: 'unauthenticated' });
  },
}));
