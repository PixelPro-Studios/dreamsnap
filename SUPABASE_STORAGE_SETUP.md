# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for storing gallery photos.

## 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure the bucket:
   - **Name**: `gallery-photos`
   - **Public bucket**: ✅ **Enabled** (photos need to be publicly accessible for the gallery)
   - **File size limit**: 5MB (recommended)
   - **Allowed MIME types**: `image/jpeg`, `image/png`

## 2. Set Up Storage Policies

Navigate to **Storage** → **Policies** and create the following policies:

### Policy 1: Allow Public Read Access
- **Policy name**: `Public read access for gallery photos`
- **Target**: `SELECT`
- **Definition**:
```sql
true
```

This allows anyone to read/view the photos in the gallery.

### Policy 2: Allow Authenticated Insert
- **Policy name**: `Allow authenticated users to upload`
- **Target**: `INSERT`
- **Definition**:
```sql
true
```

This allows the application to upload new photos (using your anon key, which is safe since uploads are controlled by your application logic).

### Policy 3: Allow Authenticated Delete (Optional)
If you want to be able to delete photos:
- **Policy name**: `Allow authenticated users to delete`
- **Target**: `DELETE`
- **Definition**:
```sql
true
```

## 3. Database Table (Already Configured)

The `gallery_photos` table stores metadata about the images:

```sql
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,        -- URL from Supabase Storage
    caption TEXT,
    full_name TEXT NOT NULL,
    theme_selected TEXT NOT NULL,
    event_id TEXT NOT NULL DEFAULT 'default_event'
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_event_id ON gallery_photos(event_id);
```

## 4. How It Works

1. **Image Upload Flow**:
   - User generates a photo with AI
   - Photo is converted from base64 to Blob
   - Blob is uploaded to Supabase Storage bucket `gallery-photos`
   - Supabase returns a public URL
   - URL is saved in the `gallery_photos` table along with metadata

2. **Image Retrieval Flow**:
   - Gallery page queries the `gallery_photos` table
   - Gets public URLs from Supabase Storage
   - Displays images using the URLs

## 5. Benefits

✅ **Efficient**: Images stored as files, not base64 in database
✅ **Scalable**: Supabase Storage handles CDN and caching
✅ **Fast**: Public URLs served directly from storage
✅ **Cost-effective**: Only metadata in database, images in storage

## 6. Storage Bucket Settings

Recommended settings for production:

- **File size limit**: 5MB (prevents large uploads)
- **Cache control**: 3600 seconds (1 hour)
- **Content type**: `image/jpeg` (all images converted to JPEG)
- **Naming convention**: `{timestamp}-{fullname}-{theme}.jpg`

## 7. Testing

After setup, test the upload:

1. Generate a photo in the app
2. Complete the flow and submit contact information
3. Check Supabase Storage → `gallery-photos` bucket
4. Verify the image appears
5. Check the `gallery_photos` table for the URL entry
6. Visit the Gallery page to see the photo displayed

## 8. Troubleshooting

### Images not uploading
- Check if the bucket exists and is public
- Verify storage policies allow INSERT
- Check browser console for errors

### Images not displaying
- Verify the bucket is set to public
- Check if SELECT policy is enabled
- Ensure URLs are correctly stored in the database

### CORS errors
- Supabase Storage automatically handles CORS for public buckets
- If issues persist, check your Supabase project settings

## 9. Environment Variables

Make sure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_EVENT_ID=your-event-id
```

## 10. Optional: Image Compression

For better performance, consider adding image compression before upload:

```typescript
// Future enhancement: compress images before upload
import imageCompression from 'browser-image-compression';

const compressedBlob = await imageCompression(blob, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
});
```

This is already handled by the AI generation (1080x1920), but can be added for extra optimization.
