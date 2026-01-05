-- ================================================
-- DreamSnap - Row Level Security (RLS) Policies
-- ================================================
-- Run these commands in your Supabase SQL Editor to enable
-- authenticated users to save leads and gallery photos
--
-- Instructions:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- ================================================

-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert leads
CREATE POLICY "Allow authenticated users to insert leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to read all leads
CREATE POLICY "Allow authenticated users to read leads"
ON leads
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads"
ON leads
FOR UPDATE
TO authenticated
USING (true);

-- ================================================

-- Enable RLS on gallery_photos table
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert gallery photos
CREATE POLICY "Allow authenticated users to insert gallery photos"
ON gallery_photos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to read all gallery photos
CREATE POLICY "Allow authenticated users to read gallery photos"
ON gallery_photos
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow public read access to gallery photos (if needed for public gallery)
-- Uncomment the following if you want unauthenticated users to view the gallery
-- CREATE POLICY "Allow public read access to gallery photos"
-- ON gallery_photos
-- FOR SELECT
-- TO anon
-- USING (true);

-- ================================================

-- Storage policies for gallery-photos bucket
-- Note: Storage policies are managed differently in Supabase
-- You may need to configure these in the Storage section of your dashboard

-- To allow authenticated users to upload to storage:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Select the 'gallery-photos' bucket
-- 3. Go to Policies tab
-- 4. Add a policy with:
--    - Policy Name: "Authenticated users can upload"
--    - Allowed operation: INSERT
--    - Target roles: authenticated
--    - Policy definition: true

-- To allow public access to view images:
-- 1. Make the bucket public in Storage settings
-- OR
-- 2. Add a SELECT policy for anon role

-- ================================================
-- Verification Queries
-- ================================================
-- Run these to verify the policies were created successfully:

-- Check leads policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'leads';

-- Check gallery_photos policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'gallery_photos';

-- ================================================
-- IMPORTANT NOTES
-- ================================================
-- 1. These policies allow ALL authenticated users to perform operations
-- 2. If you need more granular control (e.g., users can only access their own data),
--    you'll need to modify the policies with additional conditions
-- 3. The anon key can still be used for operations, but only authenticated users
--    will have full access to insert/update data
-- 4. Make sure your application is properly authenticating users before
--    performing database operations
-- ================================================
