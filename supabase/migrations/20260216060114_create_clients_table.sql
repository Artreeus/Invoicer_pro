/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `company_id` (uuid, FK to companies)
      - `name` (text, required)
      - `address` (text)
      - `phone` (text)
      - `email` (text)
      - `contact_person` (text)
      - `bin` (text) - optional BIN
      - `tin` (text) - optional TIN
      - `notes` (text)
      - `created_at`, `updated_at`

  2. Security
    - Enable RLS with anonymous access policies
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  contact_person text DEFAULT '',
  bin text DEFAULT '',
  tin text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_clients_company_id ON clients(company_id);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read clients"
  ON clients FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert clients"
  ON clients FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update clients"
  ON clients FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete clients"
  ON clients FOR DELETE TO anon USING (true);
