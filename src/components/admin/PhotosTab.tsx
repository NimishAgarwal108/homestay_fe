// src/app/api/gallery/upload/route.ts
// CORRECTED VERSION - Upload to Cloudinary or local storage

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * POST /api/gallery/upload
 * Upload image to gallery folder (local storage only)
 * 
 * NOTE: For Cloudinary uploads, use direct frontend upload instead.
 * This endpoint is for local storage fallback.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.error('❌ No token provided');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const category = formData.get('category') as string || 'gallery';

    console.log('📤 Upload request:', { 
      filename: file?.name, 
      category,
      fileSize: file?.size 
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Upload to local public folder
    console.log('💾 Uploading to local filesystem...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const filename = `${timestamp}-${originalName}`;
    
    // Map category to folder
    const folderMap: Record<string, string> = {
      hero: 'hero',
      dining: 'food',
      gallery: 'gallery',
      room: 'gallery'
    };
    
    const uploadFolder = folderMap[category] || 'gallery';
    const uploadDir = path.join(process.cwd(), 'public', uploadFolder);
    
    console.log('📁 Upload directory:', uploadDir);
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
      console.log('ℹ️ Directory already exists or created');
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/${uploadFolder}/${filename}`;
    
    console.log('✅ Local upload success:', publicUrl);
    console.log('📍 File saved to:', filepath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicId: undefined,
      category,
      filename: file.name
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}