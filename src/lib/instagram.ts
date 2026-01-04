import axios from 'axios';

const INSTAGRAM_ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ACCOUNT_ID = import.meta.env.VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID;

export interface PostToInstagramParams {
  imageUrl: string;
  caption: string;
  usernames: string[];
}

export const postToInstagramStory = async ({
  imageUrl,
  caption,
  usernames,
}: PostToInstagramParams): Promise<{ success: boolean; postUrl?: string; error?: string }> => {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      console.warn('Instagram credentials not configured');
      return {
        success: false,
        error: 'Instagram API not configured',
      };
    }

    // Step 1: Create media container for story
    const createMediaResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        media_type: 'STORIES',
        access_token: INSTAGRAM_ACCESS_TOKEN,
      }
    );

    const mediaId = createMediaResponse.data.id;

    if (!mediaId) {
      throw new Error('Failed to create media container');
    }

    // Step 2: Publish the story
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
      {
        creation_id: mediaId,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      }
    );

    const postId = publishResponse.data.id;

    return {
      success: true,
      postUrl: `https://www.instagram.com/stories/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/${postId}`,
    };
  } catch (error) {
    console.error('Error posting to Instagram:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Alternative: Generate shareable Instagram link
export const generateInstagramShareLink = (imageUrl: string, caption: string): string => {
  // This opens Instagram app with the image ready to share
  // Note: This is a fallback if Instagram API is not available
  const encodedCaption = encodeURIComponent(caption);
  return `instagram://library?AssetPath=${encodeURIComponent(imageUrl)}&InstagramCaption=${encodedCaption}`;
};

// Format Instagram handles
export const formatInstagramHandle = (handle: string): string => {
  const cleaned = handle.trim().replace(/^@/, '');
  return cleaned ? `@${cleaned}` : '';
};

// Create caption with user tags
export const createInstagramCaption = (
  names: string,
  handles: string[],
  eventName?: string
): string => {
  const formattedHandles = handles
    .filter(Boolean)
    .map(formatInstagramHandle)
    .join(' ');

  const caption = `✨ ${names} captured at ${eventName || 'our event'}! ${formattedHandles}\n\n#DreamSnap #AIPhotography #CoupleGoals #EventPhotography`;

  return caption;
};
