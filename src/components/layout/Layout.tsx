import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { useCompanyStore } from '../../store/companyStore';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const fetchCompanies = useCompanyStore(s => s.fetchCompanies);

  // Load the signed-in user's companies once the authenticated shell mounts.
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
