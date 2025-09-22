-- Create table for below banner images
CREATE TABLE public.below_banner_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  title TEXT,
  description TEXT,
  link_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.below_banner_images ENABLE ROW LEVEL SECURITY;

-- Public can read active images
CREATE POLICY "Public can view active below banner images" 
  ON public.below_banner_images FOR SELECT 
  USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert below banner images" 
  ON public.below_banner_images FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update below banner images" 
  ON public.below_banner_images FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can delete below banner images" 
  ON public.below_banner_images FOR DELETE 
  USING (public.is_admin());

-- Create storage bucket for below banner images
INSERT INTO storage.buckets (id, name) VALUES ('below-banner-images', 'below-banner-images')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public can view below banner images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'below-banner-images');

CREATE POLICY "Admins can upload below banner images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'below-banner-images' AND public.is_admin());

CREATE POLICY "Admins can update below banner images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'below-banner-images' AND public.is_admin());

CREATE POLICY "Admins can delete below banner images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'below-banner-images' AND public.is_admin());