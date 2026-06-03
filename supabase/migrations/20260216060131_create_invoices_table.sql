/*
  # Create invoices table

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key)
      - `company_id` (uuid, FK)
      - `client_id` (uuid, FK)
      - `invoice_number` (text, unique display number)
      - `status` (text - draft/sent/paid/overdue/cancelled)
      - `issue_date`, `due_date` (date)
      - `currency` (text, default BDT)
      - `subtotal`, `total_discount`, `total_vat`, `grand_total` (numeric)
      - `template_id` (text - template identifier)
      - `notes`, `terms_and_conditions`, `payment_instructions`
      - `footer_thank_you_note`, `vat_disclaimer`
      - `authorized_signatory_name`, `authorized_signatory_title`
      - Timestamps

  2. Security
    - Enable RLS with anonymous access policies

  3. Indexes
    - company_id, client_id, status, invoice_number
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  currency text DEFAULT 'BDT',
  subtotal numeric DEFAULT 0,
  total_discount numeric DEFAULT 0,
  total_vat numeric DEFAULT 0,
  grand_total numeric DEFAULT 0,
  template_id text DEFAULT 'corporate',
  notes text DEFAULT '',
  terms_and_conditions text DEFAULT '',
  payment_instructions text DEFAULT '',
  footer_thank_you_note text DEFAULT 'Thank you for your business!',
  vat_disclaimer text DEFAULT 'VAT collected as per Bangladesh VAT and Supplementary Duty Act 2012.',
  authorized_signatory_name text DEFAULT '',
  authorized_signatory_title text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE UNIQUE INDEX idx_invoices_number_company ON invoices(company_id, invoice_number);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read invoices"
  ON invoices FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert invoices"
  ON invoices FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update invoices"
  ON invoices FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete invoices"
  ON invoices FOR DELETE TO anon USING (true);
