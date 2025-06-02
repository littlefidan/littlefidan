-- Add is_admin field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create settings table for admin settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT DEFAULT 'LittleFidan',
  store_email TEXT DEFAULT 'info@littlefidan.nl',
  store_phone TEXT,
  store_address TEXT,
  currency TEXT DEFAULT 'EUR',
  tax_rate DECIMAL(5,2) DEFAULT 21.00,
  shipping_fee DECIMAL(10,2) DEFAULT 5.99,
  free_shipping_threshold DECIMAL(10,2) DEFAULT 50.00,
  order_email_notifications BOOLEAN DEFAULT TRUE,
  new_subscriber_notifications BOOLEAN DEFAULT TRUE,
  low_stock_notifications BOOLEAN DEFAULT TRUE,
  low_stock_threshold INTEGER DEFAULT 10,
  instagram_handle TEXT DEFAULT '@littlefidan',
  facebook_url TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  maintenance_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create files table for PDF management
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for admin access
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Settings policies (only admins can read/write)
CREATE POLICY "Admins can read settings" ON settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update settings" ON settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Files policies
CREATE POLICY "Admins can manage files" ON files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "Anyone can read files" ON files
  FOR SELECT
  USING (TRUE);

-- Subscribers policies
CREATE POLICY "Admins can manage subscribers" ON subscribers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Create storage bucket for files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to files bucket
CREATE POLICY "Public access to files" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'files');

-- Allow admins to upload to files bucket
CREATE POLICY "Admins can upload files" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'files' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Allow admins to delete files
CREATE POLICY "Admins can delete files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'files' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = TRUE
    )
  );

-- Insert default settings row
INSERT INTO settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;