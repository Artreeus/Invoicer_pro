import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart, Globe } from 'lucide-react';
import { useSeo } from '../../lib/useSeo';
import AdUnit from '../../components/ads/AdUnit';

export default function AboutPage() {
  useSeo(
    'About InvoiceBD — Invoicing built for Bangladesh',
    'InvoiceBD is a free invoicing tool built for Bangladeshi businesses and freelancers, with VAT support and local payment methods.'
  );

  const values = [
    { icon: Target, title: 'Built for local needs', desc: 'VAT, BIN/TIN, and bKash/Nagad/Rocket are first-class features, not afterthoughts.' },
    { icon: Heart, title: 'Free and simple', desc: 'A clean, fast tool anyone can use — no accounting degree required.' },
    { icon: Globe, title: 'Professional results', desc: 'Thirteen polished templates so every invoice represents your business well.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">About InvoiceBD</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        InvoiceBD is a free, professional invoicing tool made for the way businesses in Bangladesh actually work.
      </p>

      <div className="mt-8 space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          Most invoicing software is designed for businesses in Europe or North America. That leaves freelancers,
          small shops and growing companies in Bangladesh wrestling with tools that don’t understand local VAT rules,
          don’t have a place for a BIN or TIN, and have never heard of bKash or Nagad. We built InvoiceBD to fix that.
        </p>
        <p>
          Our goal is simple: let anyone create a clean, accurate, VAT-compliant invoice in a couple of minutes, and get
          paid faster. You can manage multiple companies, keep a tidy list of clients, save reusable items, and export
          every invoice as a polished PDF — all in one place.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {values.map(v => (
          <div key={v.title} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-3">
              <v.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{v.title}</h3>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
          </div>
        ))}
      </div>

      <AdUnit className="my-12" />

      <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Start invoicing today</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">It’s free to get started — no credit card needed.</p>
        <Link
          to="/register"
          className="mt-5 inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Create your free account <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
