import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const images: Array<{
      id: string;
      url: string;
      title: string;
      category: string;
      uploadedAt: string;
    }> = [];

    const folders = [
      { path: 'hero', category: 'hero' },
      { path: 'food', category: 'dining' },
      { path: 'gallery', category: 'gallery' }
    ];

    for (const folder of folders) {
      const folderPath = path.join(process.cwd(), 'public', folder.path);
      
      if (!existsSync(folderPath)) continue;
      
      try {
        const files = await readdir(folderPath);
        
        for (const file of files) {
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
        continue;
      }
    }

    images.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      images,
      count: images.length
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}