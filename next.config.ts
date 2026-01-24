import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Works fine for both dev and prod
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  reactStrictMode: true,
  
  // Example: Different settings based on environment
  // compress: isProd, // Only compress in production
};

export default nextConfig;