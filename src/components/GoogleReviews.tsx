'use client';

import Script from 'next/script';

export default function GoogleReviews() {
  return (
    <div className="reviews-section py-16 font-serif">
      <h2 className="text-3xl font-bold text-center mb-8">
        Guest Reviews
      </h2>

      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />
      <div
        className="elfsight-app-e4292b5b-518d-4cd1-afce-e228cf3912b5"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}
