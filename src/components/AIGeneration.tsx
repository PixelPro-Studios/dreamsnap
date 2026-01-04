import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import { generateImageWithGemini } from '@/lib/gemini';
import { overlayWatermarkOnImage } from '@/lib/imageUtils';

interface AIGenerationProps {
  onComplete: () => void;
  onError: (error: string) => void;
}

export const AIGeneration: React.FC<AIGenerationProps> = ({ onComplete, onError }) => {
  const { selectedPhoto, selectedTheme, setGeneratedImage, setFinalImage } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing AI...');
  const [isProcessing, setIsProcessing] = useState(true);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode using ref
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    generateImage();
  }, []);

  const generateImage = async () => {
    if (!selectedPhoto || !selectedTheme) {
      onError('Missing photo or theme selection');
      return;
    }

    try {
      // Progress updates
      setStatus('Analyzing your photo...');
      setProgress(20);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus(`Applying ${selectedTheme.name} style...`);
      setProgress(40);

      // Generate AI image with Gemini
      const generatedImage = await generateImageWithGemini({
        imageBase64: selectedPhoto,
        prompt: selectedTheme.promptTemplate,
        referenceImageUrl: selectedTheme.referenceImage, // Pass reference image if available
      });

      setProgress(60);
      setStatus('Adding magical touches...');
      setGeneratedImage(generatedImage);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProgress(80);
      setStatus('Applying custom watermark...');

      // Apply watermark overlay
      const watermarkUrl = import.meta.env.VITE_WATERMARK_IMAGE_URL || '/frames/default-frame.png';

      try {
        const finalImage = await overlayWatermarkOnImage(generatedImage, watermarkUrl);
        setFinalImage(finalImage);
      } catch (watermarkError) {
        console.warn('Watermark overlay failed, using image without watermark:', watermarkError);
        setFinalImage(generatedImage);
      }

      setProgress(100);
      setStatus('Complete!');
      setIsProcessing(false);

      await new Promise((resolve) => setTimeout(resolve, 500));
      onComplete();
    } catch (error) {
      console.error('Error generating image:', error);
      onError(error instanceof Error ? error.message : 'Failed to generate image');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="card max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block relative mb-6">
            <div className="w-24 h-24 rounded-full border-8 border-primary-200 border-t-primary-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Creating Your Magic
          </h2>
          <p className="text-gray-600 text-lg mb-8">{status}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-pink-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{progress}% Complete</p>
        </div>

        {/* Fun tips while waiting */}
        <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Did you know?
          </h3>
          <p className="text-gray-700 text-sm">
            Our AI carefully preserves your facial features while transforming the style and
            atmosphere of your photo. Each generation is unique!
          </p>
        </div>

        {/* Estimated time */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            AI generation typically takes 30-60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
