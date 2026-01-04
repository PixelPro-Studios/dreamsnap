import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useAppStore } from '@/stores/appStore';
import { captureImageFromStream } from '@/lib/imageUtils';

interface PhotoCaptureProps {
  onComplete: () => void;
}

const PHOTO_COUNT = 5;
const DELAY_BETWEEN_SHOTS = 250; // 0.25 seconds in milliseconds

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onComplete }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const { addCapturedPhoto, clearPhotos, capturedPhotos } = useAppStore();

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Start capture sequence
  const startCapture = useCallback(async () => {
    if (!webcamRef.current) return;

    clearPhotos();
    setIsCapturing(true);
    setCurrentPhotoIndex(0);
    setCountdown(3);
  }, [clearPhotos]);

  // Countdown effect
  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Capture photos after countdown
  useEffect(() => {
    if (countdown !== 0 || !isCapturing) return;

    const captureSequence = async () => {
      for (let i = 0; i < PHOTO_COUNT; i++) {
        setCurrentPhotoIndex(i + 1);

        // Capture photo
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          addCapturedPhoto(imageSrc);
        }

        // Wait before next shot (except for the last one)
        if (i < PHOTO_COUNT - 1) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_SHOTS));
        }
      }

      setIsCapturing(false);
      setCurrentPhotoIndex(0);
    };

    captureSequence();
  }, [countdown, isCapturing, addCapturedPhoto]);

  // Auto-proceed when all photos are captured
  useEffect(() => {
    if (capturedPhotos.length === PHOTO_COUNT && !isCapturing) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [capturedPhotos.length, isCapturing, onComplete]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Camera error:', error);
    setCameraError('Unable to access camera. Please check your permissions.');
  };

  // Adaptive video constraints based on orientation
  const videoConstraints = {
    width: isPortrait ? { ideal: 1080 } : { ideal: 1920 },
    height: isPortrait ? { ideal: 1920 } : { ideal: 1080 },
    facingMode: facingMode,
    aspectRatio: isPortrait ? 9 / 16 : 16 / 9,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {cameraError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white p-8 text-center">
          <div>
            <p className="mb-4">{cameraError}</p>
            <button
              onClick={() => {
                setCameraError(null);
                window.location.reload();
              }}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Fullscreen camera feed */}
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={handleUserMediaError}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Countdown overlay */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
              <div className="text-9xl font-bold text-white animate-ping">
                {countdown}
              </div>
            </div>
          )}

          {/* Capturing indicator */}
          {isCapturing && countdown === 0 && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-semibold animate-pulse z-20">
              Capturing {currentPhotoIndex} / {PHOTO_COUNT}
            </div>
          )}

          {/* Camera guidelines */}
          {!isCapturing && countdown === null && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute inset-0 border-4 border-white border-opacity-20 m-12 md:m-16 rounded-lg"></div>
            </div>
          )}

          {/* Progress indicator - top of screen */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-2">
              {Array.from({ length: PHOTO_COUNT }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-10 rounded-full transition-all ${
                    index < capturedPhotos.length
                      ? 'bg-white'
                      : 'bg-white bg-opacity-30'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Controls - bottom of screen */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 px-6 z-20">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {/* Flip camera button */}
              <button
                onClick={toggleCamera}
                disabled={isCapturing}
                className="w-14 h-14 rounded-full bg-white bg-opacity-30 backdrop-blur-md flex items-center justify-center text-white hover:bg-opacity-40 transition-all disabled:opacity-50 shadow-lg"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-5 11.5V13H9v3.5L5.5 12.5 9 8.5V12h6V8.5l3.5 4-3.5 4z"/>
                </svg>
              </button>

              {/* Capture button */}
              <button
                onClick={startCapture}
                disabled={isCapturing || capturedPhotos.length === PHOTO_COUNT}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                {capturedPhotos.length === 0 ? (
                  <div className="w-16 h-16 rounded-full border-4 border-black"></div>
                ) : (
                  <svg
                    className="w-10 h-10 text-black"
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
                )}
              </button>

              {/* Placeholder for symmetry */}
              <div className="w-14 h-14"></div>
            </div>

            {/* Capturing status text */}
            {capturedPhotos.length > 0 && capturedPhotos.length < PHOTO_COUNT && !isCapturing && (
              <p className="text-center text-white text-sm mt-4 bg-black bg-opacity-30 backdrop-blur-sm py-2 px-4 rounded-full inline-block mx-auto block">
                Hold still...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
