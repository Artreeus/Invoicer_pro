import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import Layout from './components/layout/Layout';
import RequireAuth from './components/auth/RequireAuth';
import Dashboard from './pages/Dashboard';
import CompaniesPage from './pages/CompaniesPage';
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceFormPage from './pages/InvoiceFormPage';
import InvoicePreviewPage from './pages/InvoicePreviewPage';
import ItemLibraryPage from './pages/ItemLibraryPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';

function App() {
  const status = useAuthStore(s => s.status);
  const initialize = useAuthStore(s => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={28} className="animate-spin text-teal-600" />
      </div>
    );
  }

  const authed = status === 'authenticated';

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={authed ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={authed ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
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
