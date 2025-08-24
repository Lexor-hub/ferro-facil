-- Create storage buckets for product images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('product-images', 'product-images', true),
  ('general-images', 'general-images', true);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'coming-soon')),
  images TEXT[] DEFAULT '{}',
  bullet_points TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (true);

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'product-images');

-- General images policies
CREATE POLICY "General images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'general-images');

CREATE POLICY "Authenticated users can insert general images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'general-images');

CREATE POLICY "Authenticated users can update general images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'general-images');

CREATE POLICY "Authenticated users can delete general images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'general-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products from current catalog
INSERT INTO public.products (name, category, description, status, bullet_points) VALUES 
  ('Equipamentos de Elevação', 'elevacao', 'Equipamentos profissionais para elevação de cargas', 'available', ARRAY['Capacidade variável', 'Manutenção inclusa', 'Operação segura']),
  ('Máquinas Pesadas', 'maquinas-pesadas', 'Máquinas para construção e mineração', 'available', ARRAY['Alto desempenho', 'Tecnologia avançada', 'Suporte técnico']),
  ('Transporte Especializado', 'transporte', 'Soluções completas de transporte', 'available', ARRAY['Frota moderna', 'Rastreamento GPS', 'Seguro total']),
  ('Ferramentas Pneumáticas', 'ferramentas', 'Ferramentas de alta precisão', 'available', ARRAY['Durabilidade comprovada', 'Garantia estendida', 'Manutenção preventiva']),
  ('Sistemas Hidráulicos', 'hidraulicos', 'Sistemas completos hidráulicos', 'available', ARRAY['Pressão controlada', 'Componentes originais', 'Instalação profissional']),
  ('Compressores Industriais', 'compressores', 'Compressores de alta performance', 'available', ARRAY['Baixo consumo', 'Operação silenciosa', 'Manutenção facilitada']);