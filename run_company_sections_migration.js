import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://qqmtkbgtjbkcmcladybh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbXRrYmd0amJrY21jbGFkeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE3NzQsImV4cCI6MjA3MTYzNzc3NH0.7WVWg7Yf2fDzWqDYWrdO3Bg6adsBfBv_XbfMNtEWHNo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration() {
  try {
    console.log('🚀 Starting company_sections table migration...');

    // Read the migration SQL file
    const migrationPath = './supabase/migrations/20250919000000_create_company_sections.sql';
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration SQL loaded successfully');
    console.log('⚠️  Note: This script will attempt to run the migration through the Supabase API.');
    console.log('⚠️  For full DDL operations, you may need to use the Supabase Dashboard or CLI.');

    // Split SQL into individual statements for better error handling
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute`);

    // Try to execute via raw SQL (this might not work for all DDL operations)
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\n📝 Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 100) + '...');

      try {
        const { data, error } = await supabase.rpc('execute_sql', { sql: statement });

        if (error) {
          console.log(`❌ Error executing statement ${i + 1}:`, error.message);
          // Continue with next statement
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (e) {
        console.log(`❌ Exception executing statement ${i + 1}:`, e.message);
      }
    }

    // Verify table creation by checking if we can query it
    console.log('\n🔍 Verifying table creation...');
    const { data: sections, error: queryError } = await supabase
      .from('company_sections')
      .select('*')
      .order('sort_order');

    if (queryError) {
      console.log('❌ Table verification failed:', queryError.message);
      console.log('\n📝 Manual execution required:');
      console.log('Please execute the following SQL in your Supabase Dashboard:');
      console.log('\n' + '='.repeat(50));
      console.log(sqlContent);
      console.log('='.repeat(50));
    } else {
      console.log(`✅ Table verification successful! Found ${sections.length} records`);

      console.log('\n📋 Company sections created:');
      sections.forEach((section, index) => {
        console.log(`${index + 1}. ${section.title} (${section.section_key})`);
        console.log(`   Order: ${section.sort_order}, Active: ${section.is_active}`);
        console.log(`   ${section.description}`);
        console.log('');
      });

      console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ The company_sections table is ready for use!');
    }

  } catch (error) {
    console.error('💥 Migration failed with error:', error);
    console.log('\n📝 Please execute the migration manually:');

    try {
      const migrationPath = './supabase/migrations/20250919000000_create_company_sections.sql';
      const sqlContent = fs.readFileSync(migrationPath, 'utf8');
      console.log('\n' + '='.repeat(50));
      console.log(sqlContent);
      console.log('='.repeat(50));
    } catch (readError) {
      console.log('Could not read migration file:', readError.message);
    }
  }
}

// Run the migration
runMigration();