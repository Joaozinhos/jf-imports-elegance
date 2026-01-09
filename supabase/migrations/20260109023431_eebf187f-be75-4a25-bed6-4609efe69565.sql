-- Fix the security definer view issue by recreating with security_invoker
DROP VIEW IF EXISTS public.customer_stats;

CREATE VIEW public.customer_stats 
WITH (security_invoker = true) AS
SELECT 
  customer_email,
  customer_name,
  MAX(customer_phone) as customer_phone,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_spent,
  MAX(created_at) as last_order_date,
  MIN(created_at) as first_order_date
FROM public.orders
GROUP BY customer_email, customer_name;