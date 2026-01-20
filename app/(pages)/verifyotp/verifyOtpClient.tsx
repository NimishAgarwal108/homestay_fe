"use client";

import URL from "@/app/constant";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOTPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Email handling (safe for build)
  const emailFromUrl = searchParams?.get("email");
  const emailFromSession =
    typeof window !== "undefined"
      ? sessionStorage.getItem("resetEmail")
      : null;

  const email = emailFromUrl || emailFromSession || "";
  const isOtpValid = otp.length === 6;

  // ✅ Store email from URL
  useEffect(() => {
    if (emailFromUrl) {
      sessionStorage.setItem("resetEmail", emailFromUrl);
    }
  }, [emailFromUrl]);

  // ✅ Redirect if email missing
  useEffect(() => {
    if (!email) {
      setError("Email not found. Redirecting...");
      setTimeout(() => router.push("/forgotpassword"), 2000);
    }
  }, [email, router]);

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    if (!isOtpValid || !email) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      if (data.resetToken) {
        sessionStorage.setItem("resetToken", data.resetToken);
      }

      sessionStorage.setItem("resetEmail", email);
      setSuccess(true);

      setTimeout(() => {
        router.push("/resetpassword");
      }, 1500);
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOTP = async () => {
    if (!email) {
      setError("Email not found.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        setError("Failed to resend OTP");
        setIsLoading(false);
        return;
      }

      setOtp("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Resend failed. Try later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border bg-white/90 p-6">
        <CardHeader className="space-y-4 text-center">
          <Image src={URL.LOGO} alt="Logo" width={120} height={120} />

          <Typography variant="h2" weight="bold">
            OTP Verification
          </Typography>

          <Typography variant="paragraph" textColor="secondary">
            Enter the OTP sent to{" "}
            <strong className="text-[#7570BC]">{email}</strong>
          </Typography>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded text-sm">
              {otp.length === 6
                ? "OTP verified successfully!"
                : "OTP sent successfully!"}
            </div>
          )}

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading || success}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            className="w-full"
            disabled={!isOtpValid || isLoading || success}
            onClick={handleVerifyOTP}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <button
            className="text-sm text-[#7570BC] font-semibold"
            onClick={handleResendOTP}
            disabled={isLoading}
          >
            Resend OTP
          </button>

          <Button
            variant="outline"
            onClick={() => router.push("/forgotpassword")}
          >
            Back to Forgot Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
