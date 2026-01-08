import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface GenerateImageParams {
  imageBase64: string;
  prompt: string;
  referenceImageUrl?: string; // Optional reference image for style guidance
}

/**
 * Fetch and convert reference image to base64
 */
const fetchReferenceImageBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.replace(/^data:image\/\w+;base64,/, '');
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching reference image:', error);
    throw new Error('Failed to load reference image');
  }
};

/**
 * Generate AI-transformed image using Gemini 2.5 Flash Image
 * This model supports image-to-image transformation with style transfer
 * Optionally supports a reference image to guide the style
 */
export const generateImageWithGemini = async ({
  imageBase64,
  prompt,
  referenceImageUrl,
}: GenerateImageParams): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    console.log('Generating with Gemini 2.5 Flash Image...');
    console.log('Input image base64 length:', base64Data.length);
    console.log('Input starts with data URL?:', imageBase64.startsWith('data:'));

    // Load reference image if provided
    let referenceImageBase64: string | null = null;
    if (referenceImageUrl) {
      console.log('Loading reference image from:', referenceImageUrl);
      referenceImageBase64 = await fetchReferenceImageBase64(referenceImageUrl);
      console.log('Reference image loaded, base64 length:', referenceImageBase64.length);
    }

    // Configure model to return both image and text
    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };

    const model = 'gemini-2.5-flash-image';

    // Prepare parts array
    const parts: any[] = [
      {
        text: referenceImageBase64
          ? `${prompt}\n\nUSE THIS REFERENCE IMAGE AS A STYLE GUIDE for lighting, atmosphere, and overall aesthetic. Match the style shown in the reference while keeping the person's appearance unchanged.`
          : prompt,
      },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      },
    ];

    // Add reference image if available
    if (referenceImageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: referenceImageBase64,
        },
      });
      console.log('Added reference image to prompt');
    }

    // Prepare contents with prompt and input image(s)
    const contents = [
      {
        role: 'user' as const,
        parts,
      },
    ];

    // Generate content stream
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let generatedImageData: string | null = null;
    let generatedMimeType: string = 'image/jpeg';

    // Process streamed chunks
    console.log('Processing Gemini response stream...');
    let chunkCount = 0;

    for await (const chunk of response) {
      chunkCount++;
      console.log(`Chunk ${chunkCount}:`, chunk);

      if (!chunk.candidates || !chunk.candidates[0]?.content?.parts) {
        console.log(`Chunk ${chunkCount}: No candidates or parts`);
        continue;
      }

      const parts = chunk.candidates[0].content.parts;
      console.log(`Chunk ${chunkCount}: ${parts.length} parts found`);

      // Check for image data in the chunk
      const imagePart = parts.find(
        (part: any) => part.inlineData
      );

      if (imagePart?.inlineData) {
        generatedImageData = imagePart.inlineData.data || null;
        generatedMimeType = imagePart.inlineData.mimeType || 'image/jpeg';
        console.log('✅ Received generated image from Gemini!');
        console.log('MIME type:', generatedMimeType);
        console.log('Image data length:', generatedImageData?.length || 0);
      }

      // Log any text responses (optional)
      if (chunk.text) {
        console.log('Gemini text response:', chunk.text);
      }
    }

    console.log(`Total chunks processed: ${chunkCount}`);

    // Check if we received an image
    if (!generatedImageData) {
      throw new Error('No image data found in Gemini response');
    }

    // Return base64 image with proper data URL prefix
    return `data:${generatedMimeType};base64,${generatedImageData}`;

  } catch (error) {
    console.error('Error generating image with Gemini:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check for API-specific errors
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key or authentication failed');
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (error.message.includes('permission')) {
        throw new Error('API access forbidden. Check your API key permissions');
      }
    }

    throw new Error(
      `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Mock function for development/testing without API
export const mockGenerateImage = async (
  imageBase64: string,
  _prompt: string
): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return the original image for now
  return imageBase64;
};
