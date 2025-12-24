"use client";

import { galleryImages } from "@/app/constant";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FloatingImage = {
  id: string;
  src: string;
  x: number;     // percentage
  y: number;     // percentage
  size: number;  // px
  rotate: number;
};

const MAX_IMAGES = 8;
const SPAWN_INTERVAL = 1000; // faster spawn
const SPAWN_COUNT = 3;       // spawn 2 images together
const MAX_ATTEMPTS = 25;     // collision retries

export default function FloatingImageCollage() {
  const [items, setItems] = useState<FloatingImage[]>([]);
  const counterRef = useRef(0);
  const imageIndexRef = useRef(0);

  /* ---------- Overlap Detection ---------- */
  const isOverlapping = (a: FloatingImage, b: FloatingImage) => {
    return !(
      a.x + a.size / 10 < b.x ||
      a.x > b.x + b.size / 10 ||
      a.y + a.size / 10 < b.y ||
      a.y > b.y + b.size / 10
    );
  };

  /* ---------- Create Non-Overlapping Image ---------- */
  const createImage = (
    existing: FloatingImage[]
  ): FloatingImage | null => {
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

  /* ---------- Lifecycle ---------- */
  useEffect(() => {
    if (!galleryImages?.length) return;

    // Initial fast batch
    setItems(() => {
      const batch: FloatingImage[] = [];
      for (let i = 0; i < 3; i++) {
        const img = createImage(batch);
        if (img) batch.push(img);
      }
      return batch;
    });

    // Interval batch spawn
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];

        for (let i = 0; i < SPAWN_COUNT; i++) {
          const img = createImage(next);
          if (img) next.push(img);
        }

        return next.slice(-MAX_IMAGES);
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              priority
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}
