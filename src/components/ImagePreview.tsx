import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';

interface ImagePreviewProps {
  onApprove: () => void;
  onRetry: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ onApprove, onRetry }) => {
  const { finalImage, selectedTheme } = useAppStore();
  const [isZoomed, setIsZoomed] = useState(false);

  if (!finalImage) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12">
      <div className="card max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
          Your Magical Transformation
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Theme: <span className="font-semibold">{selectedTheme?.name}</span>
        </p>

        {/* Image preview */}
        <div className="mb-8">
          <div
            className={`relative rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform ${
              isZoomed ? 'scale-105' : ''
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={finalImage}
              alt="Generated photo with frame"
              className="w-full h-auto"
            />

            {/* Zoom indicator */}
            {!isZoomed && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-full">
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                Tap to zoom
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onRetry} className="btn-secondary">
            <svg
              className="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Another Theme
          </button>

          <button onClick={onApprove} className="btn-primary text-lg px-10">
            <svg
              className="w-6 h-6 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Love It! Continue
          </button>
        </div>

        {/* Info text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Next: Share your details to get your photo and post to Instagram
          </p>
        </div>
      </div>

      {/* Zoomed modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="max-w-6xl w-full">
            <img
              src={finalImage}
              alt="Zoomed photo"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-white text-center mt-4">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};
