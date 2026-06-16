"use client";

import { MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Typography from "../layout/Typography";

interface ReviewItem {
  _id: string;
  customerName: string;
  reviewText: string;
  rating: number;
  screenshotUrl: string;
  createdAt: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setReviews(data.data);
        }
      })
      .catch((err) => console.error("Failed to load reviews:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-12 font-serif">
      <div className="w-full flex flex-col items-center">
        <Typography varient="h2" className="text-3xl font-bold mb-2 text-center">
          What Our Guests Say
        </Typography>
        <Typography varient="paragraph" className="text-gray-600 mb-8 text-center">
          Real reviews from real guests on WhatsApp
        </Typography>

        <div className="w-full sm:w-[95%] lg:w-[80%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <Typography varient="paragraph" className="font-semibold">
                  {review.customerName}
                </Typography>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              <Typography varient="paragraph" className="text-sm text-gray-700">
                {review.reviewText}
              </Typography>

              <div className="relative w-full aspect-[9/16] max-h-80 rounded-xl overflow-hidden border">
                <Image
                  src={review.screenshotUrl}
                  alt={`WhatsApp review from ${review.customerName}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-1 text-green-600 text-xs">
                <MessageCircle size={14} />
                <span>via WhatsApp</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
