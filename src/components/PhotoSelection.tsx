import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';

interface PhotoSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export const PhotoSelection: React.FC<PhotoSelectionProps> = ({ onNext, onBack }) => {
  const { capturedPhotos, selectedPhoto, selectPhoto } = useAppStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelectPhoto = (photo: string) => {
    selectPhoto(photo);
  };

  const handleContinue = () => {
    if (selectedPhoto) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="card max-w-6xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
          Select Your Best Photo
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Choose the photo you like best for your AI transformation
        </p>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {capturedPhotos.map((photo, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                selectedPhoto === photo
                  ? 'ring-4 ring-primary-600 scale-105'
                  : 'hover:scale-105'
              }`}
              onClick={() => handleSelectPhoto(photo)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={photo}
                alt={`Captured photo ${index + 1}`}
                className="w-full h-auto aspect-square object-cover"
              />

              {/* Selection indicator */}
              {selectedPhoto === photo && (
                <div className="absolute inset-0 bg-primary-600 bg-opacity-20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              {hoveredIndex === index && selectedPhoto !== photo && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Photo number badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Selected preview */}
        {selectedPhoto && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
              Selected Photo Preview
            </h3>
            <div className="max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl">
              <img
                src={selectedPhoto}
                alt="Selected photo"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <button onClick={onBack} className="btn-secondary">
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retake Photos
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedPhoto}
            className="btn-primary"
          >
            Continue to Themes
            <svg
              className="w-5 h-5 inline-block ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>

        {!selectedPhoto && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Tap on a photo to select it
          </p>
        )}
      </div>
    </div>
  );
};
