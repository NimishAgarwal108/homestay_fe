"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function FoodMenuSlider() {
  const [menuImages, setMenuImages] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load dining images from gallery API
  useEffect(() => {
    fetch('/api/gallery/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.images) {
          // Filter only dining category images
          const diningImgs = data.images
            .filter((img: any) => img.category === 'dining')
            .map((img: any) => img.url);
          
          // Fallback to beautiful food placeholders if no images uploaded yet
          if (diningImgs.length === 0) {
            const fallbackImages = [
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600',
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600',
              'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600',
              'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600',
            ];
            setMenuImages(fallbackImages);
            setItems([...fallbackImages, ...fallbackImages]);
          } else {
            setMenuImages(diningImgs);
            setItems([...diningImgs, ...diningImgs]);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load dining images:', err);
        // Fallback images
        const fallbackImages = [
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600',
        ];
        setMenuImages(fallbackImages);
        setItems([...fallbackImages, ...fallbackImages]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Slider animation
  useEffect(() => {
    if (loading || items.length === 0) return;

    const interval = setInterval(() => {
      if (!sliderRef.current || isTransitioning) return;

      setIsTransitioning(true);

      // Move by ONE IMAGE (25%)
      sliderRef.current.style.transition = "transform 1s ease-in-out";
      sliderRef.current.style.transform = "translateX(-25%)";

      setTimeout(() => {
        if (!sliderRef.current) return;

        // Reset position
        sliderRef.current.style.transition = "none";
        sliderRef.current.style.transform = "translateX(0)";

        // Rotate array
        setItems((prev) => {
          const first = prev[0];
          return [...prev.slice(1), first];
        });

        setIsTransitioning(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [isTransitioning, loading, items.length]);

  if (loading) {
    return (
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#734746] to-[#7570BC] animate-pulse" />
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div
        ref={sliderRef}
        className="flex h-full w-full"
      >
        {items.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative w-[25%] h-full flex-shrink-0"
          >
            <Image
              src={src}
              alt={`Food background ${(index % menuImages.length) + 1}`}
              fill
              className="object-cover"
              priority={index < 8}
              sizes="25vw"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
    </div>
  );
}