import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyStore } from '../store/companyStore';
import { useItemLibraryStore } from '../store/itemLibraryStore';
import type { ItemLibrary } from '../types';
import { VAT_RATES } from '../types';
import { formatCurrency } from '../lib/utils';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export default function ItemLibraryPage() {
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const { items, loading, fetchItems, addItem, updateItem, deleteItem } = useItemLibraryStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ItemLibrary | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeCompanyId) fetchItems(activeCompanyId);
  }, [activeCompanyId, fetchItems]);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      default_unit_price: Number(fd.get('default_unit_price')),
      default_vat_rate: Number(fd.get('default_vat_rate')),
      category: fd.get('category') as string,
      company_id: activeCompanyId!,
    };
    if (editing) {
      await updateItem(editing.id, data);
      toast.success('Item updated');
    } else {
      await addItem(data);
      toast.success('Item added');
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (item: ItemLibrary) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deleteItem(item.id);
    toast.success('Item deleted');
  };

  if (!activeCompanyId) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <EmptyState icon={Package} title="Select a company" description="Please select a company to manage your item library." />
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all';

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Item Library</h1>
          <p className="text-sm text-gray-500 mt-1">Reusable items for quick invoicing</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>

      {items.length > 0 && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-48" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search ? 'No matching items' : 'No saved items'}
          description={search ? 'Try a different search term.' : 'Save frequently used items for quick access when creating invoices.'}
          action={!search ? (
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
              <Plus size={16} /> Add Item
            </button>
          ) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow group">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  {item.category && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">{item.category}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(item); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {item.description && <p className="text-xs text-gray-400 mb-3">{item.description}</p>}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-600">{formatCurrency(item.default_unit_price, 'BDT')}</span>
                <span className="text-gray-400">VAT {item.default_vat_rate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Item' : 'Add Item'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input name="name" className={inputClass} required defaultValue={editing?.name ?? ''} placeholder="e.g. Web Development" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" className={inputClass} rows={2} defaultValue={editing?.description ?? ''} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Price (BDT)</label>
              <input name="default_unit_price" type="number" step="0.01" className={inputClass} defaultValue={editing?.default_unit_price ?? 0} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default VAT Rate</label>
              <select name="default_vat_rate" className={inputClass} defaultValue={editing?.default_vat_rate ?? 15}>
                {VAT_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" className={inputClass} defaultValue={editing?.category ?? ''} placeholder="e.g. Services, Products" list="categories" />
            <datalist id="categories">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">{editing ? 'Update' : 'Add Item'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
