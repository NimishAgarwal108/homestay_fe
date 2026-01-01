"use client";

import URL from "@/app/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const isOtpValid = otp.length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-6">
        <CardHeader className="space-y-4 pb-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={URL.LOGO}
              alt="Homestay Logo"
              width={120}
              height={120}
              priority
            />
          </div>

          <Typography
            variant="h2"
            textColor="primary"
            weight="bold"
            align="center"
          >
            OTP Verification
          </Typography>

          <Typography variant="paragraph" textColor="secondary" align="center">
            Enter the 6-digit OTP sent to your email
          </Typography>
        </CardHeader>

        <CardContent>
          <div className="space-y-6 flex flex-col items-center">
            {/* OTP INPUT */}
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="gap-3"
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-12 text-lg border-2 border-[#BFC7DE] rounded-md"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* VERIFY BUTTON */}
            <Button
              className="w-full h-12 bg-[#7570BC] hover:bg-[#6a66b0]"
              disabled={!isOtpValid}
              onClick={() => {
                // TODO: Verify OTP API
                console.log("OTP:", otp);
                router.push("/resetpassword");
              }}
            >
              Verify OTP
            </Button>

            {/* RESEND OTP */}
            <button
              type="button"
              className="text-sm text-[#7570BC] hover:text-[#C59594] font-semibold"
              onClick={() => {
                // TODO: Resend OTP API
                console.log("Resend OTP");
              }}
            >
              Resend OTP
            </button>

            {/* BACK */}
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-[#BFC7DE] text-[#7570BC]"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
