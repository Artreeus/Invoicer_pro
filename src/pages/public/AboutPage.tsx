import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Heart, Globe, ShieldCheck, Zap, Users,
  FileText, CheckCircle, Lock, Star, Building2,
} from 'lucide-react';
import { useSeo } from '../../lib/useSeo';
import AdUnit from '../../components/ads/AdUnit';

const ABOUT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'InvoiceBD',
  url: 'https://invoicer-pro-ten.vercel.app/',
  description:
    'InvoiceBD is a free, professional invoicing tool built for businesses and freelancers in Bangladesh, offering VAT-compliant invoices, 13 templates, and local payment method support.',
  foundingDate: '2024',
  areaServed: 'BD',
  serviceType: 'Invoice Generation Software',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free invoice generation with no credit card required',
  },
};

const stats = [
  { value: '13', label: 'Professional templates', icon: FileText },
  { value: '100%', label: 'Free to use', icon: Heart },
  { value: '5+', label: 'Currency support', icon: Globe },
  { value: '0', label: 'Credit card required', icon: ShieldCheck },
];

const values = [
  {
    icon: Target,
    title: 'Built for local needs',
    desc: 'VAT, BIN/TIN, bKash/Nagad/Rocket — every Bangladeshi business requirement is a first-class feature, not a workaround.',
  },
  {
    icon: Zap,
    title: 'Fast and intuitive',
    desc: 'Generate a complete, professional invoice in under two minutes. No training or manual required.',
  },
  {
    icon: Globe,
    title: 'Professional results',
    desc: 'Thirteen polished, print-ready templates ensure every invoice you send looks world-class.',
  },
];

const features = [
  'VAT calculations with multiple rate options (0%, 5%, 7.5%, 10%, 15%)',
  'BIN and TIN fields for tax-compliance',
  'bKash, Nagad, and Rocket payment instruction fields',
  '13 professionally designed invoice templates',
  'Multi-currency: BDT, USD, EUR, GBP',
  'Export as PDF or PNG, or print directly',
  'Multi-company and multi-client management',
  'Item library for reusing products and services',
  'Payment status tracking (draft, sent, paid, overdue)',
  'Custom brand colours per company',
  'Unlimited invoices on the free plan',
  'No credit card and no ads for registered users',
];

const trustPoints = [
  {
    icon: Lock,
    title: 'Your data stays yours',
    desc: 'We never sell or share your business data with third parties. Invoices and client details are stored securely and accessible only to you.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    desc: 'All connections are encrypted via HTTPS. Passwords are hashed with bcrypt — we never store plaintext credentials.',
  },
  {
    icon: Users,
    title: 'Built for real businesses',
    desc: 'Designed by invoicing the same pain points Bangladeshi freelancers and business owners face every day — not by guessing.',
  },
  {
    icon: Star,
    title: 'Constantly improving',
    desc: 'We ship improvements regularly based on user feedback. If something is missing, reach out — we listen.',
  },
];

export default function AboutPage() {
  useSeo(
    'About InvoiceBD | Free Invoice Generator for Bangladesh',
    'Learn about InvoiceBD — the free, professional invoice generator built for Bangladeshi businesses and freelancers with VAT, BIN/TIN, and local payment support.',
    {
      canonical: 'https://invoicer-pro-ten.vercel.app/about',
      schema: ABOUT_SCHEMA,
    }
  );

  return (
    <div className="bg-white dark:bg-gray-950">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 lg:px-6 py-16 lg:py-24 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-500/20 px-3 py-1 rounded-full mb-5">
          <Building2 size={13} aria-hidden="true" /> About InvoiceBD
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Professional Invoicing,{' '}
          <span className="text-teal-600 dark:text-teal-400">Built for Bangladesh</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          InvoiceBD is a free, professional invoicing tool made for the way businesses in Bangladesh
          actually work — with VAT, BIN/TIN, and local mobile banking built in from the ground up.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/invoice-generator"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Try the free generator <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Create free account
          </Link>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section
        aria-label="Key statistics"
        className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                  <s.icon size={20} aria-hidden="true" />
                </div>
                <dd className="text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
                <dt className="text-sm text-gray-500 dark:text-gray-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Our story ────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Why we built InvoiceBD
        </h2>
        <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
          <p>
            Most invoicing software is designed for businesses in Europe or North America. That leaves
            freelancers, small shops, and growing companies in Bangladesh wrestling with tools that
            don't understand local VAT rules, don't have a place for a BIN or TIN, and have never
            heard of bKash or Nagad.
          </p>
          <p>
            We built InvoiceBD to fix that. Our goal is simple: let anyone create a clean, accurate,
            VAT-compliant invoice in a couple of minutes, and get paid faster. Whether you're a
            freelance developer, a retail shop owner, or running a growing consultancy, InvoiceBD
            speaks your language.
          </p>
          <p>
            You can manage multiple companies, keep a tidy list of clients, save reusable service
            items, and export every invoice as a polished PDF — all in one place, for free.
          </p>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section
        aria-labelledby="values-heading"
        className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
          <h2 id="values-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-4">
                  <v.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section aria-labelledby="features-heading" className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div>
            <h2 id="features-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything you need to invoice professionally
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              From a single freelancer to a multi-company business, InvoiceBD has the features you need
              to create, send, and track professional invoices — without paying for features you don't use.
            </p>
            <Link
              to="/invoice-generator"
              className="inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm"
            >
              Try it free — no sign-up <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label="Features list">
            {features.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-teal-500" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Trust / EEAT ─────────────────────────────── */}
      <section
        aria-labelledby="trust-heading"
        className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
          <h2 id="trust-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">
            Built with trust
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustPoints.map(t => (
              <div key={t.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-teal-600 dark:text-teal-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <t.icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{t.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad ───────────────────────────────────────── */}
      <AdUnit className="max-w-4xl mx-auto px-4 lg:px-6 my-12" />

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 lg:px-6 pb-20">
        <div className="rounded-2xl bg-teal-600 dark:bg-teal-700 p-10 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Start invoicing today — it's free
          </h2>
          <p className="text-teal-100 max-w-md mx-auto mb-8">
            No credit card. No hidden fees. Just professional invoices, ready in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Create your free account <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/invoice-generator"
              className="inline-flex items-center gap-2 border border-teal-400 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Try without signing up
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
