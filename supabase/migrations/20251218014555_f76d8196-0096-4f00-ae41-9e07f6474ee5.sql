-- Fix security warning by setting search_path for the generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'JF' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(CAST(FLOOR(RANDOM() * 10000) AS TEXT), 4, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;