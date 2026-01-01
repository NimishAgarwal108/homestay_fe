"use client";

import URL from "@/app/constant";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

/* ------------------ Validation Schema ------------------ */
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character")
    .required("Password is required"),

  rememberMe: Yup.boolean(),
});

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  /* ------------------ Formik Setup ------------------ */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log("Login Data:", values);
      // API call
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-6">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
           <div className="flex justify-center mb-2">
            <Image
              src={URL.LOGO}
              alt="Homestay Logo"
              width={200}
              height={200}
              priority
            />
          </div>
          </div>

          <Typography variant="h2" textColor="primary" weight="bold" align="center">
            Welcome To Aamantran
          </Typography>

          <CardDescription className="text-center">
            <Typography variant="muted" textColor="secondary">
              Sign in to manage your Aamantran Home Stay
            </Typography>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Typography variant="label" weight="semibold">
                  Email Address
                </Typography>
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-11 h-12 border-2"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                <Typography variant="label" weight="semibold">
                  Password
                </Typography>
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 border-2"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {/* Single Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7570BC] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex justify-between items-center">
              <button className="text-sm text-[#7570BC] font-semibold cursor-pointer"
              onClick={()=>router.push('/forgotpassword')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#7570BC] hover:bg-[#C59594] cursor-pointer"
            >
              Sign In
            </Button>

            {/* Back Home */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 cursor-pointer"
              onClick={() => router.push("/")}
            >
               <Image
              src={URL.LOGO}
              alt="Homestay Logo"
              width={30}
              height={30}
              priority
            />
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
