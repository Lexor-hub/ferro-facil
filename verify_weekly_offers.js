#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE3NzQsImV4cCI6MjA3MTYzNzc3NH0.7WVWg7Yf2fDzWqDYWrdO3Bg6adsBfBv_XbfMNtEWHNo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🔍 Checking current weekly specials data...');

  try {
    // Test the exact query that the WeeklyOffers component uses
    const { data, error } = await supabase
      .from('weekly_specials')
      .select(`
        id,
        sort_order,
        products!inner(
          id,
          name,
          sku,
          description,
          category,
          price,
          is_active,
          product_images(url, alt_text, sort_order)
        )
      `)
      .eq('is_active', true)
      .eq('products.is_active', true)
      .order('sort_order')
      .limit(8);

    if (error) {
      console.error('❌ Error fetching weekly specials:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No weekly specials found. You need to add sample data.');
      console.log('\n📋 To add sample data, you can:');
      console.log('1. Run the SQL script in Supabase SQL Editor: add_weekly_offers.sql');
      console.log('2. Or use the RLS bypass script: add_weekly_offers_with_rls_bypass.sql');
      return;
    }

    console.log(`✅ Found ${data.length} weekly specials:`);
    console.log('\n📦 Weekly Specials Data:');

    data.forEach((special, index) => {
      const product = special.products;
      console.log(`\n${index + 1}. [Sort Order: ${special.sort_order}]`);
      console.log(`   Name: ${product.name}`);
      console.log(`   SKU: ${product.sku || 'No SKU'}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Description: ${product.description || 'No description'}`);
      console.log(`   Price: ${product.price ? `$${product.price}` : 'No price'}`);
      console.log(`   Images: ${product.product_images?.length || 0} image(s)`);
      if (product.product_images?.length > 0) {
        console.log(`   Primary Image: ${product.product_images[0].url}`);
      }
    });

    console.log('\n🎉 Weekly offers data is properly configured!');
    console.log('💡 The WeeklyOffers component should now display these products.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

main();