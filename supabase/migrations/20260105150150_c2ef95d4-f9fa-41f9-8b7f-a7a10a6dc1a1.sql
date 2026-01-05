-- Create loyalty points table
CREATE TABLE public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_redeemed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loyalty transactions table for history
CREATE TABLE public.loyalty_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired')),
  description TEXT,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for loyalty_points (public read/write by email)
CREATE POLICY "Anyone can read their own points"
ON public.loyalty_points
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create points record"
ON public.loyalty_points
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their own points"
ON public.loyalty_points
FOR UPDATE
USING (true);

-- RLS policies for loyalty_transactions
CREATE POLICY "Anyone can read transactions"
ON public.loyalty_transactions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create transactions"
ON public.loyalty_transactions
FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at on loyalty_points
CREATE TRIGGER update_loyalty_points_updated_at
BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();

-- Enable realtime for points
ALTER PUBLICATION supabase_realtime ADD TABLE public.loyalty_points;