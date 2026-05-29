import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * DELETE /api/gallery/delete
 * Deletes a hero or gallery image from Cloudinary (preferred) or local filesystem.
 */
export async function DELETE(request: NextRequest) {
  try {
    // ── Auth check ──────────────────────────────────────────────────
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, publicId } = body as { imageUrl?: string; publicId?: string };

    console.log('🗑️ Delete request — publicId:', publicId, '| imageUrl:', imageUrl);

    if (!imageUrl && !publicId) {
      return NextResponse.json(
        { success: false, error: 'Either imageUrl or publicId is required' },
        { status: 400 }
      );
    }

    // ── Case 1: Cloudinary image ────────────────────────────────────
    // Use publicId when available; also detect cloudinary URLs without publicId
    const isCloudinaryUrl = imageUrl?.includes('cloudinary.com') || imageUrl?.startsWith('cloudinary://');

    if (publicId) {
      console.log('☁️ Deleting from Cloudinary:', publicId);
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('☁️ Cloudinary destroy result:', result);

        if (result.result === 'ok' || result.result === 'not found') {
          return NextResponse.json({ success: true, deleted: 'cloudinary' });
        }

        return NextResponse.json(
          { success: false, error: `Cloudinary returned: ${result.result}` },
          { status: 500 }
        );
      } catch (err: any) {
        console.error('❌ Cloudinary delete error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    // ── Case 2: Local filesystem image ─────────────────────────────
    if (imageUrl && !isCloudinaryUrl) {
      try {
        // imageUrl is like "/hero/filename.jpg" or "/gallery/filename.jpg"
        const urlPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

        // Safety guard: only allow deleting from hero/ and gallery/ folders
        const normalised = path.normalize(urlPath);
        if (!normalised.startsWith('/hero/') && !normalised.startsWith('/gallery/')) {
          return NextResponse.json(
            { success: false, error: 'Can only delete from hero or gallery folders' },
            { status: 403 }
          );
        }

        const filepath = path.join(process.cwd(), 'public', normalised);
        console.log('💾 Deleting local file:', filepath);

        await unlink(filepath);
        return NextResponse.json({ success: true, deleted: 'local' });
      } catch (err: any) {
        console.error('❌ Local delete error:', err);

        // ENOENT = already gone, still report success
        if (err.code === 'ENOENT') {
          return NextResponse.json({ success: true, deleted: 'local-already-missing' });
        }

        return NextResponse.json(
          { success: false, error: 'Failed to delete local file' },
          { status: 500 }
        );
      }
    }

    // ── Case 3: Cloudinary URL but no publicId provided ─────────────
    // Shouldn't happen with correct frontend, but handle gracefully
    if (isCloudinaryUrl && !publicId) {
      console.warn('⚠️ Cloudinary URL but no publicId — cannot delete without publicId');
      return NextResponse.json(
        { success: false, error: 'publicId is required to delete Cloudinary images' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Nothing to delete' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Delete route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}