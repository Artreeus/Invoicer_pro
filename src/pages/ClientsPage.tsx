import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyStore } from '../store/companyStore';
import { useClientStore } from '../store/clientStore';
import type { Client } from '../types';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

export default function ClientsPage() {
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const { clients, loading, fetchClients, addClient, updateClient, deleteClient } = useClientStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeCompanyId) fetchClients(activeCompanyId);
  }, [activeCompanyId, fetchClients]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      address: fd.get('address') as string,
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
      contact_person: fd.get('contact_person') as string,
      bin: fd.get('bin') as string,
      tin: fd.get('tin') as string,
      notes: fd.get('notes') as string,
      company_id: activeCompanyId!,
    };
    if (editing) {
      await updateClient(editing.id, data);
      toast.success('Client updated');
    } else {
      await addClient(data);
      toast.success('Client added');
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Delete "${client.name}"?`)) return;
    await deleteClient(client.id);
    toast.success('Client deleted');
  };

  if (!activeCompanyId) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <EmptyState icon={Users} title="Select a company" description="Please select or add a company first to manage clients." />
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all';

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Client</span>
        </button>
      </div>

      {clients.length > 0 && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-60" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'No matching clients' : 'No clients yet'}
          description={search ? 'Try a different search term.' : 'Add your first client to start invoicing.'}
          action={!search ? (
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
              <Plus size={16} /> Add Client
            </button>
          ) : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact Person</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{client.name}</div>
                      {client.address && <div className="text-xs text-gray-400 truncate max-w-[200px]">{client.address}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{client.contact_person}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{client.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{client.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditing(client); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(client)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Client' : 'Add Client'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
            <input name="name" className={inputClass} required defaultValue={editing?.name ?? ''} placeholder="Company or individual name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input name="contact_person" className={inputClass} defaultValue={editing?.contact_person ?? ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" className={inputClass} rows={2} defaultValue={editing?.address ?? ''} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" className={inputClass} defaultValue={editing?.phone ?? ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" className={inputClass} defaultValue={editing?.email ?? ''} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BIN</label>
              <input name="bin" className={inputClass} defaultValue={editing?.bin ?? ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TIN</label>
              <input name="tin" className={inputClass} defaultValue={editing?.tin ?? ''} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" className={inputClass} rows={2} defaultValue={editing?.notes ?? ''} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">{editing ? 'Update' : 'Add Client'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
