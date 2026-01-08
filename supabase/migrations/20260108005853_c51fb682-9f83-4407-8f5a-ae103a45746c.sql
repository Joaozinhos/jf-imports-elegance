-- Fix remaining RLS security issues

-- ============================================
-- FIX stock_alerts table
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can read stock alerts" ON public.stock_alerts;
DROP POLICY IF EXISTS "Anyone can create stock alerts" ON public.stock_alerts;

-- Allow creating stock alerts (public feature for out-of-stock notifications)
-- but require email to be provided
CREATE POLICY "Anyone can create stock alerts with valid email"
ON public.stock_alerts
FOR INSERT
WITH CHECK (
  email IS NOT NULL 
  AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  AND length(email) <= 255
);

-- Only allow reading own alerts via header-based email verification
CREATE POLICY "Customers can view their own stock alerts"
ON public.stock_alerts
FOR SELECT
USING (
  email = current_setting('request.headers', true)::json->>'x-customer-email'
);

-- Service role full access
CREATE POLICY "Service role full access on stock_alerts"
ON public.stock_alerts
FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);

-- ============================================
-- FIX loyalty_points table
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can read their own points" ON public.loyalty_points;
DROP POLICY IF EXISTS "Anyone can update their own points" ON public.loyalty_points;
DROP POLICY IF EXISTS "Anyone can create points record" ON public.loyalty_points;

-- Service role only for all operations (points managed by backend)
CREATE POLICY "Service role full access on loyalty_points"
ON public.loyalty_points
FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);

-- Allow customers to read only their own points via header-based verification
CREATE POLICY "Customers can view their own points"
ON public.loyalty_points
FOR SELECT
USING (
  customer_email = current_setting('request.headers', true)::json->>'x-customer-email'
);

-- ============================================
-- FIX coupons table
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow delete coupons" ON public.coupons;

-- Keep the public read for active coupons (validation at checkout)
-- Already exists: "Anyone can read active coupons" with (active = true)

-- Service role only for write operations (managed via admin edge function)
CREATE POLICY "Service role can manage coupons"
ON public.coupons
FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);