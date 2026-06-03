import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { articles } from '../../content/articles';
import { formatDate } from '../../lib/utils';
import { useSeo } from '../../lib/useSeo';
import AdUnit from '../../components/ads/AdUnit';

export default function BlogIndexPage() {
  useSeo(
    'Blog — Invoicing, VAT & Business Guides | InvoiceBD',
    'Practical guides on invoicing, VAT compliance, freelancing and getting paid for businesses in Bangladesh.'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">The InvoiceBD Blog</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Practical, no-nonsense guides on invoicing, VAT, payments and running a business in Bangladesh.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map(article => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="group rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all flex flex-col"
          >
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400">{article.category}</span>
            <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{article.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{formatDate(article.date)}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {article.readMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>

      <AdUnit className="my-12 max-w-3xl mx-auto" />

      <div className="text-center">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Create your free account <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
