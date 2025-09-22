-- Create table for below banner images
CREATE TABLE IF NOT EXISTS public.below_banner_images (
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
DROP POLICY IF EXISTS "Public can view active below banner images" ON public.below_banner_images;
CREATE POLICY "Public can view active below banner images" 
  ON public.below_banner_images FOR SELECT 
  USING (is_active = true);

-- Only admins can insert/update/delete
DROP POLICY IF EXISTS "Admins can insert below banner images" ON public.below_banner_images;
CREATE POLICY "Admins can insert below banner images" 
  ON public.below_banner_images FOR INSERT 
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update below banner images" ON public.below_banner_images;
CREATE POLICY "Admins can update below banner images" 
  ON public.below_banner_images FOR UPDATE 
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete below banner images" ON public.below_banner_images;
CREATE POLICY "Admins can delete below banner images" 
  ON public.below_banner_images FOR DELETE 
  USING (public.is_admin());

-- Create storage bucket for below banner images
INSERT INTO storage.buckets (id, name) VALUES ('below-banner-images', 'below-banner-images')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
DROP POLICY IF EXISTS "Public can view below banner images" ON storage.objects;
CREATE POLICY "Public can view below banner images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'below-banner-images');

DROP POLICY IF EXISTS "Admins can upload below banner images" ON storage.objects;
CREATE POLICY "Admins can upload below banner images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'below-banner-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update below banner images" ON storage.objects;
CREATE POLICY "Admins can update below banner images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'below-banner-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete below banner images" ON storage.objects;
CREATE POLICY "Admins can delete below banner images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'below-banner-images' AND public.is_admin());

-- Create trigger for updated_at column
DROP TRIGGER IF EXISTS update_below_banner_images_updated_at ON public.below_banner_images;
CREATE TRIGGER update_below_banner_images_updated_at
  BEFORE UPDATE ON public.below_banner_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();