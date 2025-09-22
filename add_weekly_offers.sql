-- Add Sample Weekly Offers Data
-- Run this script in your Supabase SQL Editor
-- Note: This script requires admin privileges or RLS temporarily disabled for weekly_specials table

-- Step 1: Check existing active products
SELECT
    id,
    name,
    sku,
    category,
    is_active
FROM public.products
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Clear existing weekly specials (optional - remove if you want to keep existing data)
DELETE FROM public.weekly_specials;

-- Step 3: Insert sample weekly specials using the first 6 active products
-- This uses a subquery to get the product IDs dynamically
WITH sample_products AS (
    SELECT
        id,
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

-- Step 4: Verify the data was inserted correctly
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

-- Step 5: Test the query that the WeeklyOffers component uses
SELECT
    ws.id,
    ws.sort_order,
    jsonb_build_object(
        'id', p.id,
        'name', p.name,
        'sku', p.sku,
        'description', p.description,
        'category', p.category,
        'price', p.price,
        'is_active', p.is_active,
        'product_images', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'url', pi.url,
                    'alt_text', pi.alt_text,
                    'sort_order', pi.sort_order
                ) ORDER BY pi.sort_order
            )
            FROM public.product_images pi
            WHERE pi.product_id = p.id
        )
    ) as products
FROM public.weekly_specials ws
INNER JOIN public.products p ON ws.product_id = p.id
WHERE ws.is_active = true
AND p.is_active = true
ORDER BY ws.sort_order
LIMIT 8;

-- Expected result: 6 rows with weekly special products and their details
-- The WeeklyOffers component should now display these products in the carousel