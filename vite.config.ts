import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Public, crawlable paths used to build sitemap.xml. Keep article slugs in sync
// with src/content/articles.ts.
const ARTICLE_SLUGS = [
  'vat-compliant-invoice-bangladesh',
  'understanding-bin-tin-vat-registration',
  'get-paid-faster-freelancer-invoicing',
  'mobile-banking-payments-bkash-nagad-rocket',
  'what-to-include-professional-invoice',
  'manage-multiple-companies-clients',
];

const PUBLIC_PATHS = [
  '/',
  '/invoice-generator',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/blog',
  ...ARTICLE_SLUGS.map(s => `/blog/${s}`),
  '/login',
  '/register',
];

// Injects the Google AdSense verification script + meta into <head> (only when a
// publisher id is configured) and emits ads.txt / robots.txt / sitemap.xml.
function seoAndAds(client: string, siteUrl: string): Plugin {
  return {
    name: 'seo-and-ads',
    transformIndexHtml(html) {
      if (!client) return html;
      const tags = [
        `<meta name="google-adsense-account" content="${client}">`,
        `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`,
      ].join('\n    ');
      return html.replace('</head>', `    ${tags}\n  </head>`);
    },
    generateBundle() {
      // ads.txt — declares Google as an authorized seller for this publisher.
      if (client) {
        const pub = client.replace(/^ca-/, '');
        this.emitFile({
          type: 'asset',
          fileName: 'ads.txt',
          source: `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`,
        });
      }

      // robots.txt — allow public pages, keep the authenticated app out of the index.
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: [
          'User-agent: *',
          'Disallow: /dashboard',
          'Disallow: /companies',
          'Disallow: /clients',
          'Disallow: /invoices',
          'Disallow: /item-library',
          'Disallow: /reports',
          'Disallow: /settings',
          '',
          `Sitemap: ${siteUrl}/sitemap.xml`,
          '',
        ].join('\n'),
      });

      // sitemap.xml — with priority and changefreq hints for crawlers
      const priorities: Record<string, string> = {
        '/': '1.0',
        '/invoice-generator': '0.9',
        '/about': '0.7',
        '/contact': '0.6',
        '/blog': '0.8',
        '/privacy': '0.3',
        '/terms': '0.3',
        '/login': '0.4',
        '/register': '0.5',
      };
      const changefreqs: Record<string, string> = {
        '/': 'weekly',
        '/invoice-generator': 'weekly',
        '/about': 'monthly',
        '/contact': 'monthly',
        '/blog': 'weekly',
        '/privacy': 'yearly',
        '/terms': 'yearly',
        '/login': 'monthly',
        '/register': 'monthly',
      };
      const today = new Date().toISOString().split('T')[0];
      const urls = PUBLIC_PATHS.map(p => {
        const loc = `${siteUrl}${p === '/' ? '/' : p}`;
        const prio = priorities[p] ?? '0.6';
        const freq = changefreqs[p] ?? 'monthly';
        return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>`;
      }).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const client = env.VITE_ADSENSE_CLIENT || '';
  const siteUrl = (env.VITE_SITE_URL || 'https://invoicer-pro-ten.vercel.app').replace(/\/+$/, '');

  return {
    plugins: [react(), seoAndAds(client, siteUrl)],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api': 'http://localhost:4000',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['lucide-react', 'sonner', 'zustand'],
          },
        },
      },
    },
  };
});
