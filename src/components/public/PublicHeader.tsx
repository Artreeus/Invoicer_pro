import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Receipt, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const navLinks = [
  { to: '/invoice-generator', label: 'Free Generator' },
  { to: '/templates', label: 'Templates' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

export default function PublicHeader() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'text-teal-600 dark:text-teal-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <Receipt size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">InvoiceBD</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-3 py-2">
            Sign in
          </Link>
          <Link to="/register" className="hidden md:block text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Get started
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg">
              Sign in
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
