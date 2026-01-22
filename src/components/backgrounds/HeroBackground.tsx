"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

export default function HeroBackgroundCarousel() {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery/list')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.images) {
          const heroImgs = data.images
            .filter((img: any) => img.category === 'hero')
            .map((img: any) => img.url);
          
          if (heroImgs.length === 0) {
            setHeroImages([
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080',
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080',
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080',
            ]);
          } else {
            setHeroImages(heroImgs);
          }
        } else {
          setHeroImages([
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080',
          ]);
        }
      })
      .catch(err => {
        console.error('Failed to load hero images:', err);
        setHeroImages([
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080',
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#734746] to-[#7570BC] animate-pulse" />
    );
  }

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Fade(),
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
        }),
      ]}
      className="absolute inset-0 z-0"
    >
      <CarouselContent className="h-full">
        {heroImages.map((src, index) => (
          <CarouselItem key={index} className="h-screen">
            <div
              className="h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{ backgroundImage: `url(${src})` }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}