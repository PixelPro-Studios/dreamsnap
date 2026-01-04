-- DreamSnap Gallery Photos Table Setup
-- Run this SQL in your Supabase SQL Editor to create the gallery_photos table

-- Create the gallery_photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,
    caption TEXT,
    full_name TEXT NOT NULL,
    theme_selected TEXT NOT NULL,
    event_id TEXT NOT NULL DEFAULT 'default_event'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_event_id ON gallery_photos(event_id);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read gallery photos
CREATE POLICY "Allow public read access to gallery photos"
ON gallery_photos
FOR SELECT
TO anon, authenticated
USING (true);

-- Create policy to allow anyone to insert gallery photos
CREATE POLICY "Allow public insert access to gallery photos"
ON gallery_photos
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Verify table was created
SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'gallery_photos'
ORDER BY ordinal_position;
