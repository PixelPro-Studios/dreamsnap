import { useEffect, useState } from 'react';
import { fetchGalleryPhotos } from '@/lib/supabase';

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

  useEffect(() => {
    loadPhotos();
  }, []);

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

      // Transform data to GalleryPhoto format
      const transformedPhotos: GalleryPhoto[] = galleryData.map((item: any) => ({
        id: item.id,
        url: item.image_url,
        caption: item.caption,
        date: new Date(item.created_at),
        fullName: item.full_name,
        themeSelected: item.theme_selected,
      }));

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

  if (photos.length === 0) {
    return <div className="min-h-screen bg-black"></div>;
  }

  // Ensure we have enough photos to fill the screen by duplicating
  const minPhotosNeeded = 20; // Enough to fill 2 rows
  let allPhotos = [...photos];
  while (allPhotos.length < minPhotosNeeded) {
    allPhotos = [...allPhotos, ...photos];
  }

  // Split photos into two rows for alternating scroll
  const midpoint = Math.ceil(allPhotos.length / 2);
  const row1Photos = allPhotos.slice(0, midpoint);
  const row2Photos = allPhotos.slice(midpoint);

  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col justify-center relative">
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scrollRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .scroll-left {
          animation: scrollLeft 40s linear infinite;
        }
        .scroll-right {
          animation: scrollRight 40s linear infinite;
        }
      `}</style>

      {/* Row 1 - Scrolling Left */}
      <div className="overflow-hidden mb-4">
        <div className="flex gap-4 scroll-left">
          {/* Duplicate photos for seamless loop */}
          {[...row1Photos, ...row1Photos].map((photo, index) => (
            <div
              key={`row1-${photo.id}-${index}`}
              className="flex-shrink-0 h-[42vh] w-auto aspect-[9/16] overflow-hidden rounded-lg"
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

      {/* Row 2 - Scrolling Right */}
      <div className="overflow-hidden">
        <div className="flex gap-4 scroll-right">
          {/* Duplicate photos for seamless loop */}
          {[...row2Photos, ...row2Photos].map((photo, index) => (
            <div
              key={`row2-${photo.id}-${index}`}
              className="flex-shrink-0 h-[42vh] w-auto aspect-[9/16] overflow-hidden rounded-lg"
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

      {/* Centered overlay text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-white font-black text-8xl tracking-wider uppercase opacity-90 drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">
          Free AI Photobooth
        </h1>
      </div>
    </div>
  );
};
