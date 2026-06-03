import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { getArticle, articles } from '../../content/articles';
import { formatDate } from '../../lib/utils';
import { useSeo } from '../../lib/useSeo';
import ArticleBody from '../../components/public/ArticleBody';
import AdUnit from '../../components/ads/AdUnit';

export default function BlogArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticle(slug) : undefined;

  useSeo(
    article ? `${article.title} | InvoiceBD` : 'Article not found | InvoiceBD',
    article?.description
  );

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Article not found</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">The article you’re looking for doesn’t exist.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
          <ArrowLeft size={16} /> Back to the blog
        </Link>
      </div>
    );
  }

  const related = articles.filter(a => a.slug !== article.slug).slice(0, 2);

  return (
    <article className="max-w-3xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-8">
        <ArrowLeft size={15} /> All articles
      </Link>

      <span className="text-sm font-medium text-teal-600 dark:text-teal-400">{article.category}</span>
      <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{article.title}</h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
        <span>{formatDate(article.date)}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {article.readMinutes} min read</span>
      </div>

      <div className="mt-8">
        <ArticleBody blocks={article.body} />
      </div>

      <AdUnit className="my-12" />

      <div className="rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 p-6 text-center">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ready to put this into practice?</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Create a professional, VAT-ready invoice with InvoiceBD — free.</p>
        <Link
          to="/register"
          className="mt-4 inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Get started free <ArrowRight size={16} />
        </Link>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Keep reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400">{r.category}</span>
                <p className="mt-1 font-medium text-gray-900 dark:text-gray-100 text-sm">{r.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
