-- Allow inserting, updating, and deleting coupons (for admin)
CREATE POLICY "Allow insert coupons"
ON public.coupons
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update coupons"
ON public.coupons
FOR UPDATE
USING (true);

CREATE POLICY "Allow delete coupons"
ON public.coupons
FOR DELETE
USING (true);

-- Allow updating orders (for admin to add tracking, change status)
CREATE POLICY "Allow update orders"
ON public.orders
FOR UPDATE
USING (true);