"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Photos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all gallery images
    fetch('/api/gallery/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.images) {
          // Get gallery category images
          const galleryImgs = data.images.filter((img: any) => img.category === 'gallery');
          
          if (galleryImgs.length === 0) {
            // Fallback to beautiful placeholders
            setPhotos([
              { id: '1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600', title: 'Beautiful View' },
              { id: '2', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600', title: 'Cozy Room' },
              { id: '3', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600', title: 'Mountain View' },
              { id: '4', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600', title: 'Relaxing Space' },
              { id: '5', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600', title: 'Garden Area' },
              { id: '6', url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600', title: 'Dining Area' },
            ]);
          } else {
            setPhotos(galleryImgs);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load photos:', err);
        setPhotos([
          { id: '1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600', title: 'Beautiful View' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-[#734746]/20 to-[#7570BC]/20 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            style={{
              animation: `fadeInUp 0.5s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
            }}
          >
            <Image
              src={photo.url}
              alt={photo.title || `Gallery photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Overlay with title on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white font-semibold text-sm md:text-base">
                {photo.title || `Photo ${index + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {photos.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No photos yet. Upload images via the admin dashboard!
          </p>
        </div>
      )}

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}