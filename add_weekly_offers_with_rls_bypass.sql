-- Add Weekly Offers Data with Temporary RLS Bypass
-- WARNING: This temporarily disables RLS for weekly_specials table
-- Run this script in your Supabase SQL Editor as a superuser/service_role

-- Step 1: Check current RLS status
SELECT
    c.relname as table_name,
    c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'weekly_specials' AND n.nspname = 'public';

-- Step 2: Temporarily disable RLS for weekly_specials table
ALTER TABLE public.weekly_specials DISABLE ROW LEVEL SECURITY;

-- Step 3: Clear existing weekly specials (optional)
DELETE FROM public.weekly_specials;

-- Step 4: Insert sample weekly specials data
WITH sample_products AS (
    SELECT
        id,
        name,
        sku,
        category,
        ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
    FROM public.products
    WHERE is_active = true
    LIMIT 6
)
INSERT INTO public.weekly_specials (product_id, sort_order, is_active, week_of)
SELECT
    id as product_id,
    rn as sort_order,
    true as is_active,
    CURRENT_DATE as week_of
FROM sample_products
ORDER BY rn;

-- Step 5: Verify the data was inserted
SELECT
    ws.id,
    ws.sort_order,
    ws.is_active,
    ws.week_of,
    p.name as product_name,
    p.sku as product_sku,
    p.category as product_category
FROM public.weekly_specials ws
JOIN public.products p ON ws.product_id = p.id
WHERE ws.is_active = true
ORDER BY ws.sort_order;

-- Step 6: Re-enable RLS for weekly_specials table
ALTER TABLE public.weekly_specials ENABLE ROW LEVEL SECURITY;

-- Step 7: Verify RLS is re-enabled
SELECT
    c.relname as table_name,
    c.relrowsecurity as rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'weekly_specials' AND n.nspname = 'public';

-- Step 8: Test the public read access (this should work since there's a read policy)
SELECT
    ws.id,
    ws.sort_order,
    p.name as product_name
FROM public.weekly_specials ws
JOIN public.products p ON ws.product_id = p.id
WHERE ws.is_active = true
AND p.is_active = true
ORDER BY ws.sort_order;

-- Success! The weekly_specials table now has sample data and RLS is re-enabled
-- The WeeklyOffers component should now display the sample products