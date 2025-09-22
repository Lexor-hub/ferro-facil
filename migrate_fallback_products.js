import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE3NzQsImV4cCI6MjA3MTYzNzc3NH0.7WVWg7Yf2fDzWqDYWrdO3Bg6adsBfBv_XbfMNtEWHNo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Produtos fallback da home page
const fallbackProducts = [
  {
    name: "Furadeira de Impacto Profissional",
    sku: "FIP-850W",
    description: "850W de potência • Mandril 13mm • Velocidade variável",
    category: "Ferramentas Elétricas",
    price: 299.90,
    is_active: true
  },
  {
    name: "Capacete de Segurança com Jugular",
    sku: "CS-CA-001",
    description: "Certificação INMETRO • Material ABS • Cores variadas",
    category: "EPIs",
    price: 45.90,
    is_active: true
  },
  {
    name: "Barra Chata Aço 1020",
    sku: "BC-1020-50X6",
    description: "50mm x 6mm • Aço 1020 • Comprimento 6m",
    category: "Ferro & Aço",
    price: 125.50,
    is_active: true
  },
  {
    name: "Parafusadeira à Bateria 12V",
    sku: "PB-12V-LI",
    description: "Bateria 12V Li-ion • LED de trabalho • Carregador incluído",
    category: "Ferramentas à Bateria",
    price: 189.90,
    is_active: true
  }
];

async function migrateProducts() {
  try {
    console.log('🚀 Iniciando migração dos produtos fallback...');

    // 1. Buscar categorias existentes
    console.log('📋 Buscando categorias...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');

    if (catError) {
      console.error('❌ Erro ao buscar categorias:', catError);
      return;
    }

    console.log(`✅ Encontradas ${categories.length} categorias`);

    // 2. Inserir produtos no banco
    const insertedProducts = [];

    for (const product of fallbackProducts) {
      // Buscar category_id
      const category = categories.find(cat =>
        cat.name.toLowerCase().includes(product.category.toLowerCase().split(' ')[0])
      );

      if (!category) {
        console.log(`⚠️  Categoria não encontrada para: ${product.category}`);
        continue;
      }

      // Verificar se produto já existe
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('sku', product.sku)
        .single();

      if (existing) {
        console.log(`⚠️  Produto já existe: ${product.name}`);
        insertedProducts.push(existing);
        continue;
      }

      // Inserir produto
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: product.name,
          sku: product.sku,
          description: product.description,
          category: product.category,
          category_id: category.id,
          price: product.price,
          is_active: product.is_active
        })
        .select('id')
        .single();

      if (productError) {
        console.error(`❌ Erro ao inserir produto ${product.name}:`, productError);
        continue;
      }

      insertedProducts.push(newProduct);
      console.log(`✅ Produto inserido: ${product.name}`);
    }

    console.log(`\n📦 ${insertedProducts.length} produtos processados`);

    // 3. Criar weekly_specials para estes produtos
    console.log('\n🎯 Criando ofertas semanais...');

    // Limpar ofertas existentes
    const { error: clearError } = await supabase
      .from('weekly_specials')
      .delete()
      .neq('id', 'never-match');

    if (clearError) {
      console.log('⚠️  Aviso ao limpar ofertas:', clearError.message);
    }

    // Criar novas ofertas
    const weeklySpecials = insertedProducts.map((product, index) => ({
      product_id: product.id,
      sort_order: index + 1,
      is_active: true,
      week_of: new Date().toISOString().split('T')[0]
    }));

    const { data: newSpecials, error: specialsError } = await supabase
      .from('weekly_specials')
      .insert(weeklySpecials)
      .select();

    if (specialsError) {
      console.error('❌ Erro ao criar ofertas semanais:', specialsError);
      return;
    }

    console.log(`✅ ${newSpecials.length} ofertas semanais criadas`);

    // 4. Verificar resultado final
    console.log('\n🔍 Verificando resultado...');
    const { data: finalResult } = await supabase
      .from('weekly_specials')
      .select(`
        id, sort_order, is_active,
        products (name, sku, description, category, price)
      `)
      .eq('is_active', true)
      .order('sort_order');

    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA!');
    console.log('\n📋 Ofertas semanais ativas:');
    finalResult?.forEach((special, index) => {
      console.log(`${index + 1}. ${special.products.name} (${special.products.sku})`);
      console.log(`   ${special.products.description}`);
      console.log(`   Categoria: ${special.products.category} | Preço: R$ ${special.products.price}`);
      console.log('');
    });

    console.log('✅ Os produtos agora aparecem tanto na home quanto no painel admin!');
    console.log('🔗 Acesse o admin em: http://localhost:5175/ofertas');

  } catch (error) {
    console.error('💥 Erro geral na migração:', error);
  }
}

// Executar migração
migrateProducts();