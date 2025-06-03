-- Fix admin tables and permissions for LittleFidan
-- Run this in Supabase SQL Editor

-- 1. Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS sale_price decimal(10,2),
ADD COLUMN IF NOT EXISTS is_bundle boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bundle_items jsonb;

-- 2. Add is_admin to profiles if not exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 3. Fix orders table structure
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_number text,
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS shipping_address jsonb,
ADD COLUMN IF NOT EXISTS notes text;

-- 4. Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Kleurplaten', 'kleurplaten', 'Educatieve kleurplaten voor kinderen'),
  ('Werkbladen', 'werkbladen', 'Leer werkbladen voor verschillende leeftijden'),
  ('Islamitisch', 'islamitisch', 'Islamitische educatieve materialen'),
  ('Bundels', 'bundels', 'Voordelige product bundels')
ON CONFLICT (slug) DO NOTHING;

-- 6. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin full access" ON products;
DROP POLICY IF EXISTS "Public read" ON categories;
DROP POLICY IF EXISTS "Admin manage" ON categories;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin manage orders" ON orders;
DROP POLICY IF EXISTS "Users read own orders" ON orders;

-- 8. Create admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Products policies
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can do everything with products"
  ON products FOR ALL
  USING (is_admin());

-- 10. Categories policies  
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- 11. Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- 12. Orders policies
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (is_admin());

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- 13. Create AI generated products storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-generated', 'ai-generated', true)
ON CONFLICT (id) DO NOTHING;

-- 14. Storage policies for AI generated content
CREATE POLICY "Admins can upload AI generated content"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ai-generated' AND is_admin());

CREATE POLICY "Public can view AI generated content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ai-generated');

CREATE POLICY "Admins can delete AI generated content"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ai-generated' AND is_admin());

-- 15. Fix any null product images
UPDATE products 
SET images = ARRAY[image_url]
WHERE images IS NULL AND image_url IS NOT NULL;

-- 16. Ensure order numbers are unique
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_unique ON orders(order_number);

PRINT 'Admin tables setup complete!';