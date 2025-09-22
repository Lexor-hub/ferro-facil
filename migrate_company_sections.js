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

async function createCompanySectionsTable() {
  try {
    console.log('🚀 Iniciando criação da tabela company_sections...');

    // Check if table exists first
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'company_sections');

    if (tables && tables.length > 0) {
      console.log('⚠️  Tabela company_sections já existe. Prosseguindo com inserção...');
    } else {
      console.log('❌ Tabela company_sections não existe. Criando via SQL direto...');
      console.log('📝 Para criar a tabela, execute este SQL no Supabase Dashboard:');
      console.log(`
CREATE TABLE IF NOT EXISTS company_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_sections_active_order
ON company_sections(is_active, sort_order);
      `);
    }

    // Insert initial data
    console.log('📋 Inserindo dados iniciais...');

    const { data, error: insertError } = await supabase
      .from('company_sections')
      .insert(initialSections)
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir dados:', insertError);
      return;
    }

    console.log(`✅ ${data.length} seções inseridas com sucesso!`);

    // Verify the result
    console.log('\n🔍 Verificando resultado...');
    const { data: finalResult } = await supabase
      .from('company_sections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    console.log('\n📋 Seções da empresa criadas:');
    finalResult?.forEach((section, index) => {
      console.log(`${index + 1}. ${section.title} (${section.section_key})`);
      console.log(`   ${section.description}`);
      console.log('');
    });

    console.log('🎉 MIGRAÇÃO CONCLUÍDA!');
    console.log('✅ A tabela company_sections está pronta para uso no painel admin!');

  } catch (error) {
    console.error('💥 Erro geral na migração:', error);
  }
}

// Execute migration
createCompanySectionsTable();