-- Fix Issue 1: Drop customer_stats view (admin function will aggregate directly with service role)
DROP VIEW IF EXISTS public.customer_stats;

-- Fix Issue 2: Remove the insecure header-based order access policy
DROP POLICY IF EXISTS "Orders viewable with order number and email" ON public.orders;

-- Create a secure access token based policy for order tracking
-- Users can view orders by providing the unique access_token
CREATE POLICY "Orders viewable with valid access token"
ON public.orders
FOR SELECT
USING (
  access_token IS NOT NULL 
  AND access_token = current_setting('request.headers', true)::json->>'x-access-token'
);