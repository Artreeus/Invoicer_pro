import { ChevronDown, Plus, Receipt } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCompanyStore } from '../../store/companyStore';

export default function Header() {
  const { companies, activeCompanyId, setActiveCompany } = useCompanyStore();
  const activeCompany = companies.find(c => c.id === activeCompanyId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
          <Receipt size={18} className="text-white" />
        </div>
        <span className="font-bold text-gray-900">InvoiceBD</span>
      </div>

      <div className="hidden lg:block" />

      <div className="relative" ref={dropdownRef}>
        {companies.length > 0 ? (
          <>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
            >
              {activeCompany?.logo_url ? (
                <img src={activeCompany.logo_url} alt="" className="w-5 h-5 rounded object-cover" />
              ) : (
                <div className="w-5 h-5 rounded bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                  {activeCompany?.name?.charAt(0) ?? 'C'}
                </div>
              )}
              <span className="font-medium text-gray-700 max-w-[120px] truncate">
                {activeCompany?.name ?? 'Select Company'}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                {companies.map(company => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setActiveCompany(company.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      company.id === activeCompanyId ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                    }`}
                  >
                    {company.logo_url ? (
                      <img src={company.logo_url} alt="" className="w-6 h-6 rounded object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <span className="truncate">{company.name}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
            <Plus size={14} />
            <span>Add a company to get started</span>
          </div>
        )}
      </div>
    </header>
  );
}
