import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * GET /api/gallery/list
 * List all images from public folders
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Make this API public (no auth required for listing images)
    // This allows the main website to load images without authentication
    
    const images: Array<{
      id: string;
      url: string;
      title: string;
      category: string;
      uploadedAt: string;
    }> = [];

    // Define folders to scan
    const folders = [
      { path: 'hero', category: 'hero' },
      { path: 'food', category: 'dining' },
      { path: 'gallery', category: 'gallery' }
    ];

    for (const folder of folders) {
      const folderPath = path.join(process.cwd(), 'public', folder.path);
      
      // Skip if folder doesn't exist
      if (!existsSync(folderPath)) {
        console.log(`📁 Skipping '${folder.path}' folder (doesn't exist)`);
        continue;
      }
      
      try {
        const files = await readdir(folderPath);
        
        for (const file of files) {
          // Only include image files
          if (/\.(jpg|jpeg|png|gif|webp|svg|jfif)$/i.test(file)) {
            const filePath = path.join(folderPath, file);
            const stats = await stat(filePath);
            
            images.push({
              id: `${folder.category}-${file}`,
              url: `/${folder.path}/${file}`,
              title: file,
              category: folder.category,
              uploadedAt: stats.mtime.toISOString()
            });
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not read folder ${folder.path}:`, error);
        // Continue with other folders
      }
    }

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
    console.error('❌ List error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}