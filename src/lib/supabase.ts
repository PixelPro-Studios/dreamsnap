import { createClient } from '@supabase/supabase-js';
import { Lead } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please configure environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database operations
export const saveLead = async (lead: Lead): Promise<{ data: Lead | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          full_name: lead.fullName,
          instagram_handle_1: lead.instagramHandle1 || null,
          instagram_handle_2: lead.instagramHandle2 || null,
          phone_number: lead.phoneNumber,
          country_code: lead.countryCode,
          consent_given: lead.consentGiven,
          theme_selected: lead.themeSelected,
          event_id: lead.eventId || import.meta.env.VITE_EVENT_ID || 'default',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving lead:', error.message);
    }

    return { data: data as Lead, error };
  } catch (error) {
    console.error('Failed to save lead:', error);
    return { data: null, error };
  }
};

/**
 * Convert base64 string to Blob
 */
const base64ToBlob = (base64: string, contentType: string = 'image/jpeg'): Blob => {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

/**
 * Upload image to Supabase Storage and return public URL
 */
export const uploadImageToStorage = async (
  imageBase64: string,
  fileName: string,
  bucket: string = 'gallery-photos'
): Promise<{ url: string | null; error: any }> => {
  try {
    const blob = base64ToBlob(imageBase64);
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}.jpg`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload failed:', error.message);
      return { url: null, error };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Image upload error:', error);
    return { url: null, error };
  }
};

/**
 * Save photo to gallery - uploads image to storage and saves metadata to database
 */
export const saveGalleryPhoto = async (photoData: {
  imageBase64: string;
  caption: string;
  fullName: string;
  themeSelected: string;
  eventId: string;
}): Promise<{ data: any; error: any }> => {
  try {
    const fileName = `${photoData.fullName.replace(/\s+/g, '-').toLowerCase()}-${photoData.themeSelected.replace(/\s+/g, '-').toLowerCase()}`;
    const { url: imageUrl, error: uploadError } = await uploadImageToStorage(
      photoData.imageBase64,
      fileName
    );

    if (uploadError || !imageUrl) {
      console.error('Failed to upload gallery image:', uploadError);
      return { data: null, error: uploadError };
    }

    const { data, error } = await supabase
      .from('gallery_photos')
      .insert([
        {
          image_url: imageUrl,
          caption: photoData.caption,
          full_name: photoData.fullName,
          theme_selected: photoData.themeSelected,
          event_id: photoData.eventId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving gallery photo:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Gallery photo save failed:', error);
    return { data: null, error };
  }
};

// Fetch gallery photos
export const fetchGalleryPhotos = async (eventId?: string): Promise<any[]> => {
  try {
    let query = supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by event if specified
    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching gallery photos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    return [];
  }
};

// SQL Schema for reference
export const LEADS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name TEXT NOT NULL,
    instagram_handle_1 TEXT,
    instagram_handle_2 TEXT,
    phone_number TEXT NOT NULL,
    country_code TEXT NOT NULL DEFAULT '+1',
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    event_id TEXT,
    theme_selected TEXT NOT NULL,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_event_id ON leads(event_id);
`;

export const GALLERY_PHOTOS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,
    caption TEXT,
    full_name TEXT NOT NULL,
    theme_selected TEXT NOT NULL,
    event_id TEXT NOT NULL DEFAULT 'default_event'
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_event_id ON gallery_photos(event_id);
`;
