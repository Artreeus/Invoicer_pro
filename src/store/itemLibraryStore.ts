import { create } from 'zustand';
import { api, qs } from '../lib/api';
import type { ItemLibrary } from '../types';

interface ItemLibraryState {
  items: ItemLibrary[];
  loading: boolean;
  fetchItems: (companyId: string) => Promise<void>;
  addItem: (item: Partial<ItemLibrary>) => Promise<ItemLibrary | null>;
  updateItem: (id: string, updates: Partial<ItemLibrary>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useItemLibraryStore = create<ItemLibraryState>((set) => ({
  items: [],
  loading: false,

  fetchItems: async (companyId: string) => {
    set({ loading: true });
    const items = await api.get<ItemLibrary[]>(`/item-library${qs({ company_id: companyId })}`);
    set({ items, loading: false });
  },

  addItem: async (item: Partial<ItemLibrary>) => {
    const newItem = await api.post<ItemLibrary>('/item-library', item);
    if (newItem) {
      set(s => ({ items: [...s.items, newItem] }));
      return newItem;
    }
    return null;
  },

  updateItem: async (id: string, updates: Partial<ItemLibrary>) => {
    await api.patch(`/item-library/${id}`, updates);
    set(s => ({
      items: s.items.map(i => i.id === id ? { ...i, ...updates } : i),
    }));
  },

  deleteItem: async (id: string) => {
    await api.del(`/item-library/${id}`);
    set(s => ({ items: s.items.filter(i => i.id !== id) }));
  },
}));
