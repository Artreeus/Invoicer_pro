import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, FileDown, Image as ImageIcon, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { INVOICE_TEMPLATES } from '../../types';
import type { Company, Client, Invoice, InvoiceItem } from '../../types';
import { getTemplate } from '../../templates';
import { exportToPDF, exportToImage, printInvoice } from '../../lib/exportUtils';
import { useSeo } from '../../lib/useSeo';
import AdUnit from '../../components/ads/AdUnit';

/* ─── Demo data rendered inside every template thumbnail ─────────────────── */
const DEMO_ITEMS: InvoiceItem[] = [
  { id: '1', sort_order: 0, item_name: 'Web Design', description: 'Homepage & landing page', quantity: 1, unit_price: 45000, discount_type: 'percentage', discount_value: 0, vat_rate: 15, vat_amount: 6750, line_total: 51750 },
  { id: '2', sort_order: 1, item_name: 'SEO Setup', description: 'On-page optimisation', quantity: 1, unit_price: 15000, discount_type: 'percentage', discount_value: 0, vat_rate: 15, vat_amount: 2250, line_total: 17250 },
  { id: '3', sort_order: 2, item_name: 'Monthly Retainer', description: 'Support & updates', quantity: 3, unit_price: 8000, discount_type: 'percentage', discount_value: 0, vat_rate: 0, vat_amount: 0, line_total: 24000 },
];

const DEMO_COMPANY: Company = {
  id: 'demo', name: 'Acme Corporation', logo_url: '',
  address: '42 Gulshan Avenue, Dhaka 1212, Bangladesh',
  phone: '+880 1711-000000', email: 'hello@acme.com', website: 'acme.com',
  bin: '004567890-0101', tin: '123456789',
  vat_registration_number: '', trade_license_number: '',
  bank_details: { bank_name: 'Dutch-Bangla Bank', account_number: '1234567890', account_name: 'Acme Corporation' },
  mobile_banking: { bkash: '01711-000000' },
  brand_color: '#0d9488',
  invoice_prefix: 'INV', next_invoice_number: 42, default_vat_rate: 15,
  default_terms: 'Payment due within 30 days.', default_payment_instructions: 'bKash: 01711-000000',
  created_at: '', updated_at: '',
};

const DEMO_CLIENT: Client = {
  id: 'demo', company_id: 'demo', name: 'TechStart Limited',
  address: '18 Banani Road, Dhaka 1213', phone: '+880 1800-000000',
  email: 'accounts@techstart.com', contact_person: 'Karim Rahman',
  bin: '', tin: '', notes: '', created_at: '', updated_at: '',
};

const DEMO_INVOICE: Invoice = {
  id: 'demo', company_id: 'demo', client_id: 'demo',
  invoice_number: 'INV-042', status: 'sent',
  issue_date: '2026-06-01', due_date: '2026-06-30', currency: 'BDT',
  subtotal: 93000, total_discount: 0, total_vat: 9000, grand_total: 93000,
  template_id: 'corporate',
  notes: 'Thank you for choosing Acme Corporation.',
  terms_and_conditions: 'Payment due within 30 days. Late payments subject to 2% monthly interest.',
  payment_instructions: 'bKash: 01711-000000 | DBBL: 1234567890',
  footer_thank_you_note: 'Thank you for your business!',
  vat_disclaimer: '', authorized_signatory_name: 'Latifur Rahman', authorized_signatory_title: 'CEO',
  created_at: '', updated_at: '',
  items: DEMO_ITEMS,
};

const PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Invoice Templates — InvoiceBD',
  description: '13 professional invoice templates for businesses and freelancers in Bangladesh.',
  numberOfItems: INVOICE_TEMPLATES.length,
  itemListElement: INVOICE_TEMPLATES.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    description: t.description,
    url: `https://invoicer-pro-ten.vercel.app/invoice-generator?template=${t.id}`,
  })),
};

