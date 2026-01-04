/**
 * Diagnostic tool to check Supabase Storage and Database setup
 * Run this in the browser console to verify configuration
 */

import { supabase } from './supabase';

export const runDiagnostics = async () => {
  console.log('🔍 Running DreamSnap Supabase Diagnostics...\n');

  const results = {
    supabaseUrl: false,
    supabaseKey: false,
    bucketExists: false,
    bucketPublic: false,
    tableExists: false,
    canInsertToTable: false,
    canUploadToStorage: false,
  };

  // 1. Check environment variables
  console.log('1️⃣ Checking environment variables...');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl) {
    console.log('✅ VITE_SUPABASE_URL is set:', supabaseUrl);
    results.supabaseUrl = true;
  } else {
    console.error('❌ VITE_SUPABASE_URL is not set');
  }

  if (supabaseKey) {
    console.log('✅ VITE_SUPABASE_ANON_KEY is set (length:', supabaseKey.length, ')');
    results.supabaseKey = true;
  } else {
    console.error('❌ VITE_SUPABASE_ANON_KEY is not set');
  }

  // 2. Check storage bucket
  console.log('\n2️⃣ Checking storage bucket...');
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
    } else {
      const galleryBucket = buckets?.find((b) => b.name === 'gallery-photos');
      if (galleryBucket) {
        console.log('✅ Bucket "gallery-photos" exists');
        results.bucketExists = true;

        if (galleryBucket.public) {
          console.log('✅ Bucket is public');
          results.bucketPublic = true;
        } else {
          console.error('❌ Bucket is NOT public - photos won\'t be accessible!');
        }
      } else {
        console.error('❌ Bucket "gallery-photos" does not exist');
        console.log('Available buckets:', buckets?.map((b) => b.name).join(', '));
      }
    }
  } catch (error) {
    console.error('❌ Error checking buckets:', error);
  }

  // 3. Check database table
  console.log('\n3️⃣ Checking database table...');
  try {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ Table "gallery_photos" does not exist');
      } else {
        console.error('❌ Error querying table:', error);
      }
    } else {
      console.log('✅ Table "gallery_photos" exists');
      results.tableExists = true;
      console.log('📊 Current record count:', data?.length || 0);
    }
  } catch (error) {
    console.error('❌ Error checking table:', error);
  }

  // 4. Test database insert (with rollback)
  console.log('\n4️⃣ Testing database insert...');
  try {
    const testData = {
      image_url: 'https://example.com/test-image.jpg',
      caption: 'Diagnostic test image',
      full_name: 'Test User',
      theme_selected: 'Test Theme',
      event_id: 'test-event',
    };

    const { data, error } = await supabase
      .from('gallery_photos')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.error('❌ Cannot insert to table:', error.message);
      console.error('Error code:', error.code);
      console.error('Error hint:', error.hint);
    } else {
      console.log('✅ Database insert works!');
      results.canInsertToTable = true;

      // Clean up test record
      await supabase.from('gallery_photos').delete().eq('id', data.id);
      console.log('🧹 Test record cleaned up');
    }
  } catch (error) {
    console.error('❌ Error testing insert:', error);
  }

  // 5. Test storage upload (with cleanup)
  console.log('\n5️⃣ Testing storage upload...');
  try {
    // Create a tiny test image (1x1 pixel red JPEG)
    const testImageBase64 =
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA//2Q==';
    const blob = new Blob(
      [Uint8Array.from(atob(testImageBase64), (c) => c.charCodeAt(0))],
      { type: 'image/jpeg' }
    );

    const testFileName = `diagnostic-test-${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('gallery-photos')
      .upload(testFileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });

    if (error) {
      console.error('❌ Cannot upload to storage:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('✅ Storage upload works!');
      results.canUploadToStorage = true;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-photos')
        .getPublicUrl(testFileName);

      console.log('🔗 Test file URL:', publicUrl);

      // Clean up test file
      await supabase.storage.from('gallery-photos').remove([testFileName]);
      console.log('🧹 Test file cleaned up');
    }
  } catch (error) {
    console.error('❌ Error testing storage:', error);
  }

  // Summary
  console.log('\n📋 DIAGNOSTIC SUMMARY');
  console.log('═══════════════════════════════');

  const checks = [
    { name: 'Supabase URL configured', status: results.supabaseUrl },
    { name: 'Supabase API Key configured', status: results.supabaseKey },
    { name: 'Storage bucket exists', status: results.bucketExists },
    { name: 'Storage bucket is public', status: results.bucketPublic },
    { name: 'Database table exists', status: results.tableExists },
    { name: 'Can insert to database', status: results.canInsertToTable },
    { name: 'Can upload to storage', status: results.canUploadToStorage },
  ];

  checks.forEach((check) => {
    const icon = check.status ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
  });

  const allPassed = Object.values(results).every((v) => v === true);

  if (allPassed) {
    console.log('\n🎉 All checks passed! DreamSnap should work correctly.');
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.');
    console.log('📖 See TROUBLESHOOTING.md for detailed solutions.');
  }

  return results;
};

// Make it available in the browser console
if (typeof window !== 'undefined') {
  (window as any).runDiagnostics = runDiagnostics;
}
