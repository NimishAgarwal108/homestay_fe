// src/app/(auth)/verify-otp/page.tsx
import { Suspense } from 'react';
import VerifyOTPClient from './verifyOtpClient';

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyOTPClient />
    </Suspense>
  );
}