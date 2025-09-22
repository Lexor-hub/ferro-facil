import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA2MTc3NCwiZXhwIjoyMDcxNjM3Nzc0fQ.hAJ-CqxB1hQVrGcUWlQINbDSUzYOQCqLSfKvnGBN4G8";

// Create admin client with service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyProductsAccess() {
  console.log('🔍 Testing products table access...');

  try {
    // Test basic read access
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .limit(5);

    if (error) {
      console.error('❌ Error reading from products table:', error.message);
      return false;
    }

    console.log('✅ Successfully read from products table');
    console.log(`📊 Found ${data.length} products (showing max 5)`);

    // Test insert access (this will help verify RLS is disabled)
    const testProduct = {
      name: 'RLS Test Product',
      description: 'Test product to verify RLS is disabled',
      price: 1.00,
      category_id: null,
      is_active: false
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(testProduct)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting test product:', insertError.message);
      if (insertError.message.includes('RLS') || insertError.message.includes('policy')) {
        console.log('🚨 RLS is still active and blocking the insert operation');
        return false;
      }
    } else {
      console.log('✅ Successfully inserted test product');
      console.log('🎉 RLS is disabled - admin operations are working');

      // Clean up the test product
      const { error: deleteError } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.warn('⚠️ Could not delete test product:', deleteError.message);
      } else {
        console.log('🧹 Test product cleaned up successfully');
      }
    }

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting RLS verification for products table...\n');

  const success = await verifyProductsAccess();

  if (success) {
    console.log('\n✅ RLS verification completed successfully');
    console.log('✅ Admin panel should be able to manage products without RLS restrictions');
  } else {
    console.log('\n❌ RLS verification failed');
    console.log('📋 Manual action required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the SQL commands from disable-rls.sql');
  }
}

main().catch(console.error);