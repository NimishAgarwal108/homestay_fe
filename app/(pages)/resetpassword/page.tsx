"use client";

import URL from "@/app/constant";
import { Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* =======================
   YUP VALIDATION SCHEMA
======================= */
const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[@$!%*?&#]/, "Must include a special character"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  confirmAction: Yup.boolean().oneOf(
    [true],
    "You must confirm before continuing"
  ),
});

function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-6">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <Image src={URL.LOGO} alt="Homestay Logo" width={120} height={120} onClick={()=>router.push("/")} className="cursor-pointer"/>
          </div>

          <Typography variant="h2" textColor="primary" weight="bold" align="center">
            Reset Password
          </Typography>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
              confirmAction: false,
            }}
            validationSchema={ResetPasswordSchema}
            
            onSubmit={(values) => {
              console.log(values);
              // TODO: API call
              router.push("/login");
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isValid,
            }) => (
              <Form className="space-y-6">
                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    <Typography variant="label" textColor="secondary" weight="semibold">
                      New Password
                    </Typography>
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-11 pr-11 h-12 border-2 border-[#BFC7DE]"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    {/* SINGLE TOGGLE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7570BC]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {touched.password && errors.password && (
                    <Typography variant="small" textColor="primary">
                      {errors.password}
                    </Typography>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    <Typography variant="label" textColor="secondary" weight="semibold">
                      Confirm Password
                    </Typography>
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7570BC]" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="pl-11 pr-11 h-12 border-2 border-[#BFC7DE]"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {touched.confirmPassword && errors.confirmPassword && (
                    <Typography variant="small" textColor="primary">
                      {errors.confirmPassword}
                    </Typography>
                  )}
                </div>

                {/* CONFIRM CHECKBOX */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="confirmAction"
                    checked={values.confirmAction}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-[#BFC7DE]"
                  />
                  <Typography variant="small" textColor="secondary">
                    I confirm to set this password
                  </Typography>
                </label>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#7570BC] hover:bg-[#6a66b0]"
                  disabled={!isValid || !values.confirmAction}
                  onClick={()=>router.push("/")}
                >
                  Set Password
                </Button>

              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
