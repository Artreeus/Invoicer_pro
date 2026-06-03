import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Download, Image as ImageIcon, Printer, FileDown, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Company, Client, Invoice, InvoiceItem } from '../../types';
import { VAT_RATES, CURRENCIES, INVOICE_TEMPLATES } from '../../types';
import { calculateLineItem, calculateInvoiceTotals, formatCurrency, getCurrencySymbol, generateId } from '../../lib/utils';
import { getTemplate } from '../../templates';
import { exportToPDF, exportToImage, printInvoice } from '../../lib/exportUtils';
import { useSeo } from '../../lib/useSeo';
import AdUnit from '../../components/ads/AdUnit';

const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
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

export default function InvoiceGeneratorPage() {
  useSeo(
    'Free Invoice Generator — No Sign-up | InvoiceBD',
    'Create and download a professional, VAT-ready invoice instantly. No account, no setup — just fill in the details and export a PDF for free.'
  );

  // Your business
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
  const [menuOpen, setMenuOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const it = updated[index];
      const calc = calculateLineItem(it.quantity, it.unit_price, it.discount_type, it.discount_value, it.vat_rate);
      updated[index].vat_amount = calc.vatAmount;
      updated[index].line_total = calc.lineTotal;
      return updated;
    });
  };

  const totals = calculateInvoiceTotals(items);

  const company: Company = {
    id: 'preview', name: bizName || 'Your Business Name', logo_url: bizLogo, address: bizAddress,
    phone: bizPhone, email: bizEmail, website: '', bin: bizBin, tin: bizTin,
    vat_registration_number: '', trade_license_number: '', bank_details: {}, mobile_banking: {},
    brand_color: brandColor, invoice_prefix: 'INV', next_invoice_number: 1, default_vat_rate: 0,
    default_terms: '', default_payment_instructions: '', created_at: '', updated_at: '',
  };
  const client: Client = {
    id: 'preview', company_id: 'preview', name: clientName || 'Client Name', address: clientAddress,
    phone: '', email: clientEmail, contact_person: '', bin: '', tin: '', notes: '', created_at: '', updated_at: '',
  };
  const invoice: Invoice = {
    id: 'preview', company_id: 'preview', client_id: 'preview', invoice_number: invoiceNumber || 'INV-001',
    status: 'sent', issue_date: issueDate, due_date: dueDate || null, currency,
    subtotal: totals.subtotal, total_discount: totals.totalDiscount, total_vat: totals.totalVat,
    grand_total: totals.grandTotal, template_id: templateId, notes, terms_and_conditions: terms,
    payment_instructions: paymentInstructions, footer_thank_you_note: 'Thank you for your business!',
    vat_disclaimer: '', authorized_signatory_name: '', authorized_signatory_title: '',
    created_at: '', updated_at: '', items,
  };

  const TemplateComponent = getTemplate(templateId);
  const filename = invoiceNumber || 'invoice';

  const runExport = async (fn: () => Promise<void>) => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await fn();
    } catch {
      toast.error('Export failed, please try again');
    } finally {
      setExporting(false);
      setMenuOpen(false);
    }
  };

  const sym = getCurrencySymbol(currency);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-500/20 px-3 py-1 rounded-full">
          <Sparkles size={13} /> No sign-up required
        </span>
        <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Free Invoice Generator</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Fill in the details, pick a template, and download a professional PDF invoice in seconds — no account needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 space-y-5">
          <Card title="Your details">
            <Field label="Business name"><input className={inputClass} value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Acme Corporation Ltd." /></Field>
            <Field label="Logo URL (optional)"><input className={inputClass} value={bizLogo} onChange={e => setBizLogo(e.target.value)} placeholder="https://…/logo.png" /></Field>
            <Field label="Address"><textarea className={inputClass} rows={2} value={bizAddress} onChange={e => setBizAddress(e.target.value)} placeholder="Street, city, country" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone"><input className={inputClass} value={bizPhone} onChange={e => setBizPhone(e.target.value)} /></Field>
              <Field label="Email"><input className={inputClass} type="email" value={bizEmail} onChange={e => setBizEmail(e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="BIN"><input className={inputClass} value={bizBin} onChange={e => setBizBin(e.target.value)} /></Field>
              <Field label="TIN"><input className={inputClass} value={bizTin} onChange={e => setBizTin(e.target.value)} /></Field>
            </div>
          </Card>

          <Card title="Bill to">
            <Field label="Client name"><input className={inputClass} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client or company name" /></Field>
            <Field label="Client address"><textarea className={inputClass} rows={2} value={clientAddress} onChange={e => setClientAddress(e.target.value)} /></Field>
            <Field label="Client email"><input className={inputClass} type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} /></Field>
          </Card>

          <Card title="Invoice details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Invoice number"><input className={inputClass} value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} /></Field>
              <Field label="Currency">
                <select className={inputClass} value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                </select>
              </Field>
              <Field label="Issue date"><input type="date" className={inputClass} value={issueDate} onChange={e => setIssueDate(e.target.value)} /></Field>
              <Field label="Due date"><input type="date" className={inputClass} value={dueDate} onChange={e => setDueDate(e.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Template">
                <select className={inputClass} value={templateId} onChange={e => setTemplateId(e.target.value)}>
                  {INVOICE_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Brand colour">
                <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="w-full h-[38px] px-1 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer" />
              </Field>
            </div>
          </Card>

          <Card title="Items">
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={item.id} className="rounded-lg border border-gray-100 dark:border-gray-800 p-3 space-y-2">
                  <div className="flex gap-2">
                    <input className={`${inputClass} flex-1`} value={item.item_name} onChange={e => updateItem(i, 'item_name', e.target.value)} placeholder="Item or service" />
                    <button
                      onClick={() => setItems(prev => prev.length > 1 ? prev.filter((_, j) => j !== i) : prev)}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input className={inputClass} value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description (optional)" />
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Qty"><input type="number" min={0} className={inputClass} value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} /></Field>
                    <Field label={`Price (${sym})`}><input type="number" min={0} className={inputClass} value={item.unit_price} onChange={e => updateItem(i, 'unit_price', Number(e.target.value))} /></Field>
                    <Field label="VAT %">
                      <select className={inputClass} value={item.vat_rate} onChange={e => updateItem(i, 'vat_rate', Number(e.target.value))}>
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
              <Plus size={14} /> Add item
            </button>
          </Card>

          <Card title="Notes & terms">
            <Field label="Notes"><textarea className={inputClass} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes for the client" /></Field>
            <Field label="Payment instructions"><textarea className={inputClass} rows={2} value={paymentInstructions} onChange={e => setPaymentInstructions(e.target.value)} placeholder="Bank account, bKash/Nagad/Rocket numbers…" /></Field>
            <Field label="Terms & conditions"><textarea className={inputClass} rows={2} value={terms} onChange={e => setTerms(e.target.value)} /></Field>
          </Card>
        </div>

        {/* Preview + export */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total: <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totals.grandTotal, currency)}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  <Download size={16} /> {exporting ? 'Exporting…' : 'Download'} <ChevronDown size={14} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-30">
                    <button onClick={() => runExport(() => exportToPDF(previewRef.current!, filename))} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><FileDown size={16} className="text-red-500" /> Download PDF</button>
                    <button onClick={() => runExport(() => exportToImage(previewRef.current!, filename, 'png'))} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><ImageIcon size={16} className="text-blue-500" /> Download PNG</button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    <button onClick={() => { printInvoice(previewRef.current!); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Printer size={16} className="text-gray-500" /> Print</button>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-3 sm:p-5">
              <div className="mx-auto bg-white shadow-lg" style={{ width: '794px' }}>
                <div ref={previewRef}>
                  <TemplateComponent invoice={invoice} company={company} client={client} items={items} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA + ad */}
      <div className="mt-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Want to save and manage your invoices?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Create a free account to store clients, reuse items, track payments and manage multiple companies.
        </p>
        <Link to="/register" className="mt-5 inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
          Create a free account <ArrowRight size={18} />
        </Link>
      </div>

      <AdUnit className="mt-12 max-w-3xl mx-auto" />
    </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}
