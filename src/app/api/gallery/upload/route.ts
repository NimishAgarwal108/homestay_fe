// ALSO UPDATE PhotosTab.tsx line 84:
// Change: formData.append('useCloudinary', 'false');
// To:     formData.append('useCloudinary', 'true');

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * POST /api/gallery/upload
 * Upload image to gallery folder (Cloudinary or local)
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
    const useCloudinary = formData.get('useCloudinary') === 'true';

    console.log('📤 Upload request:', { 
      filename: file?.name, 
      category, 
      useCloudinary,
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

    // Validate file size (max 10MB for gallery)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    let publicUrl: string;
    let publicId: string | undefined;

    if (useCloudinary && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log('☁️ Uploading to Cloudinary...');
      // Upload to Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      // 🔥 FIXED: Only use upload_preset, NO folder parameter
      // The preset already has "homestay" as asset folder
      const result = await cloudinary.uploader.upload(dataUri, {
        upload_preset: 'homestay_uploads',
        // ❌ REMOVED: folder: `homestay/${category}`,
        // The preset handles the folder automatically
      });

      publicUrl = result.secure_url;
      publicId = result.public_id;
      console.log('✅ Cloudinary upload success:', publicUrl);
    } else {
      console.log('💾 Uploading to local filesystem...');
      // Upload to local public folder
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

      publicUrl = `/${uploadFolder}/${filename}`;
      publicId = undefined;
      
      console.log('✅ Local upload success:', publicUrl);
      console.log('📍 File saved to:', filepath);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicId,
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