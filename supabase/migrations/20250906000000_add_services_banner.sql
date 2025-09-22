-- Create services_banner table
CREATE TABLE services_banner (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_services_banner_updated_at
  BEFORE UPDATE ON services_banner
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add storage policies for services_banner
CREATE POLICY "Anyone can view services_banner images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'services-banner');

CREATE POLICY "Admins can upload services_banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'services-banner' AND public.is_admin());

CREATE POLICY "Admins can update services_banner images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'services-banner' AND public.is_admin());

CREATE POLICY "Admins can delete services_banner images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'services-banner' AND public.is_admin());