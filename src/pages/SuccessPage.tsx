import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import { downloadImage, generateFilename } from '@/lib/imageUtils';
import { saveLead, saveGalleryPhoto } from '@/lib/supabase';
import { sendPhotoToTelegram, createTelegramCaption } from '@/lib/telegram';
import { Lead } from '@/types';

interface SuccessPageProps {
  leadData: Lead;
  onViewGallery: () => void;
  onStartOver: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  leadData,
  onViewGallery,
  onStartOver,
}) => {
  const { finalImage, selectedTheme } = useAppStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [downloadStatus, setDownloadStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [telegramStatus, setTelegramStatus] = useState<'pending' | 'success' | 'error'>('pending');
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
        setDownloadStatus('success');
      } catch (error) {
        console.error('Download error:', error);
        setDownloadStatus('error');
      }

      // 3. Send photo to Telegram and save to gallery
      try {
        const instagramHandles = [leadData.instagramHandle1, leadData.instagramHandle2].filter(Boolean) as string[];
        const caption = createTelegramCaption(
          leadData.fullName,
          selectedTheme?.name || 'Unknown',
          instagramHandles
        );

        const result = await sendPhotoToTelegram({
          imageBase64: finalImage,
          caption,
        });

        if (result.success) {
          setTelegramStatus('success');

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
        } else {
          setTelegramStatus('error');
        }
      } catch (error) {
        console.error('Telegram error:', error);
        setTelegramStatus('error');
      }

      // Determine overall status
      if (downloadStatus === 'success' && telegramStatus === 'success') {
        setStatus('success');
      } else if (downloadStatus === 'success' || telegramStatus === 'success') {
        setStatus('success'); // At least one succeeded
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error processing submission:', error);
      setStatus('error');
    }
  };

  const handleManualDownload = () => {
    if (finalImage) {
      const filename = generateFilename(leadData.fullName);
      downloadImage(finalImage, filename);
      setDownloadStatus('success');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12">
      <div className="card max-w-3xl w-full">
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Processing Your Photo...</h2>
            <p className="text-gray-600">Please wait while we save and share your photo</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <>
            {/* Success icon */}
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-primary-600 to-pink-600 rounded-full p-6 mb-4">
                <svg
                  className="w-16 h-16 text-white"
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
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                {status === 'success' ? 'All Done!' : 'Oops!'}
              </h2>
              <p className="text-gray-600 text-lg">
                {status === 'success'
                  ? 'Your photo has been saved successfully'
                  : 'We encountered some issues'}
              </p>
            </div>

            {/* Status items */}
            <div className="space-y-4 mb-8">
              <StatusItem
                icon={downloadStatus === 'success' ? 'check' : downloadStatus === 'error' ? 'error' : 'pending'}
                title="Photo Download"
                description={
                  downloadStatus === 'success'
                    ? 'Your photo has been downloaded to your device'
                    : downloadStatus === 'error'
                    ? 'Download failed - click below to try again'
                    : 'Downloading...'
                }
                status={downloadStatus}
              />

              <StatusItem
                icon={telegramStatus === 'success' ? 'check' : telegramStatus === 'error' ? 'error' : 'pending'}
                title="Telegram Gallery"
                description={
                  telegramStatus === 'success'
                    ? 'Photo shared to Telegram group successfully'
                    : telegramStatus === 'error'
                    ? 'Failed to send to Telegram group'
                    : 'Sending to Telegram...'
                }
                status={telegramStatus}
              />
            </div>

            {/* Image preview */}
            {finalImage && (
              <div className="mb-8">
                <h3 className="font-semibold text-center mb-4">Your Photo:</h3>
                <div className="rounded-xl overflow-hidden shadow-lg max-w-md mx-auto">
                  <img src={finalImage} alt="Final photo" className="w-full h-auto" />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {downloadStatus === 'error' && (
                <button onClick={handleManualDownload} className="btn-secondary">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Photo
                </button>
              )}

              <button onClick={onViewGallery} className="btn-secondary">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                View Gallery
              </button>

              <button onClick={onStartOver} className="btn-primary">
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
                Create Another
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface StatusItemProps {
  icon: 'check' | 'error' | 'pending';
  title: string;
  description: string;
  status: 'pending' | 'success' | 'error';
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, title, description, status }) => {
  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
      <div className="mr-4 mt-1">
        {icon === 'check' && (
          <div className="bg-green-500 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {icon === 'error' && (
          <div className="bg-red-500 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {icon === 'pending' && (
          <div className="bg-gray-400 rounded-full p-2 animate-pulse">
            <div className="w-5 h-5"></div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
