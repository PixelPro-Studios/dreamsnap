# Troubleshooting Guide - Images Not Saving to Supabase

## Quick Checklist

Run through this checklist to identify the issue:

### 1. Check Browser Console Logs

Open the browser Developer Tools (F12) and check the Console tab for detailed logs:

**Look for these log messages:**
- `📤 Starting gallery photo upload...`
- `📸 saveGalleryPhoto called with:` - Shows the data being sent
- `🔄 Converting base64 to blob...`
- `✅ Blob created, size: X bytes`
- `📝 Uploading file: X to bucket: gallery-photos`
- `✅ Upload successful`
- `🔗 Public URL generated: X`
- `💾 Saving metadata to database...`
- `✅ Gallery photo saved successfully`

**Look for these error messages:**
- `❌ Error uploading to storage:` - Storage upload failed
- `❌ Error saving gallery photo metadata:` - Database insert failed
- `❌ Failed to save to gallery database:` - General error

### 2. Verify Supabase Storage Bucket Setup

Go to your Supabase Dashboard → Storage:

#### Check bucket exists:
- [ ] Bucket named `gallery-photos` exists
- [ ] Bucket is set to **Public** (very important!)

#### Check bucket policies:
Go to Storage → Policies:

**Required policies for `gallery-photos` bucket:**

1. **SELECT (Read) Policy**
   ```sql
   -- Policy name: Public read access
   -- Operation: SELECT
   -- Definition: true
   ```

2. **INSERT (Upload) Policy**
   ```sql
   -- Policy name: Allow uploads
   -- Operation: INSERT
   -- Definition: true
   ```

### 3. Verify Database Table

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check if table exists
SELECT * FROM gallery_photos LIMIT 1;

-- Check table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'gallery_photos';
```

**Expected columns:**
- `id` (uuid)
- `created_at` (timestamp)
- `image_url` (text)
- `caption` (text)
- `full_name` (text)
- `theme_selected` (text)
- `event_id` (text)

### 4. Check Environment Variables

Verify your `.env` file has:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_EVENT_ID=your-event-id
```

**Test Supabase connection:**
```javascript
// In browser console:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### 5. Common Errors and Solutions

#### Error: "Bucket not found"
**Solution:**
- Create the `gallery-photos` bucket in Supabase Storage
- Make sure the bucket name matches exactly (case-sensitive)

#### Error: "new row violates row-level security policy"
**Solution:**
- Go to Database → Policies
- Create a policy for `gallery_photos` table:
  ```sql
  -- Policy name: Allow all operations
  -- Operation: ALL
  -- Definition: true
  ```

#### Error: "The resource already exists"
**Solution:**
- Change `upsert: false` to `upsert: true` in `supabase.ts`
- Or ensure unique filenames (already handled with timestamp)

#### Error: "File too large"
**Solution:**
- Check Supabase Storage limits (default 50MB)
- Images should be ~1-2MB each (1080x1920 JPEG)

#### Error: "Anonymous access is disabled"
**Solution:**
- Go to Storage → Configuration
- Enable public access for the bucket
- Or use authenticated uploads (requires RLS policies)

### 6. Test Upload Manually

Go to Supabase Dashboard → Storage → `gallery-photos`:

1. Click "Upload file"
2. Select any image
3. If this fails, your bucket/policies aren't configured correctly

### 7. Check Network Tab

In browser DevTools → Network tab:

**Look for requests to:**
- `https://your-project.supabase.co/storage/v1/object/gallery-photos/...`
- `https://your-project.supabase.co/rest/v1/gallery_photos`

**Check response status:**
- 200 OK = Success
- 401 Unauthorized = API key issue
- 403 Forbidden = Policy/permissions issue
- 404 Not Found = Bucket doesn't exist
- 413 Payload Too Large = File too big

### 8. Verify Image Data

Check that the image is valid base64:

```javascript
// In browser console after generation:
console.log('Image starts with data:image?', finalImage?.startsWith('data:image'));
console.log('Image base64 length:', finalImage?.length);
```

Expected:
- Should start with `data:image/jpeg;base64,` or similar
- Length should be 100,000+ characters for a 1080x1920 image

### 9. Test with Mock Data

Create a test file to verify Supabase connection:

```typescript
// test-upload.ts
import { uploadImageToStorage } from './src/lib/supabase';

const testBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'; // Small test image
const result = await uploadImageToStorage(testBase64, 'test-image');
console.log('Test result:', result);
```

### 10. Enable Verbose Logging

The code now includes detailed console.log statements. Check the browser console for:

1. **Before upload:**
   - Data being sent (name, theme, event ID)
   - Base64 length
   - Blob size

2. **During upload:**
   - Filename being used
   - Bucket name
   - Upload progress

3. **After upload:**
   - Public URL
   - Database insert result

4. **On error:**
   - Error message
   - Error code
   - Error details

## Still Having Issues?

### Capture This Information:

1. **Console Logs:**
   - Copy all console output from the upload attempt

2. **Network Logs:**
   - Screenshot the Network tab showing the failed request
   - Note the HTTP status code

3. **Supabase Dashboard:**
   - Screenshot Storage bucket settings
   - Screenshot Storage policies
   - Screenshot Database table structure

4. **Environment:**
   - Browser and version
   - Does it work in incognito mode?
   - Does it work on a different browser?

### Common Setup Mistakes:

- ❌ Bucket is private (not public)
- ❌ No INSERT policy on storage bucket
- ❌ No INSERT policy on database table
- ❌ Wrong bucket name in code
- ❌ Wrong Supabase URL or API key
- ❌ Table doesn't exist
- ❌ Column names don't match

### Quick Fix Script:

Run this in Supabase SQL Editor to set up everything:

```sql
-- Create table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,
    caption TEXT,
    full_name TEXT NOT NULL,
    theme_selected TEXT NOT NULL,
    event_id TEXT NOT NULL DEFAULT 'default_event'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_event_id ON gallery_photos(event_id);

-- Enable RLS
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
DROP POLICY IF EXISTS "Allow all operations" ON gallery_photos;
CREATE POLICY "Allow all operations" ON gallery_photos
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

Then create the storage bucket manually in the Supabase Dashboard with public access enabled.
