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
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="text-9xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-pulse">
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

          {/* Controls - right center of screen */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col items-center gap-6">
            {/* Flip camera button */}
            <button
              onClick={toggleCamera}
              disabled={isCapturing}
              className="w-16 h-16 rounded-full bg-white bg-opacity-90 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-opacity-100 hover:scale-110 transition-all disabled:opacity-50 shadow-2xl border-2 border-white border-opacity-50"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            {/* Capture button */}
            <button
              onClick={startCapture}
              disabled={isCapturing}
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:scale-100 border-4 border-white border-opacity-50"
            >
              <div className="w-20 h-20 rounded-full bg-primary-600 border-4 border-white shadow-inner"></div>
            </button>
          </div>

          {/* Capturing status text */}
          {capturedPhotos.length > 0 && capturedPhotos.length < PHOTO_COUNT && !isCapturing && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <p className="text-center text-white text-sm bg-black bg-opacity-30 backdrop-blur-sm py-2 px-4 rounded-full">
                Hold still...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
