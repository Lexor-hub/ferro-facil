-- Fix Product Categories and Data according to Business Rules
-- This script will:
-- 1. Get current categories
-- 2. Insert missing categories if they don't exist
-- 3. Update existing products with correct category_id and remove slugs
-- 4. Add new products for empty categories

-- First, let's see the current categories
SELECT id, name, slug FROM categories ORDER BY name;

-- Insert categories if they don't exist (assume they might not be created yet)
INSERT INTO public.categories (name, slug, is_active) VALUES
  ('Ferro & Aço', 'ferro-aco', true),
  ('EPIs', 'epis', true),
  ('Consumíveis Técnicos', 'consumiveis-tecnicos', true),
  ('Ferramentas Elétricas', 'ferramentas-eletricas', true),
  ('Ferramentas à Bateria', 'ferramentas-bateria', true),
  ('Ferramentas Manuais', 'ferramentas-manuais', true),
  ('Insumos Industriais', 'insumos-industriais', true),
  ('Solda & Acessórios', 'solda-acessorios', true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for the updates
WITH category_ids AS (
  SELECT
    id,
    name,
    CASE
      WHEN name = 'Ferramentas Elétricas' THEN 'ferramentas-eletricas'
      WHEN name = 'Insumos Industriais' THEN 'insumos-industriais'
      WHEN name = 'Ferro & Aço' THEN 'ferro-aco'
      WHEN name = 'EPIs' THEN 'epis'
      WHEN name = 'Consumíveis Técnicos' THEN 'consumiveis-tecnicos'
      WHEN name = 'Ferramentas à Bateria' THEN 'ferramentas-bateria'
      WHEN name = 'Ferramentas Manuais' THEN 'ferramentas-manuais'
      WHEN name = 'Solda & Acessórios' THEN 'solda-acessorios'
    END as slug_match
  FROM categories
)

-- Update existing products with correct category_id and remove slug according to business rules
UPDATE public.products SET
  category_id = (
    CASE
      WHEN name = 'Compressores Industriais' THEN
        (SELECT id FROM category_ids WHERE slug_match = 'ferramentas-eletricas')
      WHEN name = 'Sistemas Hidráulicos' THEN
        (SELECT id FROM category_ids WHERE slug_match = 'insumos-industriais')
      WHEN name = 'Ferramentas Pneumáticas' THEN
        (SELECT id FROM category_ids WHERE slug_match = 'ferramentas-eletricas')
      WHEN name = 'Máquinas Pesadas' THEN
        (SELECT id FROM category_ids WHERE slug_match = 'insumos-industriais')
      WHEN name = 'Transporte Especializado' THEN
        (SELECT id FROM category_ids WHERE slug_match = 'insumos-industriais')
      WHEN name = 'Equipamentos de Elevação' THEN
        (SELECT id FROM category_ids WHERE slug_match = 'insumos-industriais')
      ELSE category_id
    END
  ),
  slug = NULL,  -- Remove slug as per business rules
  price = NULL,  -- Keep price as NULL (optional as per business rules)
  sku = NULL,    -- Keep sku as NULL (optional as per business rules)
  is_active = true
WHERE name IN (
  'Compressores Industriais',
  'Sistemas Hidráulicos',
  'Ferramentas Pneumáticas',
  'Máquinas Pesadas',
  'Transporte Especializado',
  'Equipamentos de Elevação'
);

-- Add proper descriptions to existing products if they are missing or too generic
UPDATE public.products SET
  description = CASE
    WHEN name = 'Compressores Industriais' AND (description IS NULL OR description = 'Compressores de alta performance') THEN
      'Compressores industriais de alta performance para aplicações profissionais'
    WHEN name = 'Sistemas Hidráulicos' AND (description IS NULL OR description = 'Sistemas completos hidráulicos') THEN
      'Sistemas hidráulicos completos para controle de pressão e automação industrial'
    WHEN name = 'Ferramentas Pneumáticas' AND (description IS NULL OR description = 'Ferramentas de alta precisão') THEN
      'Ferramentas pneumáticas de alta precisão para trabalhos industriais'
    WHEN name = 'Máquinas Pesadas' AND (description IS NULL OR description = 'Máquinas para construção e mineração') THEN
      'Máquinas pesadas para construção civil e mineração com tecnologia avançada'
    WHEN name = 'Transporte Especializado' AND (description IS NULL OR description = 'Soluções completas de transporte') THEN
      'Soluções especializadas de transporte para cargas industriais'
    WHEN name = 'Equipamentos de Elevação' AND (description IS NULL OR description = 'Equipamentos profissionais para elevação de cargas') THEN
      'Equipamentos profissionais para elevação segura de cargas industriais'
    ELSE description
  END
WHERE name IN (
  'Compressores Industriais',
  'Sistemas Hidráulicos',
  'Ferramentas Pneumáticas',
  'Máquinas Pesadas',
  'Transporte Especializado',
  'Equipamentos de Elevação'
);

-- Insert new products for FERRO & AÇO category
INSERT INTO public.products (name, category, category_id, description, is_active, slug, price, sku) VALUES
  (
    'Barras de Aço Carbono',
    'ferro-aco',
    (SELECT id FROM categories WHERE slug = 'ferro-aco'),
    'Barras de alta resistência para construção civil e industrial',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Chapas de Aço Galvanizado',
    'ferro-aco',
    (SELECT id FROM categories WHERE slug = 'ferro-aco'),
    'Chapas resistentes à corrosão para coberturas e estruturas',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Tubos de Ferro Fundido',
    'ferro-aco',
    (SELECT id FROM categories WHERE slug = 'ferro-aco'),
    'Tubos de ferro para sistemas hidráulicos e estruturais',
    true,
    NULL,
    NULL,
    NULL
  );

-- Insert new products for EPIs category
INSERT INTO public.products (name, category, category_id, description, is_active, slug, price, sku) VALUES
  (
    'Capacetes de Segurança',
    'epis',
    (SELECT id FROM categories WHERE slug = 'epis'),
    'Capacetes certificados para proteção em obras e indústrias',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Óculos de Proteção',
    'epis',
    (SELECT id FROM categories WHERE slug = 'epis'),
    'Óculos de segurança para proteção contra respingos e impactos',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Luvas de Segurança',
    'epis',
    (SELECT id FROM categories WHERE slug = 'epis'),
    'Luvas resistentes para manuseio de materiais e soldagem',
    true,
    NULL,
    NULL,
    NULL
  );

-- Insert new products for CONSUMÍVEIS TÉCNICOS category
INSERT INTO public.products (name, category, category_id, description, is_active, slug, price, sku) VALUES
  (
    'Eletrodos de Solda',
    'consumiveis-tecnicos',
    (SELECT id FROM categories WHERE slug = 'consumiveis-tecnicos'),
    'Eletrodos de alta qualidade para soldagem de estruturas metálicas',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Discos de Corte',
    'consumiveis-tecnicos',
    (SELECT id FROM categories WHERE slug = 'consumiveis-tecnicos'),
    'Discos abrasivos para corte de metais e alvenaria',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Esponjas Abrasivas',
    'consumiveis-tecnicos',
    (SELECT id FROM categories WHERE slug = 'consumiveis-tecnicos'),
    'Esponjas para acabamento e polimento de superfícies',
    true,
    NULL,
    NULL,
    NULL
  );

-- Insert new products for FERRAMENTAS À BATERIA category
INSERT INTO public.products (name, category, category_id, description, is_active, slug, price, sku) VALUES
  (
    'Furadeira a Bateria',
    'ferramentas-bateria',
    (SELECT id FROM categories WHERE slug = 'ferramentas-bateria'),
    'Furadeira portátil com bateria de longa duração',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Parafusadeira a Bateria',
    'ferramentas-bateria',
    (SELECT id FROM categories WHERE slug = 'ferramentas-bateria'),
    'Parafusadeira de alta performance para montagem',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Serra Tico-Tico a Bateria',
    'ferramentas-bateria',
    (SELECT id FROM categories WHERE slug = 'ferramentas-bateria'),
    'Serra portátil para cortes precisos em madeira e metal',
    true,
    NULL,
    NULL,
    NULL
  );

-- Insert new products for FERRAMENTAS MANUAIS category
INSERT INTO public.products (name, category, category_id, description, is_active, slug, price, sku) VALUES
  (
    'Martelos de Carpinteiro',
    'ferramentas-manuais',
    (SELECT id FROM categories WHERE slug = 'ferramentas-manuais'),
    'Martelos de aço forjado para carpintaria e construção',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Chaves de Fenda e Philips',
    'ferramentas-manuais',
    (SELECT id FROM categories WHERE slug = 'ferramentas-manuais'),
    'Conjunto de chaves manuais para manutenção',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Alicates Universais',
    'ferramentas-manuais',
    (SELECT id FROM categories WHERE slug = 'ferramentas-manuais'),
    'Alicates de bico e universal para trabalhos elétricos',
    true,
    NULL,
    NULL,
    NULL
  );

-- Insert new products for SOLDA & ACESSÓRIOS category
INSERT INTO public.products (name, category, category_id, description, is_active, slug, price, sku) VALUES
  (
    'Máquina de Solda MIG',
    'solda-acessorios',
    (SELECT id FROM categories WHERE slug = 'solda-acessorios'),
    'Equipamento profissional para soldagem MIG/MAG',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Tochas de Solda',
    'solda-acessorios',
    (SELECT id FROM categories WHERE slug = 'solda-acessorios'),
    'Tochas de alta qualidade para soldagem a gás',
    true,
    NULL,
    NULL,
    NULL
  ),
  (
    'Máscaras de Soldador',
    'solda-acessorios',
    (SELECT id FROM categories WHERE slug = 'solda-acessorios'),
    'Máscaras automáticas com proteção UV para soldagem',
    true,
    NULL,
    NULL,
    NULL
  );

-- Final verification query - show all categories with their products
SELECT
  c.id as category_id,
  c.name as category_name,
  c.slug as category_slug,
  p.id as product_id,
  p.name as product_name,
  p.description,
  p.category_id as product_category_id,
  p.slug as product_slug,
  p.price,
  p.sku,
  p.is_active
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
WHERE c.is_active = true
ORDER BY c.name, p.name;

-- Show count of products per category
SELECT
  c.name as category_name,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY c.name;