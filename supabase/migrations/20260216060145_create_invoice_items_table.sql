/*
  # Create invoice_items table

  1. New Tables
    - `invoice_items` - Line items for each invoice
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, FK to invoices)
      - `sort_order` (integer)
      - `item_name` (text)
      - `description` (text)
      - `quantity` (numeric)
      - `unit_price` (numeric)
      - `discount_type` (text - percentage or fixed)
      - `discount_value` (numeric)
      - `vat_rate` (numeric)
      - `vat_amount` (numeric)
      - `line_total` (numeric)

  2. Security
    - Enable RLS with anonymous access policies
*/

CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  item_name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  quantity numeric DEFAULT 1,
  unit_price numeric DEFAULT 0,
  discount_type text DEFAULT 'percentage',
  discount_value numeric DEFAULT 0,
  vat_rate numeric DEFAULT 0,
  vat_amount numeric DEFAULT 0,
  line_total numeric DEFAULT 0
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read invoice_items"
  ON invoice_items FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert invoice_items"
  ON invoice_items FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update invoice_items"
  ON invoice_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete invoice_items"
  ON invoice_items FOR DELETE TO anon USING (true);
