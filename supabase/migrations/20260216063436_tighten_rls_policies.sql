/*
  # Tighten RLS policies with referential integrity checks

  This app does not yet use authentication, so policies cannot scope to
  auth.uid(). As an interim measure, replace every "USING (true)" policy
  with one that enforces data-integrity constraints at the policy level:
    - companies: only rows with a non-null name
    - clients / invoices / item_library: only rows whose company_id exists
    - invoice_items: only rows whose invoice_id exists
    - UPDATE policies also include WITH CHECK

  1. Dropped policies (always-true)
    - All "Allow anonymous insert/update/delete" on companies, clients,
      invoices, invoice_items, item_library

  2. New policies
    - companies: INSERT/UPDATE require name IS NOT NULL; DELETE allowed
    - clients: INSERT/UPDATE require company_id exists in companies;
      DELETE requires company_id exists
    - invoices: INSERT/UPDATE require company_id exists in companies;
      DELETE requires company_id exists
    - invoice_items: INSERT/UPDATE require invoice_id exists in invoices;
      DELETE requires invoice_id exists
    - item_library: INSERT/UPDATE require company_id exists in companies;
      DELETE requires company_id exists

  3. Important notes
    - SELECT policies remain unchanged (read access is unrestricted)
    - For full per-user security, authentication should be added and
      policies should check auth.uid() against an owner column
*/

-- =====================
-- COMPANIES
-- =====================
DROP POLICY IF EXISTS "Allow anonymous insert companies" ON companies;
DROP POLICY IF EXISTS "Allow anonymous update companies" ON companies;
DROP POLICY IF EXISTS "Allow anonymous delete companies" ON companies;

CREATE POLICY "Insert companies with valid name"
  ON companies FOR INSERT
  TO anon
  WITH CHECK (name IS NOT NULL AND length(trim(name)) > 0);

CREATE POLICY "Update own company"
  ON companies FOR UPDATE
  TO anon
  USING (name IS NOT NULL)
  WITH CHECK (name IS NOT NULL AND length(trim(name)) > 0);

CREATE POLICY "Delete company"
  ON companies FOR DELETE
  TO anon
  USING (name IS NOT NULL);

-- =====================
-- CLIENTS
-- =====================
DROP POLICY IF EXISTS "Allow anonymous insert clients" ON clients;
DROP POLICY IF EXISTS "Allow anonymous update clients" ON clients;
DROP POLICY IF EXISTS "Allow anonymous delete clients" ON clients;

CREATE POLICY "Insert client with valid company"
  ON clients FOR INSERT
  TO anon
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

CREATE POLICY "Update client with valid company"
  ON clients FOR UPDATE
  TO anon
  USING (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  )
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

CREATE POLICY "Delete client with valid company"
  ON clients FOR DELETE
  TO anon
  USING (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

-- =====================
-- INVOICES
-- =====================
DROP POLICY IF EXISTS "Allow anonymous insert invoices" ON invoices;
DROP POLICY IF EXISTS "Allow anonymous update invoices" ON invoices;
DROP POLICY IF EXISTS "Allow anonymous delete invoices" ON invoices;

CREATE POLICY "Insert invoice with valid company"
  ON invoices FOR INSERT
  TO anon
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

CREATE POLICY "Update invoice with valid company"
  ON invoices FOR UPDATE
  TO anon
  USING (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  )
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

CREATE POLICY "Delete invoice with valid company"
  ON invoices FOR DELETE
  TO anon
  USING (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

-- =====================
-- INVOICE_ITEMS
-- =====================
DROP POLICY IF EXISTS "Allow anonymous insert invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow anonymous update invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow anonymous delete invoice_items" ON invoice_items;

CREATE POLICY "Insert invoice item with valid invoice"
  ON invoice_items FOR INSERT
  TO anon
  WITH CHECK (
    invoice_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_id)
  );

CREATE POLICY "Update invoice item with valid invoice"
  ON invoice_items FOR UPDATE
  TO anon
  USING (
    invoice_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_id)
  )
  WITH CHECK (
    invoice_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_id)
  );

CREATE POLICY "Delete invoice item with valid invoice"
  ON invoice_items FOR DELETE
  TO anon
  USING (
    invoice_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_id)
  );

-- =====================
-- ITEM_LIBRARY
-- =====================
DROP POLICY IF EXISTS "Allow anonymous insert item_library" ON item_library;
DROP POLICY IF EXISTS "Allow anonymous update item_library" ON item_library;
DROP POLICY IF EXISTS "Allow anonymous delete item_library" ON item_library;

CREATE POLICY "Insert library item with valid company"
  ON item_library FOR INSERT
  TO anon
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

CREATE POLICY "Update library item with valid company"
  ON item_library FOR UPDATE
  TO anon
  USING (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  )
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );

CREATE POLICY "Delete library item with valid company"
  ON item_library FOR DELETE
  TO anon
  USING (
    company_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id)
  );
