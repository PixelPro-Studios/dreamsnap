import { useEffect, useState, useRef } from 'react';
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
            console.log('📤 Starting gallery photo upload...');
            const galleryResult = await saveGalleryPhoto({
              imageBase64: finalImage,
              caption: caption,
              fullName: leadData.fullName,
              themeSelected: selectedTheme?.name || 'Unknown',
              eventId: leadData.eventId || import.meta.env.VITE_EVENT_ID || 'default_event',
            });

            if (galleryResult.error) {
              console.error('❌ Gallery save error:', galleryResult.error);
            } else {
              console.log('✅ Photo uploaded to storage and saved to gallery database');
              console.log('📊 Gallery data:', galleryResult.data);
            }
          } catch (galleryError) {
            console.error('❌ Failed to save to gallery database:', galleryError);
            // Don't fail the whole process if gallery save fails
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="card max-w-3xl w-full shadow-2xl">
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block relative mb-6">
              <div className="w-24 h-24 border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin shadow-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-3 shadow-xl">
                  <svg className="w-8 h-8 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">Processing Your Photo...</h2>
            <p className="text-gray-700 text-lg">Please wait while we save and share your photo</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <>
            {/* Success icon */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-primary-600 to-pink-600 rounded-full p-8 mb-6 shadow-2xl">
                <svg
                  className="w-20 h-20 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                {status === 'success' ? 'All Done! ✨' : 'Oops!'}
              </h2>
              <p className="text-gray-700 text-xl font-medium">
                {status === 'success'
                  ? 'Your photo will be sent to you shortly'
                  : 'We encountered some issues'}
              </p>
            </div>

            {/* Image preview */}
            {finalImage && (
              <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-pink-50 rounded-2xl">
                <h3 className="font-bold text-center mb-4 text-2xl text-gray-800 flex items-center justify-center gap-2">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Your Photo
                </h3>
                <div className="rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto ring-4 ring-primary-600 ring-opacity-50">
                  <img src={finalImage} alt="Final photo" className="w-full h-auto" />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onStartOver} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
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
