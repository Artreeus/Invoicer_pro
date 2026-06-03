/*
  # Create item_library table

  1. New Tables
    - `item_library` - Reusable saved items
      - `id` (uuid, primary key)
      - `company_id` (uuid, FK to companies)
      - `name` (text)
      - `description` (text)
      - `default_unit_price` (numeric)
      - `default_vat_rate` (numeric)
      - `category` (text)
      - Timestamps

  2. Security
    - Enable RLS with anonymous access policies
*/

CREATE TABLE IF NOT EXISTS item_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  default_unit_price numeric DEFAULT 0,
  default_vat_rate numeric DEFAULT 15,
  category text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_item_library_company_id ON item_library(company_id);

ALTER TABLE item_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read item_library"
  ON item_library FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert item_library"
  ON item_library FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update item_library"
  ON item_library FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete item_library"
  ON item_library FOR DELETE TO anon USING (true);
