import imageCompression from 'browser-image-compression';

// Compress image to reduce file size
export const compressImage = async (file: File | Blob, maxSizeMB = 2): Promise<Blob> => {
  try {
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    const compressedFile = await imageCompression(file as File, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

// Convert blob to base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert base64 to blob
export const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

// Download image to device
export const downloadImage = (imageBase64: string, filename: string): void => {
  try {
    const link = document.createElement('a');
    link.href = imageBase64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

// Overlay watermark on image using canvas (positioned at bottom center, max 300px width)
export const overlayWatermarkOnImage = async (
  imageBase64: string,
  watermarkUrl: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    const image = new Image();
    const watermark = new Image();

    image.crossOrigin = 'anonymous';
    watermark.crossOrigin = 'anonymous';

    let imageLoaded = false;
    let watermarkLoaded = false;

    const checkBothLoaded = () => {
      if (imageLoaded && watermarkLoaded) {
        // Set canvas size to match image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the generated image
        ctx.drawImage(image, 0, 0);

        // Calculate watermark dimensions (max 300px width, maintain aspect ratio)
        const maxWatermarkWidth = 300;
        const watermarkAspectRatio = watermark.width / watermark.height;
        const watermarkWidth = Math.min(maxWatermarkWidth, watermark.width);
        const watermarkHeight = watermarkWidth / watermarkAspectRatio;

        // Position watermark at bottom center with 45px margin from bottom
        const watermarkX = (canvas.width - watermarkWidth) / 2;
        const watermarkY = canvas.height - watermarkHeight - 45;

        // Draw white pillbox background behind watermark
        const padding = 16; // 16px padding on all sides
        const pillboxX = watermarkX - padding;
        const pillboxY = watermarkY - padding;
        const pillboxWidth = watermarkWidth + (padding * 2);
        const pillboxHeight = watermarkHeight + (padding * 2);
        const borderRadius = pillboxHeight / 2; // Full rounded ends

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // Semi-transparent white
        ctx.beginPath();
        ctx.roundRect(pillboxX, pillboxY, pillboxWidth, pillboxHeight, borderRadius);
        ctx.fill();

        // Draw the watermark on top of the pillbox
        ctx.drawImage(watermark, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

        // Convert canvas to base64
        const result = canvas.toDataURL('image/jpeg', 0.95);
        resolve(result);
      }
    };

    image.onload = () => {
      imageLoaded = true;
      checkBothLoaded();
    };

    watermark.onload = () => {
      watermarkLoaded = true;
      checkBothLoaded();
    };

    image.onerror = () => reject(new Error('Failed to load image'));
    watermark.onerror = () => reject(new Error('Failed to load watermark'));

    image.src = imageBase64;
    watermark.src = watermarkUrl;
  });
};

// Capture image from video stream
export const captureImageFromStream = (videoElement: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
};

// Generate filename with timestamp
export const generateFilename = (name: string, prefix = 'dreamsnap'): string => {
  const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timestamp = Date.now();
  return `${prefix}_${sanitizedName}_${timestamp}.jpg`;
};
