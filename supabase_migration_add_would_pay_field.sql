-- Migration: Add would_pay_for_product field to leads table
-- Description: Adds a boolean field to track if users would be interested in paying for this as a software product
-- Date: 2026-01-05

-- Add the new column to the leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS would_pay_for_product BOOLEAN DEFAULT FALSE;

-- Add a comment to the column for documentation
COMMENT ON COLUMN leads.would_pay_for_product IS 'Indicates if the user would be interested in paying for this as a software product for their own events';

-- Create a partial index for faster queries on users who would pay
-- This is useful for filtering and analyzing potential customers
CREATE INDEX IF NOT EXISTS idx_leads_would_pay
ON leads(would_pay_for_product)
WHERE would_pay_for_product = TRUE;

-- Verify the column was added
-- Run this to check: SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'leads';

-- Query to find all users interested in paying for the product
-- SELECT
--   full_name,
--   phone_number,
--   country_code,
--   instagram_handle_1,
--   theme_selected,
--   created_at
-- FROM leads
-- WHERE would_pay_for_product = TRUE
-- ORDER BY created_at DESC;

-- Analytics query: Count of interested users by theme
-- SELECT
--   theme_selected,
--   COUNT(*) as interested_users,
--   COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads WHERE theme_selected = l.theme_selected) as percentage
-- FROM leads l
-- WHERE would_pay_for_product = TRUE
-- GROUP BY theme_selected
-- ORDER BY interested_users DESC;
