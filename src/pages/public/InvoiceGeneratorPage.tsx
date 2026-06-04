import { useState, useRef, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Trash2, Image as ImageIcon, Printer, FileDown, X,
  Sparkles, ArrowRight, Eye, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Company, Client, Invoice, InvoiceItem } from '../../types';
import { VAT_RATES, CURRENCIES, INVOICE_TEMPLATES } from '../../types';
import {
  calculateLineItem, calculateInvoiceTotals, formatCurrency,
  getCurrencySymbol, generateId,
} from '../../lib/utils';
import { getTemplate } from '../../templates';
import { exportToPDF, exportToImage, printInvoice } from '../../lib/exportUtils';
import { useSeo } from '../../lib/useSeo';
import AdUnit from '../../components/ads/AdUnit';
import LocalImageUpload from '../../components/ui/LocalImageUpload';

const inputClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1';

function emptyItem(): InvoiceItem {
  return {
    id: generateId(), sort_order: 0, item_name: '', description: '', quantity: 1,
    unit_price: 0, discount_type: 'percentage', discount_value: 0, vat_rate: 0,
    vat_amount: 0, line_total: 0,
  };
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

const FAQ_ITEMS = [
  {
    q: 'How do I create a free invoice online?',
    a: 'Fill in your business details, client information, and line items in the form above. Pick a template, then click "Preview & Download" to export a professional PDF — no account needed.',
  },
  {
    q: 'Can I add VAT to my invoice?',
    a: 'Yes. Each line item has a VAT rate selector (0 %, 5 %, 7.5 %, 10 %, 15 %). The totals section automatically calculates VAT and shows a grand total.',
  },
  {
    q: 'What currencies does the invoice generator support?',
    a: 'The generator supports BDT (Bangladeshi Taka), USD, EUR, and GBP. Select your preferred currency from the Invoice details section.',
  },
  {
    q: 'Can I download my invoice as a PDF?',
    a: 'Yes. Click "Preview & Download", then click the PDF button in the preview toolbar. You can also download as a PNG image or print directly.',
  },
  {
    q: 'Do I need to sign up to use the invoice generator?',
    a: 'No sign-up is required for the free generator. To save invoices, manage clients, and track payments, you can create a free InvoiceBD account.',
  },
  {
    q: 'Can I include my BIN and TIN on the invoice?',
    a: 'Yes. The "Your details" section has dedicated fields for BIN (Business Identification Number) and TIN (Taxpayer Identification Number), which appear on the generated invoice.',
  },
];

const PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function InvoiceGeneratorPage() {
  useSeo(
    'Free Invoice Generator Online | Create Professional PDF Invoices',
    'Create professional invoices online for free. Generate PDF invoices instantly with tax calculations, multiple currencies, and professional templates. No sign-up required.',
    {
      canonical: 'https://invoicer-pro-ten.vercel.app/invoice-generator',
      schema: PAGE_SCHEMA,
    }
  );

  // Business
  const [bizName, setBizName] = useState('');
  const [bizAddress, setBizAddress] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizLogo, setBizLogo] = useState('');
  const [bizBin, setBizBin] = useState('');
  const [bizTin, setBizTin] = useState('');
  // Client
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  // Invoice meta
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [issueDate, setIssueDate] = useState(todayStr());
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [templateId, setTemplateId] = useState('corporate');
  const [brandColor, setBrandColor] = useState('#0d9488');
  // Items + footer
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');

  const [exporting, setExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Right-column live preview
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const update = () => setPreviewScale(Math.min(1, el.clientWidth / 794));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Modal export ref
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = previewOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [previewOpen]);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const it = updated[index];
      const calc = calculateLineItem(
        it.quantity, it.unit_price, it.discount_type, it.discount_value, it.vat_rate,
      );
      updated[index].vat_amount = calc.vatAmount;
      updated[index].line_total = calc.lineTotal;
      return updated;
    });
  };

  const totals = calculateInvoiceTotals(items);

  const company: Company = {
    id: 'preview', name: bizName || 'Your Business Name', logo_url: bizLogo,
    address: bizAddress, phone: bizPhone, email: bizEmail, website: '',
    bin: bizBin, tin: bizTin, vat_registration_number: '', trade_license_number: '',
    bank_details: {}, mobile_banking: {}, brand_color: brandColor,
    invoice_prefix: 'INV', next_invoice_number: 1, default_vat_rate: 0,
    default_terms: '', default_payment_instructions: '', created_at: '', updated_at: '',
  };
  const client: Client = {
    id: 'preview', company_id: 'preview', name: clientName || 'Client Name',
    address: clientAddress, phone: '', email: clientEmail, contact_person: '',
    bin: '', tin: '', notes: '', created_at: '', updated_at: '',
  };
  const invoice: Invoice = {
    id: 'preview', company_id: 'preview', client_id: 'preview',
    invoice_number: invoiceNumber || 'INV-001', status: 'sent',
    issue_date: issueDate, due_date: dueDate || null, currency,
    subtotal: totals.subtotal, total_discount: totals.totalDiscount,
    total_vat: totals.totalVat, grand_total: totals.grandTotal,
    template_id: templateId, notes, terms_and_conditions: terms,
    payment_instructions: paymentInstructions,
    footer_thank_you_note: 'Thank you for your business!',
    vat_disclaimer: '', authorized_signatory_name: '', authorized_signatory_title: '',
    created_at: '', updated_at: '', items,
  };

  const TemplateComponent = getTemplate(templateId);
  const filename = invoiceNumber || 'invoice';
  const sym = getCurrencySymbol(currency);

  const runExport = async (fn: () => Promise<void>) => {
    if (!previewRef.current) return;
    setExporting(true);
    try { await fn(); }
    catch { toast.error('Export failed, please try again'); }
    finally { setExporting(false); }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-10 lg:py-14">
      {/* Page header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-500/20 px-3 py-1 rounded-full">
          <Sparkles size={13} aria-hidden="true" /> No sign-up required
        </span>
        <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Free Invoice Generator
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Fill in the details, pick a template, then preview and download a professional PDF — no account needed.
        </p>
      </div>

      {/* Sticky action bar — mobile only */}
      <div className="sticky top-16 z-30 lg:hidden -mx-4 px-4 py-3 mb-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-y border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totals.grandTotal, currency)}</span>
        </div>
        <button
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Eye size={16} aria-hidden="true" /> Preview &amp; Download
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left: Form ─────────────────────────────── */}
        <div className="w-full lg:w-[480px] flex-none space-y-4">

          <Card title="Your details">
            <Field label="Logo" id="field-logo">
              <LocalImageUpload value={bizLogo} onChange={setBizLogo} />
            </Field>
            <Field label="Business name" id="biz-name">
              <input id="biz-name" className={inputClass} value={bizName}
                onChange={e => setBizName(e.target.value)} placeholder="Acme Corporation Ltd." />
            </Field>
            <Field label="Address" id="biz-address">
              <textarea id="biz-address" className={inputClass} rows={2} value={bizAddress}
                onChange={e => setBizAddress(e.target.value)} placeholder="Street, city, country" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" id="biz-phone">
                <input id="biz-phone" className={inputClass} value={bizPhone}
                  onChange={e => setBizPhone(e.target.value)} />
              </Field>
              <Field label="Email" id="biz-email">
                <input id="biz-email" className={inputClass} type="email" value={bizEmail}
                  onChange={e => setBizEmail(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="BIN" id="biz-bin">
                <input id="biz-bin" className={inputClass} value={bizBin}
                  onChange={e => setBizBin(e.target.value)} />
              </Field>
              <Field label="TIN" id="biz-tin">
                <input id="biz-tin" className={inputClass} value={bizTin}
                  onChange={e => setBizTin(e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Bill to">
            <Field label="Client name" id="client-name">
              <input id="client-name" className={inputClass} value={clientName}
                onChange={e => setClientName(e.target.value)} placeholder="Client or company name" />
            </Field>
            <Field label="Client address" id="client-address">
              <textarea id="client-address" className={inputClass} rows={2} value={clientAddress}
                onChange={e => setClientAddress(e.target.value)} />
            </Field>
            <Field label="Client email" id="client-email">
              <input id="client-email" className={inputClass} type="email" value={clientEmail}
                onChange={e => setClientEmail(e.target.value)} />
            </Field>
          </Card>

          <Card title="Invoice details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Invoice number" id="inv-number">
                <input id="inv-number" className={inputClass} value={invoiceNumber}
                  onChange={e => setInvoiceNumber(e.target.value)} />
              </Field>
              <Field label="Currency" id="inv-currency">
                <select id="inv-currency" className={inputClass} value={currency}
                  onChange={e => setCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                </select>
              </Field>
              <Field label="Issue date" id="inv-issue">
                <input id="inv-issue" type="date" className={inputClass} value={issueDate}
                  onChange={e => setIssueDate(e.target.value)} />
              </Field>
              <Field label="Due date" id="inv-due">
                <input id="inv-due" type="date" className={inputClass} value={dueDate}
                  onChange={e => setDueDate(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Template" id="inv-template">
                <select id="inv-template" className={inputClass} value={templateId}
                  onChange={e => setTemplateId(e.target.value)}>
                  {INVOICE_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Brand colour" id="inv-color">
                <input id="inv-color" type="color" value={brandColor}
                  onChange={e => setBrandColor(e.target.value)}
                  aria-label="Brand colour picker"
                  className="w-full h-[38px] px-1 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer" />
              </Field>
            </div>
          </Card>

          <Card title="Items">
            <div className="space-y-3" role="list" aria-label="Invoice items">
              {items.map((item, i) => (
                <div key={item.id} role="listitem"
                  className="rounded-lg border border-gray-100 dark:border-gray-800 p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      className={`${inputClass} flex-1`}
                      value={item.item_name}
                      onChange={e => updateItem(i, 'item_name', e.target.value)}
                      placeholder="Item or service"
                      aria-label={`Item ${i + 1} name`}
                    />
                    <button
                      onClick={() => setItems(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev)}
                      aria-label={`Remove item ${i + 1}`}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <input className={inputClass} value={item.description}
                    onChange={e => updateItem(i, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    aria-label={`Item ${i + 1} description`}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Qty" id={`item-qty-${i}`}>
                      <input id={`item-qty-${i}`} type="number" min={0} className={inputClass}
                        value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} />
                    </Field>
                    <Field label={`Price (${sym})`} id={`item-price-${i}`}>
                      <input id={`item-price-${i}`} type="number" min={0} className={inputClass}
                        value={item.unit_price} onChange={e => updateItem(i, 'unit_price', Number(e.target.value))} />
                    </Field>
                    <Field label="VAT %" id={`item-vat-${i}`}>
                      <select id={`item-vat-${i}`} className={inputClass}
                        value={item.vat_rate} onChange={e => updateItem(i, 'vat_rate', Number(e.target.value))}>
                        {VAT_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatCurrency(item.line_total, currency)}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setItems(prev => [...prev, emptyItem()])}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors"
            >
              <Plus size={14} aria-hidden="true" /> Add item
            </button>
          </Card>

          <Card title="Notes & terms">
            <Field label="Notes" id="inv-notes">
              <textarea id="inv-notes" className={inputClass} rows={2} value={notes}
                onChange={e => setNotes(e.target.value)} placeholder="Notes for the client" />
            </Field>
            <Field label="Payment instructions" id="inv-payment">
              <textarea id="inv-payment" className={inputClass} rows={2} value={paymentInstructions}
                onChange={e => setPaymentInstructions(e.target.value)}
                placeholder="Bank account, bKash/Nagad/Rocket numbers…" />
            </Field>
            <Field label="Terms & conditions" id="inv-terms">
              <textarea id="inv-terms" className={inputClass} rows={2} value={terms}
                onChange={e => setTerms(e.target.value)} />
            </Field>
          </Card>

          {/* Mobile-only primary CTA */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Eye size={18} aria-hidden="true" /> Preview &amp; Download invoice
          </button>

          {/* Sign-up CTA */}
          <div className="rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Want to save and manage your invoices?
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              Create a free account to store clients, reuse items, track payments and manage multiple companies.
            </p>
            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Create a free account <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <AdUnit className="max-w-full" />

          {/* FAQ */}
          <section aria-labelledby="faq-heading" className="pt-4">
            <h2 id="faq-heading" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
            </div>
          </section>
        </div>

        {/* ── Right: Live preview (desktop) ──────────── */}
        <div className="hidden lg:flex flex-col flex-1 sticky top-20 self-start gap-3 min-w-0">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Live preview</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Total: <span className="font-bold text-gray-700 dark:text-gray-200">{formatCurrency(totals.grandTotal, currency)}</span>
              </span>
            </div>
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Eye size={16} aria-hidden="true" /> Preview &amp; Download
            </button>
          </div>

          {/* Scaled template */}
          <div
            ref={previewContainerRef}
            className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg bg-white"
            style={{ height: previewScale > 0 ? `${Math.ceil(1123 * previewScale)}px` : '500px' }}
            aria-label="Invoice live preview"
            aria-hidden="true"
          >
            {previewScale > 0 && (
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  width: '794px',
                  minHeight: '1123px',
                }}
              >
                <TemplateComponent invoice={invoice} company={company} client={client} items={items} />
              </div>
            )}
          </div>

          {/* Template switcher under preview */}
          <div className="flex flex-wrap gap-1.5">
            {INVOICE_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  templateId === t.id
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export modal (full-size A4) */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Invoice preview"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">Invoice preview</h2>
            <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
              <ExportButton
                onClick={() => runExport(() => exportToPDF(previewRef.current!, filename))}
                disabled={exporting} icon={<FileDown size={15} className="text-red-500" aria-hidden="true" />}
                label="PDF" busy={exporting}
              />
              <ExportButton
                onClick={() => runExport(() => exportToImage(previewRef.current!, filename, 'png'))}
                disabled={exporting} icon={<ImageIcon size={15} className="text-blue-500" aria-hidden="true" />}
                label="PNG"
              />
              <ExportButton
                onClick={() => printInvoice(previewRef.current!)}
                disabled={exporting} icon={<Printer size={15} className="text-gray-500" aria-hidden="true" />}
                label="Print"
              />
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-950 p-4 sm:p-8">
            <div className="mx-auto bg-white shadow-xl" style={{ width: '794px' }}>
              <div ref={previewRef}>
                <TemplateComponent invoice={invoice} company={company} client={client} items={items} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={`faq-${id}`}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
      >
        <span>{q}</span>
        {open
          ? <ChevronUp size={16} className="flex-shrink-0 text-gray-400" aria-hidden="true" />
          : <ChevronDown size={16} className="flex-shrink-0 text-gray-400" aria-hidden="true" />}
      </button>
      {open && (
        <div id={`faq-${id}`} className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

function ExportButton({
  onClick, disabled, icon, label, busy,
}: {
  onClick: () => void; disabled?: boolean; icon: React.ReactNode; label: string; busy?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Download as ${label}`}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
    >
      {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label, id, children,
}: {
  label: string; id?: string; children: React.ReactNode;
}) {
  return (
    <div>
      {id
        ? <label htmlFor={id} className={labelClass}>{label}</label>
        : <span className={labelClass}>{label}</span>}
      {children}
    </div>
  );
}
