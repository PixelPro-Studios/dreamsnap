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

export const GalleryPage: React.FC<GalleryPageProps> = ({ onStartNew }) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError('Failed to load photos from gallery');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Wall of Fame...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-pink-50 p-4">
        <div className="card max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadPhotos} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Wall of Fame
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            {photos.length > 0
              ? `${photos.length} amazing ${photos.length === 1 ? 'photo' : 'photos'} from our community`
              : 'No photos yet. Be the first to create magic!'}
          </p>
          <button onClick={onStartNew} className="btn-primary">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Your Own
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="card max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Photos Yet</h3>
            <p className="text-gray-600">
              Start creating amazing AI-transformed photos and they'll appear here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group transform transition-transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Gallery photo'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {photo.caption && (
                      <p className="text-white text-sm font-medium line-clamp-2">{photo.caption}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating action button */}
      <button
        onClick={onStartNew}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary-600 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110"
        title="Create your photo"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Gallery photo'}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            {selectedPhoto.caption && (
              <div className="mt-4 bg-white/10 backdrop-blur-md rounded-lg p-4">
                <p className="text-white text-center">{selectedPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
