#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA2MTc3NCwiZXhwIjoyMDcxNjM3Nzc0fQ.hAJ-CqxB1hQVrGcUWlQINbDSUzYOQCqLSfKvnGBN4G8";

// Use service role key to bypass RLS for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🔍 Fetching existing products...');

  try {
    // First, let's check what products exist in the database
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, sku, category')
      .eq('is_active', true)
      .limit(20);

    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No active products found in database. Please add some products first.');
      return;
    }

    console.log(`✅ Found ${products.length} active products:`);
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (${product.sku || 'No SKU'}) - ${product.category}`);
    });

    // Clear existing weekly specials first
    console.log('\n🧹 Clearing existing weekly specials...');
    const { error: deleteError } = await supabase
      .from('weekly_specials')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (deleteError) {
      console.error('❌ Error clearing existing weekly specials:', deleteError);
      return;
    }
    console.log('✅ Cleared existing weekly specials');

    // Select 6 products for weekly specials (or all if less than 6)
    const selectedProducts = products.slice(0, Math.min(6, products.length));

    console.log('\n📦 Creating weekly specials for selected products...');

    // Create weekly specials entries
    const weeklySpecialsData = selectedProducts.map((product, index) => ({
      product_id: product.id,
      sort_order: index + 1,
      is_active: true,
      week_of: new Date().toISOString().split('T')[0] // Current date as week_of
    }));

    const { data: insertedSpecials, error: insertError } = await supabase
      .from('weekly_specials')
      .insert(weeklySpecialsData)
      .select('*');

    if (insertError) {
      console.error('❌ Error inserting weekly specials:', insertError);
      return;
    }

    console.log(`✅ Successfully created ${insertedSpecials.length} weekly specials:`);

    // Fetch the complete data with product details for verification
    const { data: verification, error: verifyError } = await supabase
      .from('weekly_specials')
      .select(`
        id,
        sort_order,
        is_active,
        week_of,
        products!inner(
          id,
          name,
          sku,
          category
        )
      `)
      .eq('is_active', true)
      .order('sort_order');

    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
      return;
    }

    console.log('\n🎯 Verification - Weekly Specials with Product Details:');
    verification.forEach((special, index) => {
      console.log(`  ${index + 1}. [Order: ${special.sort_order}] ${special.products.name} (${special.products.sku || 'No SKU'})`);
      console.log(`     Category: ${special.products.category}`);
      console.log(`     Week of: ${special.week_of}`);
      console.log(`     Active: ${special.is_active}`);
      console.log('');
    });

    console.log('🎉 Weekly offers data successfully added to the database!');
    console.log('💡 You can now test the WeeklyOffers component on your homepage.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

main();