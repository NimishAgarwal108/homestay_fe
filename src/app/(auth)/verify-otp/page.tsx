"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import VerifyOTPClient from "./verifyOtpClient";

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-lg">
          Loading...
        </div>
      }
    >
      <VerifyOTPClient/>
    </Suspense>
  );
}
