-- Create table for company sections
CREATE TABLE public.company_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  alt_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index for performance
CREATE INDEX idx_company_sections_active_order
  ON public.company_sections(is_active, sort_order);

-- Add RLS policies
ALTER TABLE public.company_sections ENABLE ROW LEVEL SECURITY;

-- Public can read active sections
CREATE POLICY "Public can view active company sections"
  ON public.company_sections FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert company sections"
  ON public.company_sections FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update company sections"
  ON public.company_sections FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete company sections"
  ON public.company_sections FOR DELETE
  USING (public.is_admin());

-- Create trigger for updated_at column
CREATE TRIGGER update_company_sections_updated_at
  BEFORE UPDATE ON public.company_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.company_sections (section_key, title, description, image_url, alt_text, sort_order, is_active)
VALUES
  (
    'estrutura_1',
    'Estrutura de Ponta',
    'Instalações modernas com showroom, área técnica e centro de distribuição integrados para atendimento completo.',
    'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Fachada+Moderna',
    'Fachada moderna da loja Grupo Soares',
    1,
    true
  ),
  (
    'estrutura_2',
    'Estacionamento Próprio e Gratuito',
    'Amplo estacionamento para clientes com acesso facilitado para carga e descarga, sem custo adicional.',
    'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Estacionamento',
    'Estacionamento amplo e gratuito do Grupo Soares',
    2,
    true
  ),
  (
    'estrutura_3',
    'Atendimento Especializado',
    'Equipe técnica com conhecimento profundo em aplicações industriais e materiais de construção.',
    'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Atendimento',
    'Equipe de atendimento especializado do Grupo Soares',
    3,
    true
  ),
  (
    'visite_loja',
    'Visite Nossa Loja',
    'Conheça pessoalmente nossa estrutura moderna, com estacionamento próprio e gratuito.',
    'https://placehold.co/800x600/174A8B/FFFFFF/png?text=Fachada+Grupo+Soares',
    'Fachada da loja Grupo Soares com estacionamento',
    4,
    true
  );