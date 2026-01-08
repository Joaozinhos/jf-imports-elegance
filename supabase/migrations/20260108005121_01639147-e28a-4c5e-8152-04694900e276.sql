-- Fix security: Add access token to orders and fix RLS policies

-- Step 1: Add access_token column for secure order access
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS access_token TEXT UNIQUE DEFAULT gen_random_uuid()::text;
CREATE INDEX IF NOT EXISTS idx_orders_access_token ON public.orders(access_token);

-- Step 2: Drop insecure RLS policies
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders" ON public.orders;

-- Step 3: Create secure SELECT policy - orders only viewable with valid access token
-- Using order_number + email combination for tracking page
CREATE POLICY "Orders viewable with order number and email"
ON public.orders
FOR SELECT
USING (
  -- Allow access via order_number when matched with customer_email from request headers
  order_number = current_setting('request.headers', true)::json->>'x-order-number'
  AND customer_email = current_setting('request.headers', true)::json->>'x-customer-email'
);

-- Create policy for service role to bypass RLS (for edge functions and admin)
CREATE POLICY "Service role full access"
ON public.orders
FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);

-- Step 4: Block all client-side updates - updates only via service role
CREATE POLICY "No client updates to orders"
ON public.orders
FOR UPDATE
USING (false)
WITH CHECK (false);