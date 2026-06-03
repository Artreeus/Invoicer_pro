import { Link } from 'react-router-dom';
import {
  FileText, Building2, Users, BarChart3, Download,
  Wallet, ShieldCheck, ArrowRight, Check,
} from 'lucide-react';
import { INVOICE_TEMPLATES } from '../types';
import { useSeo } from '../lib/useSeo';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';
import AdUnit from '../components/ads/AdUnit';

const features = [
  { icon: FileText, title: '13 professional templates', desc: 'From Corporate to Creative — pick a design that fits your brand and switch anytime.' },
  { icon: Building2, title: 'Multiple companies', desc: 'Manage separate business profiles, each with its own branding, logo and invoice numbering.' },
  { icon: Wallet, title: 'VAT & BDT ready', desc: 'Built for Bangladesh: BIN/TIN, VAT rates, and bKash, Nagad & Rocket payment details.' },
  { icon: Download, title: 'Export anywhere', desc: 'Download polished invoices as PDF or PNG, or print them directly — pixel-perfect.' },
  { icon: Users, title: 'Clients & item library', desc: 'Save clients and reusable line items to build new invoices in seconds.' },
  { icon: BarChart3, title: 'Reports & VAT summaries', desc: 'Track revenue, outstanding payments and collected VAT across any date range.' },
];

export default function LandingPage() {
  useSeo(
    'InvoiceBD — Free VAT Invoice Generator for Bangladesh',
    'Create professional, VAT-compliant invoices in minutes. 13 templates, multi-company support, and bKash/Nagad/Rocket payment details — free.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 to-white dark:from-teal-900/20 dark:to-gray-950" />
          <div className="relative max-w-6xl mx-auto px-4 lg:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-500/20 px-3 py-1 rounded-full">
              <ShieldCheck size={13} /> VAT-compliant invoicing for Bangladesh
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Professional invoices,<br />
              <span className="text-teal-600 dark:text-teal-400">built for Bangladesh.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create, send, and track VAT-compliant invoices in minutes — with polished templates,
              multi-company support, and local payment details built in.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >
                Get started free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign in
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              {['No credit card required', 'Free to start', '13 templates included'].map(t => (
                <span key={t} className="flex items-center gap-1.5"><Check size={15} className="text-teal-600 dark:text-teal-400" /> {t}</span>
              ))}
            </div>
            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              Just need one invoice?{' '}
              <Link to="/invoice-generator" className="font-medium text-teal-600 dark:text-teal-400 hover:underline">
                Try the free generator — no sign-up →
              </Link>
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need to get paid</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              A complete invoicing toolkit, tailored to how businesses in Bangladesh actually work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-4">
                  <f.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Templates */}
        <section className="bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-20 text-center">
            <h2 className="text-3xl font-bold">{INVOICE_TEMPLATES.length} designs, one click away</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Switch any invoice between professionally designed templates without losing your data.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {INVOICE_TEMPLATES.map(t => (
                <span key={t.id} className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Ad */}
        <AdUnit className="max-w-3xl mx-auto px-4 lg:px-6 mt-12" />

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 px-6 py-14 lg:px-16 text-center text-white">
            <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl lg:text-4xl font-bold">Ready to send your first invoice?</h2>
            <p className="relative mt-4 text-teal-100 max-w-lg mx-auto">
              Set up your company and create a professional, VAT-ready invoice in under five minutes.
            </p>
            <Link
              to="/register"
              className="relative mt-8 inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-7 py-3 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Create your free account <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
