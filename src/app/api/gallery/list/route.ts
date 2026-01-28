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
    // 1. FETCH FROM CLOUDINARY
    // ========================================
    try {
      console.log('☁️ Fetching from Cloudinary...');
      
      // Fetch from homestay folder (your upload uses homestay/{category})
      const cloudinaryResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'homestay/',
        max_results: 500,
        context: true,
        tags: true,
      });

      console.log('📦 Cloudinary found:', cloudinaryResult.resources.length, 'images');

      cloudinaryResult.resources.forEach((resource: any) => {
        // Extract category from folder path: homestay/hero -> hero
        const pathParts = resource.public_id.split('/');
        const category = pathParts[1] || 'gallery'; // homestay/[category]/filename
        
        images.push({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.original_filename || resource.public_id.split('/').pop(),
          category: category,
          uploadedAt: resource.created_at,
          publicId: resource.public_id,
          source: 'cloudinary'
        });
      });
    } catch (cloudinaryError: any) {
      console.warn('⚠️ Cloudinary fetch failed (continuing with local):', cloudinaryError.message);
      // Continue to local files even if Cloudinary fails
    }

    // ========================================
    // 2. FETCH FROM LOCAL FILESYSTEM
    // ========================================
    console.log('💾 Fetching from local filesystem...');
    
    const folders = [
      { path: 'hero', category: 'hero' },
      { path: 'food', category: 'dining' },
      { path: 'gallery', category: 'gallery' }
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

    console.log('📊 Total images:', images.length, '(Cloudinary + Local)');

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