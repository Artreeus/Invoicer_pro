export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bin: string;
  tin: string;
  vat_registration_number: string;
  trade_license_number: string;
  bank_details: BankDetails;
  mobile_banking: MobileBanking;
  brand_color: string;
  invoice_prefix: string;
  next_invoice_number: number;
  default_vat_rate: number;
  default_terms: string;
  default_payment_instructions: string;
  created_at: string;
  updated_at: string;
}

export interface BankDetails {
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  branch?: string;
  routing_number?: string;
  swift_code?: string;
}

export interface MobileBanking {
  bkash?: string;
  nagad?: string;
  rocket?: string;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contact_person: string;
  bin: string;
  tin: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type DiscountType = 'percentage' | 'fixed';

export const VAT_RATES = [0, 5, 7.5, 10, 15] as const;

export const CURRENCIES = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
] as const;

export interface InvoiceItem {
  id: string;
  invoice_id?: string;
  sort_order: number;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_type: DiscountType;
  discount_value: number;
  vat_rate: number;
  vat_amount: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  company_id: string;
  client_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  currency: string;
  subtotal: number;
  total_discount: number;
  total_vat: number;
  grand_total: number;
  template_id: string;
  notes: string;
  terms_and_conditions: string;
  payment_instructions: string;
  footer_thank_you_note: string;
  vat_disclaimer: string;
  authorized_signatory_name: string;
  authorized_signatory_title: string;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
  client?: Client;
  company?: Company;
}

export interface ItemLibrary {
  id: string;
  company_id: string;
  name: string;
  description: string;
  default_unit_price: number;
  default_vat_rate: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export const INVOICE_TEMPLATES: TemplateInfo[] = [
  { id: 'stripe', name: 'Stripe', description: 'Clean SaaS receipt with generous whitespace', thumbnail: '' },
  { id: 'aurora', name: 'Aurora', description: 'Gradient mesh header with frosted glass card', thumbnail: '' },
  { id: 'onyx', name: 'Onyx', description: 'Premium full-dark theme with gold accent', thumbnail: '' },
  { id: 'slate', name: 'Slate', description: 'Editorial monochrome with oversized type', thumbnail: '' },
  { id: 'vibrant', name: 'Vibrant', description: 'Bold colour blocks and duotone totals', thumbnail: '' },
  { id: 'wave', name: 'Wave', description: 'Curved wave header with rounded info chips', thumbnail: '' },
  { id: 'swiss', name: 'Swiss', description: 'Strict typographic grid with bold rules', thumbnail: '' },
  { id: 'ledger', name: 'Ledger', description: 'Monospace accounting ledger on cream', thumbnail: '' },
  { id: 'sunset', name: 'Sunset', description: 'Warm gradient sidebar, full-height', thumbnail: '' },
  { id: 'terminal', name: 'Terminal', description: 'Dark code-editor theme, monospace', thumbnail: '' },
  { id: 'notion', name: 'Notion', description: 'Calm document blocks and callouts', thumbnail: '' },
  { id: 'corporate', name: 'Corporate', description: 'Premium header with structured grid layout', thumbnail: '' },
  { id: 'modern', name: 'Modern', description: 'Side accent bar with dark table header', thumbnail: '' },
  { id: 'executive', name: 'Executive', description: 'Dark header with gradient overlay', thumbnail: '' },
  { id: 'elegant', name: 'Elegant', description: 'Light, refined typography with subtle accents', thumbnail: '' },
  { id: 'bold', name: 'Bold', description: 'Vibrant header with floating card sections', thumbnail: '' },
  { id: 'creative', name: 'Creative', description: 'Geometric shapes with colorful accents', thumbnail: '' },
  { id: 'minimal', name: 'Minimal', description: 'Maximum whitespace, subtle design', thumbnail: '' },
  { id: 'classic', name: 'Classic', description: 'Traditional bordered table layout', thumbnail: '' },
  { id: 'retail', name: 'Retail', description: 'Card-style items with status badges', thumbnail: '' },
  { id: 'service', name: 'Service-Based', description: 'Service-card layout with details', thumbnail: '' },
  { id: 'logistics', name: 'Logistics', description: 'Three-column meta with transport focus', thumbnail: '' },
  { id: 'freelancer', name: 'Freelancer', description: 'Personal branding with circular avatar', thumbnail: '' },
  { id: 'formal', name: 'Formal', description: 'Government/institutional with seal area', thumbnail: '' },
];
