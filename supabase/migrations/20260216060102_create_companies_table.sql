/*
  # Create companies table

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, required) - Company display name
      - `logo_url` (text) - URL to company logo
      - `address` (text) - Full company address
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email
      - `website` (text) - Company website
      - `bin` (text) - Business Identification Number
      - `tin` (text) - Tax Identification Number
      - `vat_registration_number` (text) - VAT registration
      - `trade_license_number` (text) - Trade license
      - `bank_details` (jsonb) - Bank account information
      - `mobile_banking` (jsonb) - bKash, Nagad, Rocket details
      - `brand_color` (text) - Primary branding color
      - `invoice_prefix` (text) - Prefix for invoice numbers
      - `next_invoice_number` (integer) - Auto-increment counter
      - `default_vat_rate` (numeric) - Default VAT percentage
      - `default_terms` (text) - Default invoice terms
      - `default_payment_instructions` (text) - Default payment info
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `companies` table
    - Add policy for anonymous access (single-user app)
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  website text DEFAULT '',
  bin text DEFAULT '',
  tin text DEFAULT '',
  vat_registration_number text DEFAULT '',
  trade_license_number text DEFAULT '',
  bank_details jsonb DEFAULT '{}',
  mobile_banking jsonb DEFAULT '{}',
  brand_color text DEFAULT '#0d9488',
  invoice_prefix text DEFAULT 'INV',
  next_invoice_number integer DEFAULT 1,
  default_vat_rate numeric DEFAULT 15,
  default_terms text DEFAULT '',
  default_payment_instructions text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read companies"
  ON companies FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert companies"
  ON companies FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update companies"
  ON companies FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous delete companies"
  ON companies FOR DELETE
  TO anon
  USING (true);
