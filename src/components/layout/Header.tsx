import { ChevronDown, Plus, Receipt, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyStore } from '../../store/companyStore';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  const { companies, activeCompanyId, setActiveCompany } = useCompanyStore();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const activeCompany = companies.find(c => c.id === activeCompanyId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
          <Receipt size={18} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-gray-100">InvoiceBD</span>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <div className="relative" ref={dropdownRef}>
          {companies.length > 0 ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                {activeCompany?.logo_url ? (
                  <img src={activeCompany.logo_url} alt="" className="w-5 h-5 rounded object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-300">
                    {activeCompany?.name?.charAt(0) ?? 'C'}
                  </div>
                )}
                <span className="font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                  {activeCompany?.name ?? 'Select Company'}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50">
                  {companies.map(company => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setActiveCompany(company.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        company.id === activeCompanyId
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {company.logo_url ? (
                        <img src={company.logo_url} alt="" className="w-6 h-6 rounded object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300">
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
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              <Plus size={14} />
              <span>Add a company to get started</span>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? <UserIcon size={16} />}
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings size={16} className="text-gray-400" />
                Account settings
              </Link>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800"
              >
                <LogOut size={16} className="text-gray-400" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
