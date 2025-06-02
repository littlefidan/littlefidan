-- Create storage bucket for product files
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', true)
ON CONFLICT DO NOTHING;

-- RLS policies for product-files bucket
CREATE POLICY "Public users can view product files" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-files');

CREATE POLICY "Admins can upload product files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update product files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete product files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-files' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );