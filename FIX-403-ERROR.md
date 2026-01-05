# Fix 403 Permission Error After Authentication

## Problem
After implementing Supabase authentication, you're getting a **403 Forbidden** error when trying to save lead data or gallery photos.

## Why This Happens
When you enabled authentication, Supabase's Row Level Security (RLS) was automatically activated. RLS blocks all database operations by default unless you create explicit policies that allow them.

## Solution: Configure RLS Policies

### Step 1: Go to Supabase SQL Editor
1. Open your Supabase Dashboard at https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the RLS Policy SQL
1. Copy the entire contents of `supabase-rls-policies.sql`
2. Paste it into the SQL Editor
3. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

### Step 3: Verify Policies Were Created
At the bottom of the SQL file, there are verification queries. Run them separately to confirm:

```sql
-- Check leads policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'leads';

-- Check gallery_photos policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'gallery_photos';
```

You should see policies listed for both tables.

### Step 4: Configure Storage Policies
For the gallery photos storage bucket:

1. Go to **Storage** in Supabase Dashboard
2. Select the `gallery-photos` bucket
3. Click on **Policies** tab
4. Add a new policy:
   - **Policy Name**: "Authenticated users can upload"
   - **Allowed operation**: INSERT
   - **Target roles**: authenticated
   - **Policy definition**: `true`

5. Add another policy for reading:
   - **Policy Name**: "Public can view photos"
   - **Allowed operation**: SELECT
   - **Target roles**: anon, authenticated
   - **Policy definition**: `true`

### Step 5: Test the Application
1. Log in to your app
2. Try to capture and save a photo
3. The 403 error should be resolved

## What These Policies Do

The SQL commands create policies that:

1. **Allow authenticated users** (logged-in admins) to:
   - Insert new leads
   - Read all leads
   - Update leads
   - Insert gallery photos
   - Read gallery photos

2. **Maintain security** by:
   - Blocking unauthenticated access to write operations
   - Only allowing logged-in users to modify data

## Alternative: Temporarily Disable RLS (Not Recommended for Production)

If you need to quickly test without policies (NOT recommended for production):

```sql
-- Disable RLS on leads table (TEMPORARY - NOT SECURE)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Disable RLS on gallery_photos table (TEMPORARY - NOT SECURE)
ALTER TABLE gallery_photos DISABLE ROW LEVEL SECURITY;
```

**WARNING**: Disabling RLS removes all security protections. Only use this for testing, and re-enable RLS with proper policies before deploying to production.

## Debugging Tips

If you still see 403 errors after setting up policies:

1. **Check Browser Console**: Look for detailed error messages
2. **Verify Authentication**: Make sure you're logged in (check developer tools → Application → Local Storage for auth tokens)
3. **Check Policy Names**: Ensure no typos in the policy definitions
4. **Supabase Logs**: Check the Logs section in Supabase Dashboard for detailed error messages

## Need Help?

The improved error logging will now show helpful messages in the browser console when permission errors occur. Check the console for messages like:

```
🔒 Permission denied - RLS policies may not be configured correctly
📋 Please run the SQL commands in supabase-rls-policies.sql file
```

---

**Remember**: These security policies are important for protecting your data. Always use proper RLS policies in production!
