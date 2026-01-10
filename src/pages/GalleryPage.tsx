import { useEffect, useState, useCallback } from 'react';
import { fetchGalleryPhotos, subscribeToGalleryPhotos } from '@/lib/supabase';

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  date: Date;
  fullName: string;
  themeSelected: string;
}

interface GalleryPageProps {
  onStartNew: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPhotoPopup, setNewPhotoPopup] = useState<GalleryPhoto | null>(null);

  // Transform photo data helper
  const transformPhoto = useCallback((item: any): GalleryPhoto => ({
    id: item.id,
    url: item.image_url,
    caption: item.caption,
    date: new Date(item.created_at),
    fullName: item.full_name,
    themeSelected: item.theme_selected,
  }), []);

  useEffect(() => {
    loadPhotos();
  }, []);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing gallery...');
      loadPhotos();
    }, 900000); // 15 minutes (900 seconds)

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Real-time subscription for new photos
  useEffect(() => {
    const eventId = import.meta.env.VITE_EVENT_ID;
    if (!eventId) {
      console.warn('No event ID found, real-time updates disabled');
      return;
    }

    const unsubscribe = subscribeToGalleryPhotos(
      eventId,
      (newPhoto) => {
        const transformedPhoto = transformPhoto(newPhoto);
        setPhotos((prevPhotos) => {
          // Prevent duplicates
          if (prevPhotos.some(p => p.id === transformedPhoto.id)) {
            return prevPhotos;
          }

          // Show popup for new photo
          setNewPhotoPopup(transformedPhoto);

          // Hide popup and add to gallery after 3 seconds
          setTimeout(() => {
            setNewPhotoPopup(null);
          }, 3000);

          // Prepend new photo (newest first)
          return [transformedPhoto, ...prevPhotos];
        });
      },
      (error) => {
        console.error('Real-time subscription error:', error);
        setError('Real-time updates temporarily unavailable');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [transformPhoto]);

  const loadPhotos = async () => {
    try {
      setLoading(true);

      // Fetch photos from Supabase gallery
      const eventId = import.meta.env.VITE_EVENT_ID;
      const galleryData = await fetchGalleryPhotos(eventId);

      if (galleryData.length === 0) {
        setPhotos([]);
        setLoading(false);
        return;
      }

      // Transform data to GalleryPhoto format using helper
      const transformedPhotos: GalleryPhoto[] = galleryData.map(transformPhoto);

      setPhotos(transformedPhotos);
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="inline-block w-16 h-16 border-8 border-gray-700 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={loadPhotos}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return <div className="min-h-screen bg-black"></div>;
  }

  // Ensure we have enough photos to fill the screen by duplicating
  const minPhotosNeeded = 15; // Enough to fill 1 row
  let allPhotos = [...photos];
  while (allPhotos.length < minPhotosNeeded) {
    allPhotos = [...allPhotos, ...photos];
  }

  return (
    <div className="h-screen bg-black overflow-hidden flex items-center justify-center relative">
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes popIn {
          0% {
            transform: scale(0) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .scroll-left {
          animation: scrollLeft 60s linear infinite;
        }
        .pop-in {
          animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Single Row - Scrolling Left */}
      <div className="overflow-hidden w-full">
        <div className="flex gap-4 scroll-left">
          {/* Duplicate photos for seamless loop */}
          {[...allPhotos, ...allPhotos].map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="flex-shrink-0 h-[80vh] w-auto aspect-[9/16] overflow-hidden rounded-lg"
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* New Photo Popup Overlay */}
      {newPhotoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 pointer-events-none">
          <div className="pop-in max-w-md w-full px-4">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={newPhotoPopup.url}
                alt="New photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
