import { Link } from 'react-router-dom';
import { Receipt, ArrowLeft, Check } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const highlights = [
  '13 professional invoice templates',
  'VAT & BDT ready for Bangladesh',
  'Export to PDF, PNG or print',
];

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Branding panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-emerald-400/10 blur-2xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10 w-fit">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Receipt size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg">InvoiceBD</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight">
            Professional invoices,<br />built for Bangladesh.
          </h2>
          <p className="mt-4 text-teal-100 max-w-md">
            Create, send, and track VAT-compliant invoices in minutes.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map(h => (
              <li key={h} className="flex items-center gap-3 text-teal-50">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={12} />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-teal-200">© {currentYear()} InvoiceBD</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Receipt size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100">InvoiceBD</span>
          </Link>
          <div className="flex items-center gap-1 ml-auto">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2"
            >
              <ArrowLeft size={15} /> Back to home
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            </div>
            {children}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function currentYear() {
  return new Date().getFullYear();
}
