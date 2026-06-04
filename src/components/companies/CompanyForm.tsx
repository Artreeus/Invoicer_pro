import { useState, useEffect } from 'react';
import type { Company, BankDetails, MobileBanking } from '../../types';
import { Building2, CreditCard, Smartphone, Palette } from 'lucide-react';
import ImageUpload from '../ui/ImageUpload';

interface CompanyFormProps {
  company?: Company | null;
  onSubmit: (data: Partial<Company>) => void;
  onCancel: () => void;
}

type Tab = 'basic' | 'tax' | 'banking' | 'branding';

export default function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
  const [tab, setTab] = useState<Tab>('basic');
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [bin, setBin] = useState('');
  const [tin, setTin] = useState('');
  const [vatReg, setVatReg] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [bankDetails, setBankDetails] = useState<BankDetails>({});
  const [mobileBanking, setMobileBanking] = useState<MobileBanking>({});
  const [brandColor, setBrandColor] = useState('#0d9488');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [defaultVatRate, setDefaultVatRate] = useState(15);
  const [defaultTerms, setDefaultTerms] = useState('');
  const [defaultPaymentInstructions, setDefaultPaymentInstructions] = useState('');

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setLogoUrl(company.logo_url || '');
      setAddress(company.address || '');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setWebsite(company.website || '');
      setBin(company.bin || '');
      setTin(company.tin || '');
      setVatReg(company.vat_registration_number || '');
      setTradeLicense(company.trade_license_number || '');
      setBankDetails(company.bank_details || {});
      setMobileBanking(company.mobile_banking || {});
      setBrandColor(company.brand_color || '#0d9488');
      setInvoicePrefix(company.invoice_prefix || 'INV');
      setDefaultVatRate(company.default_vat_rate ?? 15);
      setDefaultTerms(company.default_terms || '');
      setDefaultPaymentInstructions(company.default_payment_instructions || '');
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name, logo_url: logoUrl, address, phone, email, website,
      bin, tin, vat_registration_number: vatReg, trade_license_number: tradeLicense,
      bank_details: bankDetails, mobile_banking: mobileBanking,
      brand_color: brandColor, invoice_prefix: invoicePrefix,
      default_vat_rate: defaultVatRate, default_terms: defaultTerms,
      default_payment_instructions: defaultPaymentInstructions,
    });
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'basic', label: 'Basic Info', icon: <Building2 size={16} /> },
    { key: 'tax', label: 'Tax & Registration', icon: <CreditCard size={16} /> },
    { key: 'banking', label: 'Banking', icon: <Smartphone size={16} /> },
    { key: 'branding', label: 'Branding', icon: <Palette size={16} /> },
  ];

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all flex-1 justify-center ${
              tab === t.key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Company Name *</label>
            <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Acme Corporation Ltd." />
          </div>
          <div>
            <label className={labelClass}>Logo</label>
            <ImageUpload value={logoUrl} onChange={setLogoUrl} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea className={inputClass} rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Full company address" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880-XXXX-XXXXXX" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@company.com" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input className={inputClass} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://company.com" />
          </div>
        </div>
      )}

      {tab === 'tax' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>BIN (Business Identification Number)</label>
              <input className={inputClass} value={bin} onChange={e => setBin(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>TIN (Tax Identification Number)</label>
              <input className={inputClass} value={tin} onChange={e => setTin(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>VAT Registration Number</label>
              <input className={inputClass} value={vatReg} onChange={e => setVatReg(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Trade License Number</label>
              <input className={inputClass} value={tradeLicense} onChange={e => setTradeLicense(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {tab === 'banking' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Bank Account</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input className={inputClass} value={bankDetails.bank_name || ''} onChange={e => setBankDetails(p => ({ ...p, bank_name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Account Name</label>
                  <input className={inputClass} value={bankDetails.account_name || ''} onChange={e => setBankDetails(p => ({ ...p, account_name: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Account Number</label>
                  <input className={inputClass} value={bankDetails.account_number || ''} onChange={e => setBankDetails(p => ({ ...p, account_number: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Branch</label>
                  <input className={inputClass} value={bankDetails.branch || ''} onChange={e => setBankDetails(p => ({ ...p, branch: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Routing Number</label>
                  <input className={inputClass} value={bankDetails.routing_number || ''} onChange={e => setBankDetails(p => ({ ...p, routing_number: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>SWIFT Code</label>
                  <input className={inputClass} value={bankDetails.swift_code || ''} onChange={e => setBankDetails(p => ({ ...p, swift_code: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Mobile Banking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>bKash</label>
                <input className={inputClass} value={mobileBanking.bkash || ''} onChange={e => setMobileBanking(p => ({ ...p, bkash: e.target.value }))} placeholder="01XXXXXXXXX" />
              </div>
              <div>
                <label className={labelClass}>Nagad</label>
                <input className={inputClass} value={mobileBanking.nagad || ''} onChange={e => setMobileBanking(p => ({ ...p, nagad: e.target.value }))} placeholder="01XXXXXXXXX" />
              </div>
              <div>
                <label className={labelClass}>Rocket</label>
                <input className={inputClass} value={mobileBanking.rocket || ''} onChange={e => setMobileBanking(p => ({ ...p, rocket: e.target.value }))} placeholder="01XXXXXXXXX" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'branding' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Brand Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
                <input className={inputClass} value={brandColor} onChange={e => setBrandColor(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Invoice Prefix</label>
              <input className={inputClass} value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} placeholder="INV" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Default VAT Rate (%)</label>
            <select className={inputClass} value={defaultVatRate} onChange={e => setDefaultVatRate(Number(e.target.value))}>
              <option value={0}>0%</option>
              <option value={5}>5%</option>
              <option value={7.5}>7.5%</option>
              <option value={10}>10%</option>
              <option value={15}>15%</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Default Terms & Conditions</label>
            <textarea className={inputClass} rows={3} value={defaultTerms} onChange={e => setDefaultTerms(e.target.value)} placeholder="Payment terms, return policy, etc." />
          </div>
          <div>
            <label className={labelClass}>Default Payment Instructions</label>
            <textarea className={inputClass} rows={3} value={defaultPaymentInstructions} onChange={e => setDefaultPaymentInstructions(e.target.value)} placeholder="Bank transfer details, mobile banking info, etc." />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
          {company ? 'Update Company' : 'Add Company'}
        </button>
      </div>
    </form>
  );
}
