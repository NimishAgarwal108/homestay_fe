export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: 'homestay_rooms'
};

/**
 * Upload image via your server-side API (RECOMMENDED)
 * This avoids CORS issues and keeps your API secret secure
 */
export async function uploadToCloudinary(
  file: File, 
  category: string = 'gallery'
): Promise<{ url: string; publicId: string }> {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('useCloudinary', 'true');

    const response = await fetch('/api/gallery/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    return {
      url: data.url,
      publicId: data.publicId
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  category: string = 'gallery',
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ url: string; publicId: string }>> {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
    const result = await uploadToCloudinary(files[i], category);
    results.push(result);
  }

  return results;
}

/**
 * Delete image from Cloudinary (via your API)
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch('/api/gallery/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        imageUrl: `cloudinary://${publicId}`, // Dummy URL, publicId is what matters
        publicId 
      })
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Get optimized image URL
 * Cloudinary automatically optimizes images!
 */
export function getOptimizedImageUrl(url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string {
  if (!url.includes('cloudinary.com')) return url;

  const transformations = [];
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  const transform = transformations.join(',');
  return url.replace('/upload/', `/upload/${transform}/`);
}