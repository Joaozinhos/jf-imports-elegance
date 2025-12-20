-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value NUMERIC NOT NULL DEFAULT 0,
  min_purchase NUMERIC DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock alerts table
CREATE TABLE public.stock_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  email TEXT NOT NULL,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, email)
);

-- Enable RLS on coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active coupons (for validation)
CREATE POLICY "Anyone can read active coupons"
ON public.coupons
FOR SELECT
USING (active = true);

-- Enable RLS on stock_alerts
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create stock alerts
CREATE POLICY "Anyone can create stock alerts"
ON public.stock_alerts
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read their own alerts by email
CREATE POLICY "Anyone can read stock alerts"
ON public.stock_alerts
FOR SELECT
USING (true);

-- Insert sample coupons for testing
INSERT INTO public.coupons (code, type, value, min_purchase, active) VALUES
('BEMVINDO10', 'percentage', 10, 0, true),
('FRETEGRATIS', 'free_shipping', 0, 150, true),
('DESCONTO20', 'fixed', 20, 100, true);