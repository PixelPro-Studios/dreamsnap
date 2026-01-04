import axios from 'axios';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export interface SendPhotoToTelegramParams {
  imageBase64: string;
  caption: string;
}

/**
 * Send a photo to Telegram group chat
 * @param imageBase64 - Base64 encoded image data
 * @param caption - Caption for the photo
 * @returns Promise with success status
 */
export const sendPhotoToTelegram = async ({
  imageBase64,
  caption,
}: SendPhotoToTelegramParams): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      return {
        success: false,
        error: 'Telegram Bot not configured',
      };
    }

    // Extract MIME type and base64 data
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    console.log('Converting base64 to blob for Telegram upload (no compression)...');
    console.log('Original MIME type:', mimeType);

    // Convert base64 to blob directly - no compression, preserves original quality
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Use the original MIME type to preserve image format
    const blob = new Blob([byteArray], { type: mimeType });

    console.log(`Blob created: ${blob.size} bytes (${(blob.size / 1024 / 1024).toFixed(2)} MB), type: ${blob.type}`);

    // Create FormData
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', blob, 'photo.jpg');
    formData.append('caption', caption);

    console.log('Sending photo to Telegram...');

    // Send to Telegram
    // Note: axios automatically sets Content-Type for FormData
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      formData,
      {
        timeout: 30000, // 30 seconds timeout
      }
    );

    if (response.data.ok) {
      console.log('✅ Photo sent to Telegram successfully!');
      return {
        success: true,
      };
    } else {
      console.error('❌ Telegram API returned not ok:', response.data);
      throw new Error(response.data.description || 'Failed to send photo');
    }
  } catch (error) {
    console.error('Error sending photo to Telegram:', error);

    if (axios.isAxiosError(error)) {
      console.error('Telegram API Error:', error.response?.data);

      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid Telegram Bot token',
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: 'Invalid chat ID or bad request',
        };
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Create a formatted caption for Telegram photo
 * @param fullName - Names of the couple
 * @param theme - Selected theme name
 * @param instagramHandles - Optional Instagram handles
 * @param phoneNumber - Optional phone number with country code
 * @returns Formatted caption string
 */
export const createTelegramCaption = (
  fullName: string,
  theme: string,
  instagramHandles?: string[],
  phoneNumber?: string
): string => {
  let caption = `✨ ${fullName}\n🎨 Theme: ${theme}`;

  if (instagramHandles && instagramHandles.length > 0) {
    const handles = instagramHandles.filter(Boolean).join(' ');
    if (handles) {
      caption += `\n📸 ${handles}`;
    }
  }

  if (phoneNumber) {
    caption += `\n📱 ${phoneNumber}`;
  }

  caption += '\n\n💫 Created with DreamSnap AI Photography';

  return caption;
};

export interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  width: number;
  height: number;
}

export interface TelegramMessage {
  message_id: number;
  date: number;
  caption?: string;
  photo?: TelegramPhoto[];
}

/**
 * Fetch photos from Telegram group chat
 * @param limit - Maximum number of messages to fetch (default 100)
 * @returns Array of photo messages
 *
 * Note: This function uses a workaround since Telegram Bot API doesn't provide
 * a direct method to fetch chat history. It stores sent photos in a way that
 * can be retrieved. For production, consider using Telegram's MTProto API or
 * storing photo metadata in your own database.
 */
export const fetchPhotosFromTelegram = async (
  limit: number = 100
): Promise<TelegramMessage[]> => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      return [];
    }

    console.log('Fetching photos from Telegram group...');
    console.log('Note: Bot API has limitations on fetching chat history.');
    console.log('This will only show recent updates that the bot has received.');

    // Get updates (this only returns unacknowledged updates)
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
      {
        params: {
          limit: limit,
          allowed_updates: ['message'],
        },
        timeout: 30000,
      }
    );

    if (!response.data.ok) {
      console.error('Failed to fetch updates from Telegram');
      console.error('Response:', response.data);
      return [];
    }

    console.log('Raw updates received:', response.data.result.length);

    // Filter messages from our chat that contain photos
    const photoMessages: TelegramMessage[] = response.data.result
      .map((update: any) => update.message)
      .filter(
        (msg: any) =>
          msg &&
          msg.chat &&
          msg.chat.id.toString() === TELEGRAM_CHAT_ID &&
          msg.photo &&
          msg.photo.length > 0
      )
      .map((msg: any) => ({
        message_id: msg.message_id,
        date: msg.date,
        caption: msg.caption,
        photo: msg.photo,
      }));

    console.log(`✅ Fetched ${photoMessages.length} photos from Telegram`);

    if (photoMessages.length === 0) {
      console.warn('⚠️ No photos found. This could be because:');
      console.warn('1. No photos have been sent to the Telegram group yet');
      console.warn('2. The bot has already acknowledged all updates (getUpdates limitation)');
      console.warn('3. The bot needs to be added to the group and granted message read permissions');
    }

    return photoMessages;
  } catch (error) {
    console.error('Error fetching photos from Telegram:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
    }
    return [];
  }
};

/**
 * Get photo file URL from Telegram
 * @param fileId - Telegram file ID
 * @returns URL to the photo file
 */
export const getPhotoUrl = async (fileId: string): Promise<string | null> => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    // Get file path from Telegram
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile`,
      {
        params: { file_id: fileId },
        timeout: 10000,
      }
    );

    if (response.data.ok && response.data.result.file_path) {
      const filePath = response.data.result.file_path;
      return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    }

    return null;
  } catch (error) {
    console.error('Error getting photo URL:', error);
    return null;
  }
};
