"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FloatingImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
};

const MAX_IMAGES = 8;
const SPAWN_INTERVAL = 1000;
const SPAWN_COUNT = 3;
const MAX_ATTEMPTS = 25;

export default function FloatingImageCollage() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [items, setItems] = useState<FloatingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const counterRef = useRef(0);
  const imageIndexRef = useRef(0);

  // Load images and video from API
  useEffect(() => {
    fetch('/api/gallery/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.images) {
          const imgs = data.images
            .filter((img: any) => img.category === 'gallery')
            .map((img: any) => img.url);
          
          // Check for video in gallery folder
          const video = data.images.find((img: any) => 
            img.url.includes('.mp4') || img.url.includes('.webm')
          );
          
          if (video) {
            setVideoUrl(video.url);
          } else {
            // Fallback to local video
            setVideoUrl('/gallery/AamantranStays.mp4');
          }
          
          if (imgs.length === 0) {
            setGalleryImages([
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400',
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400',
            ]);
          } else {
            setGalleryImages(imgs);
          }
        } else {
          setVideoUrl('/gallery/AamantranStays.mp4');
          setGalleryImages([
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400',
          ]);
        }
      })
      .catch(() => {
        setVideoUrl('/gallery/AamantranStays.mp4');
        setGalleryImages([
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400',
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Overlap Detection */
  const isOverlapping = (a: FloatingImage, b: FloatingImage) => {
    return !(
      a.x + a.size / 10 < b.x ||
      a.x > b.x + b.size / 10 ||
      a.y + a.size / 10 < b.y ||
      a.y > b.y + b.size / 10
    );
  };

  /* Create Non-Overlapping Image */
  const createImage = useRef((existing: FloatingImage[]): FloatingImage | null => {
    if (!galleryImages.length) return null;
    
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      const size = 180 + Math.random() * 180;
      const img: FloatingImage = {
        id: `img-${counterRef.current++}`,
        src: galleryImages[imageIndexRef.current++ % galleryImages.length],
        x: Math.random() * (100 - size / 10),
        y: Math.random() * (100 - size / 10),
        size,
        rotate: -12 + Math.random() * 24,
      };

      if (!existing.some((e) => isOverlapping(e, img))) {
        return img;
      }
      attempts++;
    }
    return null;
  });

  // Update createImage function when galleryImages changes
  useEffect(() => {
    createImage.current = (existing: FloatingImage[]): FloatingImage | null => {
      if (!galleryImages.length) return null;
      
      let attempts = 0;
      while (attempts < MAX_ATTEMPTS) {
        const size = 180 + Math.random() * 180;
        const img: FloatingImage = {
          id: `img-${counterRef.current++}`,
          src: galleryImages[imageIndexRef.current++ % galleryImages.length],
          x: Math.random() * (100 - size / 10),
          y: Math.random() * (100 - size / 10),
          size,
          rotate: -12 + Math.random() * 24,
        };

        if (!existing.some((e) => isOverlapping(e, img))) {
          return img;
        }
        attempts++;
      }
      return null;
    };
  }, [galleryImages]);

  /* Start spawning after images load */
  useEffect(() => {
    if (!galleryImages.length) return;

    // Initial batch
    setItems(() => {
      const batch: FloatingImage[] = [];
      for (let i = 0; i < 3; i++) {
        const img = createImage.current(batch);
        if (img) batch.push(img);
      }
      return batch;
    });

    // Continuous spawning
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        for (let i = 0; i < SPAWN_COUNT; i++) {
          const img = createImage.current(next);
          if (img) next.push(img);
        }
        return next.slice(-MAX_IMAGES);
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [galleryImages]);

  if (loading) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Video Element - Fixed on the right side */}
      {videoUrl && (
        <div 
          className="absolute top-1/2 right-8 -translate-y-1/2 z-10"
          style={{
            width: '400px',
            height: '300px',
          }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-white/80 bg-gray-200">
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Floating Images */}
      {items.map((img) => (
        <div
          key={img.id}
          className="absolute animate-fade"
          style={{
            left: `${img.x}%`,
            top: `${img.y}%`,
            width: img.size,
            height: img.size,
            transform: `rotate(${img.rotate}deg)`,
          }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border-4 border-white/80 bg-gray-200">
            <Image
              src={img.src}
              alt="Gallery image"
              fill
              sizes="200px"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}