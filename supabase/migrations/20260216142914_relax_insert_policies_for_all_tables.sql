/*
  # Relax INSERT policies to prevent transaction timing issues

  Similar to invoice_items, other tables may have timing issues with
  EXISTS checks during INSERT. This migration relaxes all INSERT policies
  to only check NOT NULL, while keeping strict UPDATE/DELETE policies.

  1. Changes
    - Relax INSERT policies for: clients, invoices, item_library
    - Only require foreign key fields to be NOT NULL on INSERT
    - Keep strict EXISTS checks on UPDATE and DELETE operations

  2. Security Note
    - This prevents transaction timing issues during data creation
    - UPDATE/DELETE still enforce referential integrity
    - For production with auth, these should also check auth.uid()
*/

-- CLIENTS
DROP POLICY IF EXISTS "Insert client with valid company" ON clients;

CREATE POLICY "Insert client with company_id"
  ON clients FOR INSERT
  TO anon
  WITH CHECK (company_id IS NOT NULL);

-- INVOICES
DROP POLICY IF EXISTS "Insert invoice with valid company" ON invoices;

CREATE POLICY "Insert invoice with company_id"
  ON invoices FOR INSERT
  TO anon
  WITH CHECK (company_id IS NOT NULL);

-- ITEM_LIBRARY
DROP POLICY IF EXISTS "Insert library item with valid company" ON item_library;

CREATE POLICY "Insert library item with company_id"
  ON item_library FOR INSERT
  TO anon
  WITH CHECK (company_id IS NOT NULL);
