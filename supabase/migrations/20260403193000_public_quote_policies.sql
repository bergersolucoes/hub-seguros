CREATE POLICY "Public can view active public products"
ON public.products
FOR SELECT
TO anon
USING (is_active = true AND public_page_enabled = true);

CREATE POLICY "Public can create site leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (
  source = 'site_publico'
  AND status = 'novo'
  AND product_id IS NOT NULL
  AND full_name IS NOT NULL
  AND char_length(trim(full_name)) > 0
  AND email IS NOT NULL
  AND char_length(trim(email)) > 0
  AND phone IS NOT NULL
  AND char_length(trim(phone)) > 0
);
