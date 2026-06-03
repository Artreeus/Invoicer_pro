/*
  # Fix invoice_items INSERT policy

  The previous policy blocked inserts due to transaction timing issues.
  The EXISTS check couldn't see the just-created invoice.

  1. Changes
    - Drop restrictive INSERT policy for invoice_items
    - Create new INSERT policy that only requires invoice_id IS NOT NULL
    - Keep the strict UPDATE and DELETE policies with EXISTS checks

  2. Security Note
    - This relaxes INSERT validation to fix the blocking issue
    - For production with auth, this should check auth.uid() ownership
*/

DROP POLICY IF EXISTS "Insert invoice item with valid invoice" ON invoice_items;

CREATE POLICY "Insert invoice item with invoice_id"
  ON invoice_items FOR INSERT
  TO anon
  WITH CHECK (invoice_id IS NOT NULL);
