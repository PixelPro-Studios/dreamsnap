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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="card max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block relative mb-6">
            <div className="w-32 h-32 rounded-full border-8 border-primary-200 border-t-primary-600 animate-spin shadow-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-xl">
                <svg
                  className="w-12 h-12 text-primary-600 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Creating Your Magic ✨
          </h2>
          <p className="text-gray-700 text-xl mb-8 font-medium">{status}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary-600 via-pink-500 to-pink-600 transition-all duration-500 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-lg font-bold text-gray-700">{progress}% Complete</p>
        </div>

        {/* Fun tips while waiting */}
        <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-2xl p-6 border-2 border-primary-200 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
            <div className="bg-gradient-to-r from-primary-600 to-pink-600 rounded-full p-2 mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Did you know?
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            Our AI carefully preserves your facial features while transforming the style and
            atmosphere of your photo. Each generation is unique!
          </p>
        </div>

        {/* Estimated time */}
        <div className="text-center mt-6 bg-gray-100 py-3 px-4 rounded-lg">
          <p className="text-sm text-gray-600 font-medium">
            ⏱️ AI generation typically takes 30-60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};