export default function TemplatesPage() {
  useSeo(
    'Invoice Templates | 13 Free Professional Designs — InvoiceBD',
    'Browse 13 free professional invoice templates. Choose from Corporate, Modern, Minimal, Creative, Freelancer and more — all fully customisable and exportable as PDF.',
    {
      canonical: 'https://invoicer-pro-ten.vercel.app/templates',
      schema: PAGE_SCHEMA,
    }
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(320);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const update = () => {
      const card = el.querySelector('[data-template-card]') as HTMLElement | null;
      if (card) setCardWidth(card.clientWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = previewTemplate ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [previewTemplate]);

  const scale = Math.min(1, cardWidth / 794);
  const thumbHeight = Math.ceil(1123 * scale);

  const runExport = async (fn: () => Promise<void>) => {
    if (!modalRef.current) return;
    setExporting(true);
    try { await fn(); }
    catch { toast.error('Export failed'); }
    finally { setExporting(false); }
  };

  const ActiveTemplate = previewTemplate ? getTemplate(previewTemplate) : null;
  const previewInfo = INVOICE_TEMPLATES.find(t => t.id === previewTemplate);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-14">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Invoice Templates
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {INVOICE_TEMPLATES.length} professionally designed templates — pick one, customise the colours, and download your invoice as a PDF. All free, no account needed.
        </p>
        <Link
          to="/invoice-generator"
          className="mt-5 inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm"
        >
          Open invoice generator <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {/* Template grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {INVOICE_TEMPLATES.map(t => {
          const Tpl = getTemplate(t.id);
          return (
            <article
              key={t.id}
              data-template-card
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <button
                onClick={() => setPreviewTemplate(t.id)}
                aria-label={`Preview ${t.name} template`}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <div
                  className="overflow-hidden bg-gray-50 relative"
                  style={{ height: `${thumbHeight}px` }}
                >
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      width: '794px',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    <Tpl
                      invoice={DEMO_INVOICE}
                      company={DEMO_COMPANY}
                      client={DEMO_CLIENT}
                      items={DEMO_ITEMS}
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      Click to preview
                    </span>
                  </div>
                </div>
              </button>

              {/* Card footer */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{t.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{t.description}</p>
                </div>
                <Link
                  to={`/invoice-generator?template=${t.id}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  aria-label={`Use ${t.name} template`}
                >
                  Use <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <AdUnit className="mt-12" />

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          All templates, zero cost
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Sign up free to save your invoices, manage clients, and reuse items across all templates.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Create free account <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/invoice-generator"
            className="inline-flex items-center gap-2 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-medium px-6 py-3 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/10 transition-colors"
          >
            Try without signing up
          </Link>
        </div>
      </div>

      {/* Full-size preview modal */}
      {previewTemplate && ActiveTemplate && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewInfo?.name} template preview`}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{previewInfo?.name}</span>
              <span className="ml-2 text-sm text-gray-400 hidden sm:inline">{previewInfo?.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => runExport(() => exportToPDF(modalRef.current!, `invoice-${previewTemplate}`))}
                disabled={exporting}
                aria-label="Download as PDF"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {exporting ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} className="text-red-500" />}
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={() => runExport(() => exportToImage(modalRef.current!, `invoice-${previewTemplate}`, 'png'))}
                disabled={exporting}
                aria-label="Download as PNG"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <ImageIcon size={15} className="text-blue-500" />
                <span className="hidden sm:inline">PNG</span>
              </button>
              <button
                onClick={() => printInvoice(modalRef.current!)}
                disabled={exporting}
                aria-label="Print"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Printer size={15} className="text-gray-500" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <Link
                to={`/invoice-generator?template=${previewTemplate}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Use this <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setPreviewTemplate(null)}
                aria-label="Close preview"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-950 p-4 sm:p-8">
            <div className="mx-auto bg-white shadow-xl" style={{ width: '794px' }}>
              <div ref={modalRef}>
                <ActiveTemplate
                  invoice={DEMO_INVOICE}
                  company={DEMO_COMPANY}
                  client={DEMO_CLIENT}
                  items={DEMO_ITEMS}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
