-- Create products table for catalog management
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('masculino', 'feminino', 'unissex')),
  description TEXT,
  size TEXT NOT NULL,
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  concentration TEXT,
  year INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY "Anyone can read active products"
ON public.products
FOR SELECT
USING (active = true);

-- Service role can manage all products
CREATE POLICY "Service role can manage products"
ON public.products
FOR ALL
USING (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text);

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();

-- Create customers view for admin (unique customers from orders)
CREATE VIEW public.customer_stats AS
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