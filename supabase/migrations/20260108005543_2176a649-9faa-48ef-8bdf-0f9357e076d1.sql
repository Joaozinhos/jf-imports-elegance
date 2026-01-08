-- Fix loyalty_transactions RLS - restrict access to prevent email exposure and fake points creation

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can create transactions" ON public.loyalty_transactions;
DROP POLICY IF EXISTS "Anyone can read transactions" ON public.loyalty_transactions;

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access on loyalty_transactions"
ON public.loyalty_transactions
FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);

-- Create policy that allows reading transactions only via email header match
-- This matches the pattern used for order tracking
CREATE POLICY "Customers can view their own transactions"
ON public.loyalty_transactions
FOR SELECT
USING (
  customer_email = current_setting('request.headers', true)::json->>'x-customer-email'
);

-- Allow inserts only when order_id is provided and matches an existing order
-- This prevents fake point creation as transactions must be linked to real orders
CREATE POLICY "Transactions require valid order"
ON public.loyalty_transactions
FOR INSERT
WITH CHECK (
  order_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.orders WHERE id = order_id
  )
);