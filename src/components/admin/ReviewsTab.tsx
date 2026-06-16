import { api } from '@/lib/api-client';
import { Review } from '@/types/admin';
import { Eye, EyeOff, Loader, MessageSquareQuote, Plus, Star, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Typography from '../layout/Typography';

interface ReviewsTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function ReviewsTab({ onSuccess, onError }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.reviews.getAll();
      if (response.success && response.data) {
        const data = (response.data as any).data || response.data;
        setReviews(Array.isArray(data) ? data : []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError('File must be an image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('Image must be less than 10MB');
      return;
    }

    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setCustomerName('');
    setReviewText('');
    setRating(5);
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !reviewText.trim() || !screenshotFile) {
      onError('Please fill all fields and upload a screenshot');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No authentication token found');

      // 1. Upload screenshot using existing gallery upload endpoint
      const formData = new FormData();
      formData.append('image', screenshotFile);
      formData.append('category', 'reviews');
      formData.append('useCloudinary', 'true');

      const uploadResponse = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Screenshot upload failed');
      }

      // 2. Create review record with the uploaded URL
      const createResponse = await api.reviews.create({
        customerName: customerName.trim(),
        reviewText: reviewText.trim(),
        rating,
        screenshotUrl: uploadData.url,
        publicId: uploadData.publicId
      });

      if (!createResponse.success) {
        throw new Error(createResponse.error || 'Failed to save review');
      }

      onSuccess('✅ Review added successfully!');
      resetForm();
      await loadReviews();
    } catch (err: any) {
      console.error('Add review error:', err);
      onError(err.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (review: Review) => {
    setTogglingId(review._id);
    try {
      const response = await api.reviews.togglePublish(review._id);
      if (!response.success) throw new Error(response.error || 'Failed to update review');
      setReviews(prev => prev.map(r => r._id === review._id ? { ...r, isPublished: !r.isPublished } : r));
      onSuccess(`Review ${!review.isPublished ? 'published' : 'hidden'} successfully!`);
    } catch (err: any) {
      onError(err.message || 'Failed to update review');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`Delete review from ${review.customerName}?`)) return;

    setDeletingId(review._id);
    try {
      const response = await api.reviews.delete(review._id);
      if (!response.success) throw new Error(response.error || 'Failed to delete review');
      setReviews(prev => prev.filter(r => r._id !== review._id));
      onSuccess('Review deleted successfully!');
    } catch (err: any) {
      onError(err.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif">
      <div>
        <Typography varient='h2' className="text-2xl font-bold">Customer Reviews</Typography>
        <Typography varient='paragraph' className="text-sm text-gray-600 mt-1">
          {reviews.length} review(s) — add WhatsApp reviews from your guests
        </Typography>
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 border space-y-4">
        <Typography varient='h3' className="text-lg font-semibold">Add New Review</Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. Rahul Sharma"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  disabled={submitting}
                >
                  <Star
                    size={24}
                    className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Review Text (what they wrote on WhatsApp)</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            placeholder="Type or paste the review message here..."
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="review-screenshot"
            disabled={submitting}
          />
          <label
            htmlFor="review-screenshot"
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 ${submitting ? 'opacity-50' : ''}`}
          >
            {screenshotPreview ? (
              <img src={screenshotPreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <Plus size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload screenshot</span>
              </>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
          {submitting ? 'Adding...' : 'Add Review'}
        </button>
      </form>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <MessageSquareQuote size={48} className="mx-auto text-gray-300 mb-4" />
          <Typography varient='paragraph' className="text-gray-500">No reviews yet</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow border group">
              <div className="relative h-56">
                <img
                  src={review.screenshotUrl}
                  alt={`Review from ${review.customerName}`}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-2 transition-all">
                  <button
                    onClick={() => handleToggle(review)}
                    disabled={togglingId === review._id}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    title={review.isPublished ? 'Hide from website' : 'Show on website'}
                  >
                    {togglingId === review._id ? (
                      <Loader size={18} className="animate-spin" />
                    ) : review.isPublished ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(review)}
                    disabled={deletingId === review._id}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {deletingId === review._id ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
                {!review.isPublished && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gray-800/80 text-white text-xs rounded">
                    Hidden
                  </div>
                )}
              </div>

              <div className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <Typography varient='paragraph' className="text-sm font-semibold">{review.customerName}</Typography>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <Typography varient='paragraph' className="text-sm text-gray-600 line-clamp-2">
                  {review.reviewText}
                </Typography>
                <Typography varient='paragraph' className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
