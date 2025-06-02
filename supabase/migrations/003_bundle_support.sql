-- Add product type to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'single' 
CHECK (product_type IN ('single', 'bundle', 'subscription_only'));

-- Add access type to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'paid' 
CHECK (access_type IN ('free', 'paid', 'subscription_only', 'mixed'));

-- Add bundle metadata
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS bundle_metadata JSONB;

-- Create product_files table for managing multiple files per product
CREATE TABLE IF NOT EXISTS public.product_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bundle_items table for managing products within bundles
CREATE TABLE IF NOT EXISTS public.bundle_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Create product_access table for mixed access bundles
CREATE TABLE IF NOT EXISTS public.product_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_id UUID REFERENCES public.product_files(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL CHECK (access_type IN ('free', 'paid', 'subscription_only')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, file_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_files_product_id ON public.product_files(product_id);
CREATE INDEX IF NOT EXISTS idx_product_files_display_order ON public.product_files(display_order);
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product_id ON public.bundle_items(product_id);
CREATE INDEX IF NOT EXISTS idx_product_access_product_id ON public.product_access(product_id);

-- Enable RLS for new tables
ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_files
CREATE POLICY "Anyone can view product files" ON public.product_files
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage product files" ON public.product_files
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- RLS Policies for bundle_items
CREATE POLICY "Anyone can view bundle items" ON public.bundle_items
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage bundle items" ON public.bundle_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- RLS Policies for product_access
CREATE POLICY "Anyone can view product access" ON public.product_access
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage product access" ON public.product_access
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Add updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.product_files
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to get all files for a product (including bundle items)
CREATE OR REPLACE FUNCTION public.get_product_files(p_product_id UUID)
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  file_type TEXT,
  thumbnail_url TEXT,
  display_order INTEGER,
  is_preview BOOLEAN,
  access_type TEXT,
  source_product_id UUID,
  source_product_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH direct_files AS (
    -- Get files directly attached to the product
    SELECT 
      pf.id,
      pf.file_name,
      pf.file_url,
      pf.file_size,
      pf.file_type,
      pf.thumbnail_url,
      pf.display_order,
      pf.is_preview,
      COALESCE(pa.access_type, p.access_type) as access_type,
      p.id as source_product_id,
      p.name as source_product_name
    FROM public.product_files pf
    JOIN public.products p ON p.id = pf.product_id
    LEFT JOIN public.product_access pa ON pa.file_id = pf.id
    WHERE pf.product_id = p_product_id
  ),
  bundle_files AS (
    -- Get files from products in the bundle
    SELECT 
      pf.id,
      pf.file_name,
      pf.file_url,
      pf.file_size,
      pf.file_type,
      pf.thumbnail_url,
      bi.display_order * 1000 + pf.display_order as display_order, -- Ensure bundle item order is preserved
      pf.is_preview,
      COALESCE(pa.access_type, p.access_type) as access_type,
      p.id as source_product_id,
      p.name as source_product_name
    FROM public.bundle_items bi
    JOIN public.product_files pf ON pf.product_id = bi.product_id
    JOIN public.products p ON p.id = bi.product_id
    LEFT JOIN public.product_access pa ON pa.file_id = pf.id
    WHERE bi.bundle_id = p_product_id
  )
  SELECT * FROM direct_files
  UNION ALL
  SELECT * FROM bundle_files
  ORDER BY display_order;
END;
$$ LANGUAGE plpgsql;

-- Create function to check user access to a file
CREATE OR REPLACE FUNCTION public.check_file_access(
  p_user_id UUID,
  p_file_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_access_type TEXT;
  v_has_subscription BOOLEAN;
  v_has_purchase BOOLEAN;
BEGIN
  -- Get file access type
  SELECT 
    COALESCE(pa.access_type, p.access_type, 'paid') INTO v_access_type
  FROM public.product_files pf
  JOIN public.products p ON p.id = pf.product_id
  LEFT JOIN public.product_access pa ON pa.file_id = pf.id
  WHERE pf.id = p_file_id;
  
  -- If free, grant access
  IF v_access_type = 'free' THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has active subscription
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = p_user_id 
    AND status = 'active'
    AND current_period_end > NOW()
  ) INTO v_has_subscription;
  
  -- If subscription only and has subscription, grant access
  IF v_access_type = 'subscription_only' AND v_has_subscription THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has purchased the product
  SELECT EXISTS (
    SELECT 1 
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    JOIN public.product_files pf ON pf.product_id = oi.product_id
    WHERE o.user_id = p_user_id 
    AND o.payment_status = 'paid'
    AND pf.id = p_file_id
  ) INTO v_has_purchase;
  
  -- If paid and has purchase or subscription, grant access
  IF v_access_type = 'paid' AND (v_has_purchase OR v_has_subscription) THEN
    RETURN TRUE;
  END IF;
  
  -- For mixed access, check both
  IF v_access_type = 'mixed' AND (v_has_purchase OR v_has_subscription) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migrate existing file data to product_files table
INSERT INTO public.product_files (
  product_id,
  file_name,
  file_path,
  file_url,
  file_size,
  file_type,
  display_order,
  created_at,
  updated_at
)
SELECT 
  id as product_id,
  COALESCE(name, 'Product File') as file_name,
  COALESCE(file_url, '') as file_path,
  COALESCE(file_url, '') as file_url,
  file_size,
  'application/pdf' as file_type,
  0 as display_order,
  created_at,
  updated_at
FROM public.products
WHERE file_url IS NOT NULL
ON CONFLICT DO NOTHING;