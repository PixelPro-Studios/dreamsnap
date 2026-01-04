import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { themes } from '@/lib/themes';
import { Theme } from '@/types';

interface ThemeSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export const ThemeSelection: React.FC<ThemeSelectionProps> = ({ onNext, onBack }) => {
  const { selectedTheme, selectTheme } = useAppStore();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleSelectTheme = (theme: Theme) => {
    selectTheme(theme);
  };

  const handleContinue = () => {
    if (selectedTheme) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12">
      <div className="card max-w-7xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
          Choose Your Theme
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Select a style for your AI-transformed photo
        </p>

        {/* Theme grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                selectedTheme?.id === theme.id
                  ? 'ring-4 ring-primary-600 scale-105 shadow-2xl'
                  : 'hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
              onClick={() => handleSelectTheme(theme)}
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
            >
              {/* Theme preview image */}
              <div className="w-full aspect-square bg-gray-200">
                {theme.themeImage ? (
                  <img
                    src={theme.themeImage}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                    <svg
                      className="w-20 h-20 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Theme info */}
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {theme.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {theme.description}
                </p>
              </div>

              {/* Selection indicator */}
              {selectedTheme?.id === theme.id && (
                <div className="absolute top-3 right-3 bg-primary-600 rounded-full p-2 shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
              )}

              {/* Hover overlay */}
              {hoveredTheme === theme.id && selectedTheme?.id !== theme.id && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <svg
                      className="w-8 h-8 text-primary-600"
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
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected theme preview */}
        {selectedTheme && (
          <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-pink-50 rounded-xl">
            <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">
              Selected Theme: {selectedTheme.name}
            </h3>
            <p className="text-center text-gray-600 max-w-2xl mx-auto">
              {selectedTheme.description}
            </p>
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
            Back to Photos
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedTheme}
            className="btn-primary"
          >
            Generate AI Photo
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>
        </div>

        {!selectedTheme && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Select a theme to continue
          </p>
        )}
      </div>
    </div>
  );
};
