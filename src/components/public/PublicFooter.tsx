import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { to: '/', label: 'Home' },
      { to: '/invoice-generator', label: 'Free generator' },
      { to: '/register', label: 'Get started' },
      { to: '/login', label: 'Sign in' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/templates', label: 'Templates' },
      { to: '/blog', label: 'Blog' },
      { to: '/about', label: 'About us' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <Receipt size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">InvoiceBD</span>
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Free, professional, VAT-compliant invoicing built for businesses and freelancers in Bangladesh.
            </p>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} InvoiceBD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
