# Product System Setup Instructions

## ⚠️ BELANGRIJK: Voer deze stappen uit voordat je producten gaat maken!

### Stap 1: Update de Products tabel

Ga naar Supabase SQL Editor en voer dit uit:

```sql
-- Add new columns to products table if they don't exist
DO $$ 
BEGIN
  -- Add product_type column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'products' 
                AND column_name = 'product_type') THEN
    ALTER TABLE public.products 
    ADD COLUMN product_type TEXT DEFAULT 'single' 
    CHECK (product_type IN ('single', 'bundle', 'subscription_only'));
  END IF;

  -- Add access_type column if it doesn't exist  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'products' 
                AND column_name = 'access_type') THEN
    ALTER TABLE public.products 
    ADD COLUMN access_type TEXT DEFAULT 'paid' 
    CHECK (access_type IN ('free', 'paid', 'subscription_only', 'mixed'));
  END IF;

  -- Add page_count column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'products' 
                AND column_name = 'page_count') THEN
    ALTER TABLE public.products 
    ADD COLUMN page_count INTEGER;
  END IF;

  -- Add bundle_discount column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'products' 
                AND column_name = 'bundle_discount') THEN
    ALTER TABLE public.products 
    ADD COLUMN bundle_discount DECIMAL(5,2) DEFAULT 0;
  END IF;
END $$;
```

### Stap 2: Maak nieuwe tabellen

```sql
-- Product Files table (for storing multiple files per product)
CREATE TABLE IF NOT EXISTS public.product_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  page_count INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle Items table (for bundle products)
CREATE TABLE IF NOT EXISTS public.bundle_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bundle_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Product Access table (for mixed access products)
CREATE TABLE IF NOT EXISTS public.product_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  file_id UUID REFERENCES public.product_files(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL CHECK (access_type IN ('free', 'paid', 'subscription_only')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, file_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_files_product_id ON public.product_files(product_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product_id ON public.bundle_items(product_id);
CREATE INDEX IF NOT EXISTS idx_product_access_product_id ON public.product_access(product_id);

-- Enable RLS
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
```

### Stap 3: Maak Storage Bucket

1. Ga naar Supabase Dashboard → Storage
2. Klik "New bucket"
3. Naam: `product-files`
4. Public bucket: ✅ (aanvinken)
5. File size limit: 50MB
6. Allowed MIME types: `application/pdf,image/*`

### Stap 4: Storage Policies

Voer dit uit in SQL Editor:

```sql
-- Storage policies for product-files bucket
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES 
  ('product-files', 'Public Access', '(true)', 'SELECT'),
  ('product-files', 'Admin Upload', '(EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))', 'INSERT'),
  ('product-files', 'Admin Update', '(EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))', 'UPDATE'),
  ('product-files', 'Admin Delete', '(EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))', 'DELETE')
ON CONFLICT DO NOTHING;
```

### Stap 5: Test Product Creatie

1. Ga naar `/admin/products`
2. Klik "Nieuw Product"
3. Je zou nu moeten zien:
   - Product Type dropdown (Single/Bundle/Subscription)
   - Access Type dropdown
   - File upload zone
   - Bundle selector (als je Bundle kiest)

## Mogelijke Errors en Oplossingen

### Error: "relation does not exist"
→ Je hebt de migrations niet uitgevoerd. Voer alle SQL queries hierboven uit.

### Error: "storage bucket not found"
→ Maak de `product-files` bucket aan in Supabase Storage.

### Error: "permission denied"
→ Check of je is_admin = true hebt in je profiles tabel.

### Files uploaden niet
→ Check of de storage policies correct zijn ingesteld.

## Product Types Uitleg

1. **Single Product**: 
   - Één of meerdere PDF bestanden
   - Verkocht als één product
   - Voorbeeld: "Ramadan Kleurplaat Set"

2. **Bundle**:
   - Combinatie van meerdere single products
   - Automatische kortingsberekening
   - Voorbeeld: "Complete Ramadan Bundel" met 10 losse producten

3. **Subscription Only**:
   - Alleen toegankelijk voor abonnees
   - Geen losse verkoop
   - Voorbeeld: "Premium Werkbladen"

## Access Types Uitleg

1. **Free**: Iedereen kan downloaden
2. **Paid**: Moet gekocht worden
3. **Subscription Only**: Alleen voor €9,99/maand abonnees
4. **Mixed**: Verschillende toegang per bestand (bijv. 2 gratis samples, rest betaald)

Succes met het product systeem! 🚀