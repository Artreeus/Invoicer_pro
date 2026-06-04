import { useState } from 'react';
import { Building2, Plus, Pencil, Trash2, Globe, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyStore } from '../store/companyStore';
import type { Company } from '../types';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import CompanyForm from '../components/companies/CompanyForm';

export default function CompaniesPage() {
  const { companies, loading, addCompany, updateCompany, deleteCompany, setActiveCompany, activeCompanyId } = useCompanyStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditing(company);
    setModalOpen(true);
  };

  const handleDelete = async (company: Company) => {
    if (!confirm(`Delete "${company.name}"? All associated invoices and clients will be removed.`)) return;
    await deleteCompany(company.id);
    toast.success('Company deleted');
  };

  const handleSubmit = async (data: Partial<Company>) => {
    if (editing) {
      await updateCompany(editing.id, data);
      toast.success('Company updated');
    } else {
      await addCompany(data);
      toast.success('Company added');
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Companies</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your business profiles</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Company</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" /><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20" /></div>
              </div>
              <div className="space-y-2"><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded" /><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add your first company to start creating invoices."
          action={
            <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
              <Plus size={16} /> Add Company
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <div
              key={company.id}
              className={`bg-white dark:bg-gray-900 rounded-xl border-2 p-6 transition-all hover:shadow-md cursor-pointer group ${
                company.id === activeCompanyId ? 'border-teal-500 shadow-sm' : 'border-gray-100 dark:border-gray-800'
              }`}
              onClick={() => setActiveCompany(company.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: company.brand_color || '#0d9488' }}
                    >
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{company.name}</h3>
                    {company.id === activeCompanyId && (
                      <span className="text-xs text-teal-600 dark:text-teal-300 font-medium">Active</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(company); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(company); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                {company.address && (
                  <p className="truncate">{company.address}</p>
                )}
                {company.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} />
                    <span className="truncate">{company.phone}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} />
                    <span className="truncate">{company.website}</span>
                  </div>
                )}
              </div>

              {(company.bin || company.tin) && (
                <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                  {company.bin && <span>BIN: {company.bin}</span>}
                  {company.tin && <span>TIN: {company.tin}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Company' : 'Add Company'}
        size="lg"
      >
        <CompanyForm
          company={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
