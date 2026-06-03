import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CompaniesPage from './pages/CompaniesPage';
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceFormPage from './pages/InvoiceFormPage';
import InvoicePreviewPage from './pages/InvoicePreviewPage';
import ItemLibraryPage from './pages/ItemLibraryPage';
import ReportsPage from './pages/ReportsPage';
import { useCompanyStore } from './store/companyStore';

function App() {
  const fetchCompanies = useCompanyStore(s => s.fetchCompanies);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/new" element={<InvoiceFormPage />} />
          <Route path="invoices/:id/edit" element={<InvoiceFormPage />} />
          <Route path="invoices/:id/preview" element={<InvoicePreviewPage />} />
          <Route path="item-library" element={<ItemLibraryPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
