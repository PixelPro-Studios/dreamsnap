# QUICK FIX - Storage Upload Error

## The Problem
Error: `new row violates row-level security policy`

This means your `gallery-photos` bucket has Row Level Security (RLS) enabled but no policies allowing uploads.

## Solution: Add Storage Policies

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on the `gallery-photos` bucket

### Step 2: Configure Policies
Click on **Policies** tab (or go to Storage → Policies in the sidebar)

### Step 3: Create Upload Policy

Click **New Policy** and add this policy:

**Policy Details:**
- **Policy Name**: `Allow public uploads`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  true
  ```
- **Target roles**: Leave as default (public/anon)

### Step 4: Create Read Policy (if not exists)

Create another policy:

**Policy Details:**
- **Policy Name**: `Allow public reads`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  true
  ```

## Alternative: Use SQL Editor

Go to **SQL Editor** in Supabase and run this:

```sql
-- Enable RLS on the storage.objects table for the bucket
-- (This is usually already enabled)

-- Allow anyone to upload to gallery-photos bucket
CREATE POLICY "Allow public uploads to gallery-photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery-photos');

-- Allow anyone to read from gallery-photos bucket
CREATE POLICY "Allow public reads from gallery-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-photos');

-- Optional: Allow deletes (for cleanup)
CREATE POLICY "Allow public deletes from gallery-photos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'gallery-photos');
```

## Verify the Fix

After adding the policies:

1. **Reload your app** and try uploading a photo
2. **Check the browser console** - you should now see:
   - ✅ Blob created
   - ✅ Upload successful
   - 🔗 Public URL generated
   - ✅ Gallery photo saved successfully

## What This Does

- The `INSERT` policy allows your app to upload files to the bucket
- The `SELECT` policy allows anyone to view the public URLs
- Both policies use `true` which means "allow all" - this is safe because:
  - The bucket is already public
  - You control uploads through your app logic
  - Images are meant to be publicly viewable in the gallery

## Still Not Working?

If you still get errors after adding the policies:

1. **Make sure the bucket is PUBLIC**:
   - Go to Storage → gallery-photos
   - Check that "Public bucket" toggle is ON

2. **Check your environment variables**:
   ```javascript
   // In browser console:
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Has Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

3. **Verify bucket name matches**:
   - The bucket must be exactly named `gallery-photos` (case-sensitive)

## Expected Result

After the fix, your console should show:
```
📤 Starting gallery photo upload...
📸 saveGalleryPhoto called with: {fullName: "...", ...}
🔄 Converting base64 to blob...
✅ Blob created, size: 1234567 bytes
📝 Uploading file: 1234567890-john-doe-beach-wedding.jpg to bucket: gallery-photos
✅ Upload successful, data: {path: "..."}
🔗 Public URL generated: https://...supabase.co/storage/v1/object/public/gallery-photos/...
💾 Saving metadata to database...
✅ Gallery photo saved successfully: {id: "...", image_url: "...", ...}
```

Then your photos will appear in the Hall of Fame gallery!
