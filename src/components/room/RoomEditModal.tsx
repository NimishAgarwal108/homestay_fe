import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary';
import { Image as ImageIcon, Loader, Save, Trash2, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import Typography from '../layout/Typography';

interface Room {
  _id: string;
  name: string;
  type: 'deluxe' | 'suite' | 'cabin' | 'standard';
  capacity: number;
  price: number;
  description?: string;
  amenities: string[];
  features: string[];
  images: string[];
  isAvailable: boolean;
}

interface RoomEditModalProps {
  room: Room;
  onClose: () => void;
  onSave: (roomId: string, updatedData: Partial<Room>) => Promise<void>;
}

interface ImageData {
  url: string;
  publicId?: string;
}

export default function RoomEditModal({ room, onClose, onSave }: RoomEditModalProps) {
  const [formData, setFormData] = useState({
    name: room.name,
    type: room.type,
    price: room.price.toString(),
    capacity: room.capacity.toString(),
    description: room.description || '',
    amenities: (room.amenities || room.features || []).join(', '),
    images: room.images.map(url => ({ url, publicId: undefined })) as ImageData[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleSubmit = async () => {
    const price = Number(formData.price);
    const capacity = Number(formData.capacity);
    
    if (!formData.price || price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    if (!formData.capacity || capacity <= 0) {
      setError('Capacity must be at least 1');
      return;
    }

    if (formData.images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      await onSave(room._id, {
        name: formData.name,
        type: formData.type,
        price,
        capacity,
        description: formData.description,
        amenities: amenitiesArray,
        features: amenitiesArray,
        images: formData.images.map(img => img.url)
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);
    setUploadProgress('');

    try {
      const newImages: ImageData[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large (max 5MB)`);
          continue;
        }

        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, 'room');
        newImages.push({
          url: result.url,
          publicId: result.publicId
        });
      }

      if (newImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
        setUploadProgress(`✓ Successfully uploaded ${newImages.length} image(s)`);
        setTimeout(() => setUploadProgress(''), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = formData.images[index];
    
    // Confirm deletion
    if (!confirm('Remove this image?')) return;

    // Delete from Cloudinary if it has a publicId
    if (imageToRemove.publicId) {
      try {
        await deleteFromCloudinary(imageToRemove.publicId);
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }

    // Remove from form data
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: url.trim(), publicId: undefined }]
      }));
    }
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const moveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return;
    const newImages = [...formData.images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <Typography varient='h3' className="text-xl font-bold text-gray-900">Edit Room</Typography>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <p className="text-red-800 text-sm flex-1">{error}</p>
              <button onClick={() => setError(null)}>
                <X size={16} className="text-red-600" />
              </button>
            </div>
          )}

          {uploadProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">{uploadProgress}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="cabin">Cabin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (Number of Guests)
              </label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setFormData({ ...formData, capacity: value });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter capacity"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Night (₹)
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setFormData({ ...formData, price: value });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter price"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              disabled={loading}
              placeholder="Enter room description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities & Features
              <span className="text-xs text-gray-500 ml-2">(separate with commas)</span>
            </label>
            <textarea
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="e.g. King Bed, Private Balcony, Mountain View, Free WiFi"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Current: {formData.amenities.split(',').filter(a => a.trim()).length} amenities
            </p>
          </div>

          {/* Room Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Room Images
              <span className="text-xs text-gray-500 ml-2">({formData.images.length} images)</span>
            </label>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.images.map((imageData, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageData.url}
                    alt={`Room ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImageUp(index)}
                        className="p-1.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-100"
                        disabled={loading}
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {index < formData.images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImageDown(index)}
                        className="p-1.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-100"
                        disabled={loading}
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
                      disabled={loading}
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded shadow">
                      Primary Image
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Buttons */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="room-image-upload"
                  disabled={loading || uploadingImages}
                />
                <label
                  htmlFor="room-image-upload"
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                    (loading || uploadingImages) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImages ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Uploading to Cloudinary...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Images (Max 5MB each)
                    </>
                  )}
                </label>
              </div>

              <button
                type="button"
                onClick={handleImageUrlAdd}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                disabled={loading || uploadingImages}
              >
                <ImageIcon size={18} />
                Add URL
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || uploadingImages}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}