-- Disable Row Level Security for products table
-- Run these commands in your Supabase SQL Editor

-- Step 1: Check current RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'products' AND schemaname = 'public';

-- Alternative query to check RLS status
SELECT
    c.relname as table_name,
    c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'products' AND n.nspname = 'public';

-- Step 2: Disable RLS for products table
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Step 3: Verify RLS has been disabled
SELECT
    c.relname as table_name,
    c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'products' AND n.nspname = 'public';

-- Step 4: Test that the table is accessible (should work without restrictions now)
SELECT COUNT(*) as total_products FROM public.products;

-- Optional: If you want to see existing RLS policies that were on the table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products' AND schemaname = 'public';

-- Note: The policies will still exist but will be ignored since RLS is disabled
-- If you want to remove the policies entirely (optional), you can drop them:
-- DROP POLICY IF EXISTS "policy_name" ON public.products;