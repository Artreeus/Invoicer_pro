import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyStore } from '../store/companyStore';
import { useClientStore } from '../store/clientStore';
import { useInvoiceStore } from '../store/invoiceStore';
import { useItemLibraryStore } from '../store/itemLibraryStore';
import type { InvoiceItem, DiscountType, InvoiceStatus } from '../types';
import { VAT_RATES, CURRENCIES, INVOICE_TEMPLATES } from '../types';
import { calculateLineItem, calculateInvoiceTotals, formatCurrency, generateId } from '../lib/utils';

function createEmptyItem(): InvoiceItem {
  return {
    id: generateId(),
    sort_order: 0,
    item_name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    discount_type: 'percentage' as DiscountType,
    discount_value: 0,
    vat_rate: 0,
    vat_amount: 0,
    line_total: 0,
  };
}

export default function InvoiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const activeCompanyId = useCompanyStore(s => s.activeCompanyId);
  const companies = useCompanyStore(s => s.companies);
  const activeCompany = companies.find(c => c.id === activeCompanyId) ?? null;
  const incrementInvoiceNumber = useCompanyStore(s => s.incrementInvoiceNumber);
  const { clients, fetchClients } = useClientStore();
  const { items: libraryItems, fetchItems: fetchLibraryItems } = useItemLibraryStore();
  const { addInvoice, updateInvoice, fetchInvoiceById } = useInvoiceStore();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [templateId, setTemplateId] = useState('corporate');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [thankYouNote, setThankYouNote] = useState('Thank you for your business!');
  const [vatDisclaimer, setVatDisclaimer] = useState('VAT collected as per Bangladesh VAT and Supplementary Duty Act 2012.');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryTitle, setSignatoryTitle] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([createEmptyItem()]);
  const [saving, setSaving] = useState(false);
  const [itemSuggestions, setItemSuggestions] = useState<{ index: number; show: boolean }>({ index: -1, show: false });

  useEffect(() => {
    if (activeCompanyId) {
      fetchClients(activeCompanyId);
      fetchLibraryItems(activeCompanyId);
    }
  }, [activeCompanyId, fetchClients, fetchLibraryItems]);

  useEffect(() => {
    if (activeCompany && !isEditing) {
      setTerms(activeCompany.default_terms || '');
      setPaymentInstructions(activeCompany.default_payment_instructions || '');
      const prefix = activeCompany.invoice_prefix || 'INV';
      const num = activeCompany.next_invoice_number || 1;
      setInvoiceNumber(`${prefix}-${String(num).padStart(4, '0')}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompanyId, isEditing]);

  useEffect(() => {
    if (isEditing && id) {
      fetchInvoiceById(id).then(inv => {
        if (!inv) { toast.error('Invoice not found'); navigate('/invoices'); return; }
        setInvoiceNumber(inv.invoice_number);
        setClientId(inv.client_id || '');
        setIssueDate(inv.issue_date);
        setDueDate(inv.due_date || '');
        setCurrency(inv.currency);
        setTemplateId(inv.template_id);
        setNotes(inv.notes);
        setTerms(inv.terms_and_conditions);
        setPaymentInstructions(inv.payment_instructions);
        setThankYouNote(inv.footer_thank_you_note);
        setVatDisclaimer(inv.vat_disclaimer);
        setSignatoryName(inv.authorized_signatory_name);
        setSignatoryTitle(inv.authorized_signatory_title);
        if (inv.items && inv.items.length > 0) {
          setItems(inv.items);
        }
      });
    }
  }, [isEditing, id, fetchInvoiceById, navigate]);

  const updateItem = useCallback((index: number, field: keyof InvoiceItem, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      const item = updated[index];
      const calc = calculateLineItem(
        item.quantity, item.unit_price, item.discount_type, item.discount_value, item.vat_rate
      );
      updated[index].vat_amount = calc.vatAmount;
      updated[index].line_total = calc.lineTotal;
      return updated;
    });
  }, []);

  const addItem = () => setItems(prev => [...prev, createEmptyItem()]);
  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const selectLibraryItem = (index: number, libItem: typeof libraryItems[0]) => {
    updateItem(index, 'item_name', libItem.name);
    updateItem(index, 'description', libItem.description);
    updateItem(index, 'unit_price', libItem.default_unit_price);
    updateItem(index, 'vat_rate', libItem.default_vat_rate);
    setItemSuggestions({ index: -1, show: false });
    setTimeout(() => {
      setItems(prev => {
        const updated = [...prev];
        const item = updated[index];
        const calc = calculateLineItem(item.quantity, libItem.default_unit_price, item.discount_type, item.discount_value, libItem.default_vat_rate);
        updated[index] = { ...updated[index], unit_price: libItem.default_unit_price, vat_rate: libItem.default_vat_rate, vat_amount: calc.vatAmount, line_total: calc.lineTotal };
        return updated;
      });
    }, 0);
  };

  const totals = calculateInvoiceTotals(items);

  const handleSave = async (status: InvoiceStatus = 'draft') => {
    if (!activeCompanyId) { toast.error('Select a company'); return; }
    if (!invoiceNumber) { toast.error('Invoice number is required'); return; }
    setSaving(true);
    const invoiceData = {
      company_id: activeCompanyId,
      client_id: clientId || null,
      invoice_number: invoiceNumber,
      status,
      issue_date: issueDate,
      due_date: dueDate || null,
      currency,
      subtotal: totals.subtotal,
      total_discount: totals.totalDiscount,
      total_vat: totals.totalVat,
      grand_total: totals.grandTotal,
      template_id: templateId,
      notes,
      terms_and_conditions: terms,
      payment_instructions: paymentInstructions,
      footer_thank_you_note: thankYouNote,
      vat_disclaimer: vatDisclaimer,
      authorized_signatory_name: signatoryName,
      authorized_signatory_title: signatoryTitle,
    };
    const itemsData = items.map((item, i) => ({
      item_name: item.item_name,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_type: item.discount_type,
      discount_value: item.discount_value,
      vat_rate: item.vat_rate,
      vat_amount: item.vat_amount,
      line_total: item.line_total,
      sort_order: i,
    }));
    if (isEditing && id) {
      await updateInvoice(id, invoiceData, itemsData);
      toast.success('Invoice updated');
    } else {
      const result = await addInvoice(invoiceData, itemsData);
      if (result) {
        await incrementInvoiceNumber(activeCompanyId!);
        toast.success('Invoice created');
      }
    }
    setSaving(false);
    navigate('/invoices');
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/invoices')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Invoice' : 'New Invoice'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{invoiceNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && id && (
            <button onClick={() => navigate(`/invoices/${id}/preview`)} className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Eye size={16} /> Preview
            </button>
          )}
          <button onClick={() => handleSave('draft')} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Save size={16} /> Save Draft
          </button>
          <button onClick={() => handleSave('sent')} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
            <Save size={16} /> Save & Send
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Invoice Number</label>
              <input className={inputClass} value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Client</label>
              <select className={inputClass} value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Issue Date</label>
              <input type="date" className={inputClass} value={issueDate} onChange={e => setIssueDate(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" className={inputClass} value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Currency</label>
              <select className={inputClass} value={currency} onChange={e => setCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Template</label>
              <select className={inputClass} value={templateId} onChange={e => setTemplateId(e.target.value)}>
                {INVOICE_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Line Items</h2>
            <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors">
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            <div className="hidden lg:grid grid-cols-12 gap-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="col-span-3">Item</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2">Discount</div>
              <div className="col-span-1">VAT%</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1" />
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="lg:grid lg:grid-cols-12 gap-2 space-y-2 lg:space-y-0 items-start">
                  <div className="col-span-3 relative">
                    <div className="lg:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Item Name</div>
                    <input
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                      value={item.item_name}
                      onChange={e => {
                        updateItem(index, 'item_name', e.target.value);
                        setItemSuggestions({ index, show: e.target.value.length > 0 });
                      }}
                      onFocus={() => setItemSuggestions({ index, show: item.item_name.length > 0 })}
                      onBlur={() => setTimeout(() => setItemSuggestions({ index: -1, show: false }), 200)}
                      placeholder="Item name"
                    />
                    {itemSuggestions.show && itemSuggestions.index === index && libraryItems.filter(li => li.name.toLowerCase().includes(item.item_name.toLowerCase())).length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 py-1 max-h-40 overflow-y-auto">
                        {libraryItems.filter(li => li.name.toLowerCase().includes(item.item_name.toLowerCase())).map(li => (
                          <button key={li.id} onMouseDown={() => selectLibraryItem(index, li)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <div className="font-medium">{li.name}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">৳{li.default_unit_price}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      className="w-full px-2.5 py-1 border-0 text-xs text-gray-400 focus:outline-none mt-1 dark:bg-gray-800 dark:text-gray-500 dark:placeholder-gray-500"
                      value={item.description}
                      onChange={e => updateItem(index, 'description', e.target.value)}
                      placeholder="Description (optional)"
                    />
                  </div>
                  <div className="col-span-1">
                    <div className="lg:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity</div>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="lg:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit Price</div>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                      value={item.unit_price}
                      onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="lg:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Discount</div>
                    <div className="flex gap-1">
                      <select
                        className="w-16 px-1 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                        value={item.discount_type}
                        onChange={e => updateItem(index, 'discount_type', e.target.value)}
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">৳</option>
                      </select>
                      <input
                        type="number"
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                        value={item.discount_value}
                        onChange={e => updateItem(index, 'discount_value', Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="lg:hidden text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">VAT %</div>
                    <select
                      className="w-full px-1 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                      value={item.vat_rate}
                      onChange={e => updateItem(index, 'vat_rate', Number(e.target.value))}
                    >
                      {VAT_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.line_total, currency)}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-gray-500 hover:text-red-500 transition-colors"
                      disabled={items.length <= 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal, currency)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>-{formatCurrency(totals.totalDiscount, currency)}</span>
                </div>
              )}
              {totals.totalVat > 0 && (
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>VAT</span>
                  <span>{formatCurrency(totals.totalVat, currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Grand Total</span>
                <span>{formatCurrency(totals.grandTotal, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Footer & Additional Info</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Notes</label>
              <textarea className={inputClass} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes for the client" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Terms & Conditions</label>
                <textarea className={inputClass} rows={3} value={terms} onChange={e => setTerms(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Payment Instructions</label>
                <textarea className={inputClass} rows={3} value={paymentInstructions} onChange={e => setPaymentInstructions(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>VAT Disclaimer</label>
                <input className={inputClass} value={vatDisclaimer} onChange={e => setVatDisclaimer(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Thank You Note</label>
                <input className={inputClass} value={thankYouNote} onChange={e => setThankYouNote(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Authorized Signatory Name</label>
                <input className={inputClass} value={signatoryName} onChange={e => setSignatoryName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Authorized Signatory Title</label>
                <input className={inputClass} value={signatoryTitle} onChange={e => setSignatoryTitle(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
