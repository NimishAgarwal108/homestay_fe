import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

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

    // Track filenames already added from Cloudinary to avoid local duplicates
    const cloudinaryFilenames = new Set<string>();
    let cloudinaryAvailable = false;

    // ── 1. CLOUDINARY ──────────────────────────────────────────────
    try {
      const [heroResult, galleryResult] = await Promise.all([
        cloudinary.api.resources({
          type: 'upload',
          prefix: 'homestay/hero',
          max_results: 500,
          context: true,
          tags: true,
        }),
        cloudinary.api.resources({
          type: 'upload',
          prefix: 'homestay/gallery',
          max_results: 500,
          context: true,
          tags: true,
        }),
      ]);

      cloudinaryAvailable = true;

      for (const resource of heroResult.resources) {
        const filename = resource.public_id.split('/').pop() ?? resource.public_id;
        cloudinaryFilenames.add(filename);
        images.push({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.original_filename || filename,
          category: 'hero',
          uploadedAt: resource.created_at,
          publicId: resource.public_id,
          source: 'cloudinary',
        });
      }

      for (const resource of galleryResult.resources) {
        const filename = resource.public_id.split('/').pop() ?? resource.public_id;
        cloudinaryFilenames.add(filename);
        images.push({
          id: resource.public_id,
          url: resource.secure_url,
          title: resource.original_filename || filename,
          category: 'gallery',
          uploadedAt: resource.created_at,
          publicId: resource.public_id,
          source: 'cloudinary',
        });
      }

      console.log(`☁️ Cloudinary: ${images.length} images (hero + gallery)`);
    } catch (cloudinaryError: any) {
      console.warn('⚠️ Cloudinary fetch failed, falling back to local:', cloudinaryError.message);
    }

    // ── 2. LOCAL FILESYSTEM (skip files already in Cloudinary) ─────
    // Only used as fallback when Cloudinary is unavailable, OR for files
    // that were uploaded locally and not yet migrated to Cloudinary.
    const folders = [
      { path: 'hero', category: 'hero' },
      { path: 'gallery', category: 'gallery' },
    ];

    for (const folder of folders) {
      const folderPath = path.join(process.cwd(), 'public', folder.path);
      if (!existsSync(folderPath)) continue;

      try {
        const files = await readdir(folderPath);

        for (const file of files) {
          if (!/\.(jpg|jpeg|png|gif|webp|svg|jfif)$/i.test(file)) continue;

          // Skip this file if Cloudinary already has it (avoids duplicates)
          if (cloudinaryAvailable && cloudinaryFilenames.has(file)) continue;

          const filePath = path.join(folderPath, file);
          const stats = await stat(filePath);

          images.push({
            id: `local-${folder.category}-${file}`,
            url: `/${folder.path}/${file}`,
            title: file,
            category: folder.category,
            uploadedAt: stats.mtime.toISOString(),
            source: 'local',
          });
        }
      } catch (err) {
        console.warn(`⚠️ Could not read local folder ${folder.path}:`, err);
      }
    }

    // Sort newest first
    images.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    console.log(`📊 Total gallery images returned: ${images.length}`);

    return NextResponse.json({ success: true, images, count: images.length });
  } catch (error: any) {
    console.error('❌ Gallery list error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}