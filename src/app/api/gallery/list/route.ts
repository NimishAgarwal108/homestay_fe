import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const images: Array<{
      id: string;
      url: string;
      title: string;
      category: string;
      uploadedAt: string;
      publicId?: string;
      source?: 'cloudinary' | 'local';
    }> = [];

    // ========================================
    // 1. FETCH FROM CLOUDINARY (EXCLUDE ROOM IMAGES)
    // ========================================
    try {
      console.log('☁️ Fetching from Cloudinary...');
      
      // Fetch ONLY hero and gallery images from Cloudinary
      // Fetch hero images
      const heroResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'homestay/hero',
        max_results: 500,
        context: true,
        tags: true,
      });

      console.log('📦 Cloudinary hero images:', heroResult.resources.length);

      heroResult.resources.forEach((resource: any) => {
        images.push({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.original_filename || resource.public_id.split('/').pop(),
          category: 'hero',
          uploadedAt: resource.created_at,
          publicId: resource.public_id,
          source: 'cloudinary'
        });
      });

      // Fetch gallery images
      const galleryResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'homestay/gallery',
        max_results: 500,
        context: true,
        tags: true,
      });

      console.log('📦 Cloudinary gallery images:', galleryResult.resources.length);

      galleryResult.resources.forEach((resource: any) => {
        images.push({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.original_filename || resource.public_id.split('/').pop(),
          category: 'gallery',
          uploadedAt: resource.created_at,
          publicId: resource.public_id,
          source: 'cloudinary'
        });
      });

      // NOTE: We're NOT fetching homestay/room images here
      console.log('ℹ️ Skipping room images (they belong to rooms, not gallery)');

    } catch (cloudinaryError: any) {
      console.warn('⚠️ Cloudinary fetch failed (continuing with local):', cloudinaryError.message);
      // Continue to local files even if Cloudinary fails
    }

    // ========================================
    // 2. FETCH FROM LOCAL FILESYSTEM (ONLY hero and gallery folders)
    // ========================================
    console.log('💾 Fetching from local filesystem...');
    
    const folders = [
      { path: 'hero', category: 'hero' },
      { path: 'gallery', category: 'gallery' }
      // NOT including 'room' folder - room images stay with rooms
    ];

    for (const folder of folders) {
      const folderPath = path.join(process.cwd(), 'public', folder.path);
      
      if (!existsSync(folderPath)) {
        console.log(`ℹ️ Folder not found: ${folder.path}`);
        continue;
      }
      
      try {
        const files = await readdir(folderPath);
        
        for (const file of files) {
          if (/\.(jpg|jpeg|png|gif|webp|svg|jfif)$/i.test(file)) {
            const filePath = path.join(folderPath, file);
            const stats = await stat(filePath);
            
            images.push({
              id: `local-${folder.category}-${file}`,
              url: `/${folder.path}/${file}`,
              title: file,
              category: folder.category,
              uploadedAt: stats.mtime.toISOString(),
              source: 'local'
            });
          }
        }
      } catch (error) {
        console.warn(`⚠️ Failed to read ${folder.path}:`, error);
        continue;
      }
    }

    console.log('📊 Total images (hero + gallery only):', images.length);

    // Sort by upload date (newest first)
    images.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      images,
      count: images.length
    });

  } catch (error: any) {
    console.error('❌ Gallery list error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}