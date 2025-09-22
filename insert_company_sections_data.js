import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE3NzQsImV4cCI6MjA3MTYzNzc3NH0.7WVWg7Yf2fDzWqDYWrdO3Bg6adsBfBv_XbfMNtEWHNo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initial data for company sections
const initialSections = [
  {
    section_key: 'estrutura_1',
    title: 'Estrutura de Ponta',
    description: 'Instalações modernas com showroom, área técnica e centro de distribuição integrados para atendimento completo.',
    image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Fachada+Moderna',
    alt_text: 'Fachada moderna da loja Grupo Soares',
    sort_order: 1,
    is_active: true
  },
  {
    section_key: 'estrutura_2',
    title: 'Estacionamento Próprio e Gratuito',
    description: 'Amplo estacionamento para clientes com acesso facilitado para carga e descarga, sem custo adicional.',
    image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Estacionamento',
    alt_text: 'Estacionamento amplo e gratuito do Grupo Soares',
    sort_order: 2,
    is_active: true
  },
  {
    section_key: 'estrutura_3',
    title: 'Atendimento Especializado',
    description: 'Equipe técnica com conhecimento profundo em aplicações industriais e materiais de construção.',
    image_url: 'https://placehold.co/600x400/174A8B/FFFFFF/png?text=Atendimento',
    alt_text: 'Equipe de atendimento especializado do Grupo Soares',
    sort_order: 3,
    is_active: true
  },
  {
    section_key: 'visite_loja',
    title: 'Visite Nossa Loja',
    description: 'Conheça pessoalmente nossa estrutura moderna, com estacionamento próprio e gratuito.',
    image_url: 'https://placehold.co/800x600/174A8B/FFFFFF/png?text=Fachada+Grupo+Soares',
    alt_text: 'Fachada da loja Grupo Soares com estacionamento',
    sort_order: 4,
    is_active: true
  }
];

async function insertCompanySectionsData() {
  try {
    console.log('🚀 Checking if company_sections table exists...');

    // First, check if the table exists by trying to query it
    const { data: testQuery, error: testError } = await supabase
      .from('company_sections')
      .select('id')
      .limit(1);

    if (testError) {
      console.log('❌ Table does not exist or is not accessible:', testError.message);
      console.log('\n📝 Please create the table first by executing this SQL in Supabase Dashboard:');
      console.log('\n' + '='.repeat(50));
      console.log(`
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
`);
      console.log('='.repeat(50));
      console.log('\nThen run this script again to insert the data.');
      return;
    }

    console.log('✅ Table exists! Proceeding with data insertion...');

    // Check if data already exists
    const { data: existingData, error: existingError } = await supabase
      .from('company_sections')
      .select('section_key');

    if (existingError) {
      console.log('❌ Error checking existing data:', existingError.message);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log(`⚠️  Found ${existingData.length} existing records. Clearing table first...`);

      const { error: deleteError } = await supabase
        .from('company_sections')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (deleteError) {
        console.log('❌ Error clearing existing data:', deleteError.message);
        console.log('⚠️  Attempting to insert anyway...');
      } else {
        console.log('✅ Existing data cleared successfully');
      }
    }

    // Insert the initial data
    console.log('📋 Inserting initial company sections data...');

    const { data, error: insertError } = await supabase
      .from('company_sections')
      .insert(initialSections)
      .select();

    if (insertError) {
      console.error('❌ Error inserting data:', insertError);
      return;
    }

    console.log(`✅ ${data.length} company sections inserted successfully!`);

    // Verify the final result
    console.log('\n🔍 Verifying inserted data...');
    const { data: finalResult, error: verifyError } = await supabase
      .from('company_sections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (verifyError) {
      console.log('❌ Error verifying data:', verifyError.message);
      return;
    }

    console.log('\n📋 Company sections created:');
    finalResult.forEach((section, index) => {
      console.log(`${index + 1}. ${section.title} (${section.section_key})`);
      console.log(`   Order: ${section.sort_order}, Active: ${section.is_active}`);
      console.log(`   ${section.description}`);
      console.log(`   Image: ${section.image_url}`);
      console.log(`   Alt Text: ${section.alt_text}`);
      console.log(`   Created: ${section.created_at}`);
      console.log('');
    });

    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('✅ The company_sections table is ready for use in your application!');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Execute the data insertion
insertCompanySectionsData();