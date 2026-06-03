/*
  # Drop unused indexes on invoices table

  1. Changes
    - Drop `idx_invoices_company_id` (unused, redundant with FK constraint)
    - Drop `idx_invoices_client_id` (unused, redundant with FK constraint)
    - Drop `idx_invoices_status` (unused, low cardinality column)

  2. Notes
    - These indexes have not been utilized by any queries
    - Foreign key constraints already provide lookup paths for company_id and client_id
    - Status column has very low cardinality making an index inefficient
*/

DROP INDEX IF EXISTS idx_invoices_company_id;
DROP INDEX IF EXISTS idx_invoices_client_id;
DROP INDEX IF EXISTS idx_invoices_status;
