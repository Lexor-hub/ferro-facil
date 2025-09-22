#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE3NzQsImV4cCI6MjA3MTYzNzc3NH0.7WVWg7Yf2fDzWqDYWrdO3Bg6adsBfBv_XbfMNtEWHNo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function executeDatabaseFixes() {
  console.log('🔄 Starting database fixes execution...\n');

  try {
    // Step 1: Get category IDs
    console.log('📋 Step 1: Getting current category IDs...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name');

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError);
      return;
    }

    console.log('✅ Current categories:');
    categories.forEach(cat => {
      console.log(`   ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`);
    });
    console.log('');

    // Create a mapping of category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Step 2: Update existing products to correct categories and remove slugs
    console.log('📝 Step 2: Updating existing products with correct categories...');

    const productsToUpdate = [
      { name: 'Compressores Industriais', newCategory: 'Ferramentas Elétricas' },
      { name: 'Ferramentas Pneumáticas', newCategory: 'Ferramentas Elétricas' },
      { name: 'Sistemas Hidráulicos', newCategory: 'Insumos Industriais' },
      { name: 'Máquinas Pesadas', newCategory: 'Insumos Industriais' },
      { name: 'Transporte Especializado', newCategory: 'Insumos Industriais' },
      { name: 'Equipamentos de Elevação', newCategory: 'Insumos Industriais' }
    ];

    for (const product of productsToUpdate) {
      const newCategoryId = categoryMap[product.newCategory];
      if (!newCategoryId) {
        console.log(`⚠️  Category '${product.newCategory}' not found for product '${product.name}'`);
        continue;
      }

      const { data, error } = await supabase
        .from('products')
        .update({
          category_id: newCategoryId,
          slug: null,
          is_active: true
        })
        .eq('name', product.name)
        .select();

      if (error) {
        console.error(`❌ Error updating product '${product.name}':`, error);
      } else {
        console.log(`✅ Updated '${product.name}' to category '${product.newCategory}' (ID: ${newCategoryId})`);
      }
    }
    console.log('');

    // Step 3: Insert new products for categories that need them
    console.log('➕ Step 3: Inserting new products for empty categories...');

    const newProducts = [
      // Ferro & Aço
      {
        name: 'Barras de Aço Carbono',
        category: 'ferro-aco',
        category_id: categoryMap['Ferro & Aço'],
        description: 'Barras de alta resistência para construção civil e industrial',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Chapas de Aço Galvanizado',
        category: 'ferro-aco',
        category_id: categoryMap['Ferro & Aço'],
        description: 'Chapas resistentes à corrosão para coberturas e estruturas',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Tubos de Ferro Fundido',
        category: 'ferro-aco',
        category_id: categoryMap['Ferro & Aço'],
        description: 'Tubos de ferro para sistemas hidráulicos e estruturais',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      // EPIs
      {
        name: 'Capacetes de Segurança',
        category: 'epis',
        category_id: categoryMap['EPIs'],
        description: 'Capacetes certificados para proteção em obras e indústrias',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Óculos de Proteção',
        category: 'epis',
        category_id: categoryMap['EPIs'],
        description: 'Óculos de segurança para proteção contra respingos e impactos',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Luvas de Segurança',
        category: 'epis',
        category_id: categoryMap['EPIs'],
        description: 'Luvas resistentes para manuseio de materiais e soldagem',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      // Consumíveis Técnicos
      {
        name: 'Eletrodos de Solda',
        category: 'consumiveis-tecnicos',
        category_id: categoryMap['Consumíveis Técnicos'],
        description: 'Eletrodos de alta qualidade para soldagem de estruturas metálicas',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Discos de Corte',
        category: 'consumiveis-tecnicos',
        category_id: categoryMap['Consumíveis Técnicos'],
        description: 'Discos abrasivos para corte de metais e alvenaria',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Esponjas Abrasivas',
        category: 'consumiveis-tecnicos',
        category_id: categoryMap['Consumíveis Técnicos'],
        description: 'Esponjas para acabamento e polimento de superfícies',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      // Ferramentas à Bateria
      {
        name: 'Furadeira a Bateria',
        category: 'ferramentas-bateria',
        category_id: categoryMap['Ferramentas à Bateria'],
        description: 'Furadeira portátil com bateria de longa duração',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Parafusadeira a Bateria',
        category: 'ferramentas-bateria',
        category_id: categoryMap['Ferramentas à Bateria'],
        description: 'Parafusadeira de alta performance para montagem',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Serra Tico-Tico a Bateria',
        category: 'ferramentas-bateria',
        category_id: categoryMap['Ferramentas à Bateria'],
        description: 'Serra portátil para cortes precisos em madeira e metal',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      // Ferramentas Manuais
      {
        name: 'Martelos de Carpinteiro',
        category: 'ferramentas-manuais',
        category_id: categoryMap['Ferramentas Manuais'],
        description: 'Martelos de aço forjado para carpintaria e construção',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Chaves de Fenda e Philips',
        category: 'ferramentas-manuais',
        category_id: categoryMap['Ferramentas Manuais'],
        description: 'Conjunto de chaves manuais para manutenção',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Alicates Universais',
        category: 'ferramentas-manuais',
        category_id: categoryMap['Ferramentas Manuais'],
        description: 'Alicates de bico e universal para trabalhos elétricos',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      // Solda & Acessórios
      {
        name: 'Máquina de Solda MIG',
        category: 'solda-acessorios',
        category_id: categoryMap['Solda & Acessórios'],
        description: 'Equipamento profissional para soldagem MIG/MAG',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Tochas de Solda',
        category: 'solda-acessorios',
        category_id: categoryMap['Solda & Acessórios'],
        description: 'Tochas de alta qualidade para soldagem a gás',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      },
      {
        name: 'Máscaras de Soldador',
        category: 'solda-acessorios',
        category_id: categoryMap['Solda & Acessórios'],
        description: 'Máscaras automáticas com proteção UV para soldagem',
        is_active: true,
        slug: null,
        price: null,
        sku: null
      }
    ];

    // Insert products one by one to handle conflicts
    for (const product of newProducts) {
      if (!product.category_id) {
        console.log(`⚠️  Category ID not found for product '${product.name}' in category '${product.category}'`);
        continue;
      }

      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('name', product.name)
        .single();

      if (existingProduct) {
        console.log(`⏭️  Product '${product.name}' already exists, skipping...`);
        continue;
      }

      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select();

      if (error) {
        console.error(`❌ Error inserting product '${product.name}':`, error);
      } else {
        console.log(`✅ Inserted product '${product.name}' in category '${product.category}'`);
      }
    }
    console.log('');

    // Step 4: Verify results
    console.log('🔍 Step 4: Verifying results...');

    const { data: finalResults, error: finalError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        products:products(
          id,
          name,
          description,
          category_id,
          slug,
          price,
          sku,
          is_active
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (finalError) {
      console.error('❌ Error fetching final results:', finalError);
      return;
    }

    console.log('📊 Final Results - Categories with Products:');
    console.log('=========================================');

    finalResults.forEach(category => {
      console.log(`\n🏷️  Category: ${category.name} (ID: ${category.id})`);
      console.log(`   Slug: ${category.slug}`);
      console.log(`   Products: ${category.products?.length || 0}`);

      if (category.products && category.products.length > 0) {
        category.products.forEach(product => {
          console.log(`     • ${product.name} (ID: ${product.id})`);
          console.log(`       Description: ${product.description}`);
          console.log(`       Category ID: ${product.category_id}`);
          console.log(`       Slug: ${product.slug || 'NULL'}`);
          console.log(`       Active: ${product.is_active}`);
          console.log('');
        });
      } else {
        console.log('     No products found');
      }
    });

    // Product count per category
    console.log('\n📈 Product Count per Category:');
    console.log('==============================');
    finalResults.forEach(category => {
      const activeProducts = category.products?.filter(p => p.is_active) || [];
      console.log(`${category.name}: ${activeProducts.length} active products`);
    });

    console.log('\n🎉 Database fixes completed successfully!');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the script
executeDatabaseFixes();