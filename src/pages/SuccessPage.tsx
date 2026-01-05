import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '@/stores/appStore';
import { downloadImage, generateFilename } from '@/lib/imageUtils';
import { saveLead, saveGalleryPhoto } from '@/lib/supabase';
import { sendPhotoToTelegram, createTelegramCaption } from '@/lib/telegram';
import { Lead } from '@/types';

interface SuccessPageProps {
  leadData: Lead;
  onStartOver: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  leadData,
  onStartOver,
}) => {
  const { finalImage, selectedTheme } = useAppStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);
  const [imagePublicUrl, setImagePublicUrl] = useState<string | null>(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode using ref
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;
    processSubmission();
  }, []);

  const processSubmission = async () => {
    if (!finalImage) {
      setStatus('error');
      return;
    }

    try {
      // 1. Save lead to Supabase
      const { data: savedLead, error: leadError } = await saveLead(leadData);

      if (leadError || !savedLead) {
        throw new Error('Failed to save lead data');
      }

      setSavedLeadId(savedLead.id || null);

      // 2. Download photo automatically
      try {
        const filename = generateFilename(leadData.fullName);
        downloadImage(finalImage, filename);
      } catch (error) {
        console.error('Download error:', error);
      }

      // 3. Send photo to Telegram and save to gallery
      try {
        const instagramHandles = [leadData.instagramHandle1, leadData.instagramHandle2].filter(Boolean) as string[];
        const phoneWithCountryCode = `${leadData.countryCode}${leadData.phoneNumber}`;
        const caption = createTelegramCaption(
          leadData.fullName,
          selectedTheme?.name || 'Unknown',
          instagramHandles,
          phoneWithCountryCode
        );

        const result = await sendPhotoToTelegram({
          imageBase64: finalImage,
          caption,
        });

        if (result.success) {
          // Save to gallery database (uploads image to storage)
          try {
            const galleryResult = await saveGalleryPhoto({
              imageBase64: finalImage,
              caption: caption,
              fullName: leadData.fullName,
              themeSelected: selectedTheme?.name || 'Unknown',
              eventId: leadData.eventId || import.meta.env.VITE_EVENT_ID || 'default_event',
            });

            if (galleryResult.error) {
              console.error('Gallery save error:', galleryResult.error);
            } else if (galleryResult.data?.image_url) {
              setImagePublicUrl(galleryResult.data.image_url);
            }
          } catch (galleryError) {
            console.error('Failed to save to gallery:', galleryError);
          }
        }
      } catch (error) {
        console.error('Telegram error:', error);
      }

      // Mark as success
      setStatus('success');
    } catch (error) {
      console.error('Error processing submission:', error);
      setStatus('error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="card max-w-5xl w-full shadow-2xl p-3 sm:p-6">
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block relative mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-6 sm:border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin shadow-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">Processing Your Photo...</h2>
            <p className="text-gray-700 text-sm sm:text-base">Please wait while we save and share your photo</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <>
            {/* Success header - compact */}
            <div className="text-center mb-2 sm:mb-4">
              <div className="inline-block bg-gradient-to-r from-primary-600 to-pink-600 rounded-full p-2.5 sm:p-4 mb-2 sm:mb-3 shadow-xl">
                <svg className="w-7 h-7 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                {status === 'success' ? 'All Done! ✨' : 'Oops!'}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base font-medium">
                {status === 'success' ? 'Your photo will be sent to you shortly' : 'We encountered some issues'}
              </p>
            </div>

            {/* QR Code section - centered */}
            {imagePublicUrl && (
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-pink-50 rounded-lg sm:rounded-xl border-2 border-primary-200 shadow-lg flex flex-col items-center justify-center max-w-md">
                  <h3 className="font-bold text-center mb-3 sm:mb-4 text-base sm:text-xl text-gray-800 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Scan to Download
                  </h3>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl mb-3 sm:mb-4">
                    <QRCodeSVG
                      value={imagePublicUrl}
                      size={180}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                      className="sm:w-[220px] sm:h-[220px]"
                    />
                  </div>
                  <p className="text-center text-gray-700 text-sm sm:text-base font-medium px-2">
                    Scan with your phone to download instantly
                  </p>
                </div>
              </div>
            )}

            {/* Action button */}
            <div className="flex justify-center">
              <button onClick={onStartOver} className="btn-primary flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Create Another Photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
