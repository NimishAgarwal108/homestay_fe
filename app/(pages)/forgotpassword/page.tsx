"use client";

import URL from "@/app/constant";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Form, Formik } from "formik";
import * as Yup from "yup";

/* =======================
   YUP VALIDATION SCHEMA
======================= */
const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

function Login() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFC7DE]/50 via-[#C9A177]/30 to-[#BFC7DE]/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 md:top-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-[#7570BC]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-56 md:w-80 h-56 md:h-80 bg-[#C9A177]/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md md:max-w-lg shadow-2xl relative z-10 border-2 border-[#BFC7DE] bg-white/80 backdrop-blur-md p-4 md:p-6">
        <CardHeader className="space-y-4 pb-6 md:pb-8">
          <div className="flex justify-center mb-2">
            <Image
              src={URL.LOGO}
              alt="Homestay Logo"
              width={200}
              height={200}
              priority
            />
          </div>

          <Typography
            variant="h2"
            textColor="primary"
            weight="bold"
            align="center"
          >
            Want to change the ID Password!
          </Typography>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            validateOnMount
            onSubmit={(values) => {
              console.log("Send OTP to:", values.email);
              // TODO: API call to send OTP
              router.push("/verifyotp");
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
              <Form className="space-y-4 md:space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Typography
                      variant="label"
                      textColor="secondary"
                      weight="semibold"
                    >
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
                      className="pl-11 h-12 border-2 border-[#BFC7DE] focus:border-[#7570BC]"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {touched.email && errors.email && (
                    <Typography variant="small" textColor="primary">
                      {errors.email}
                    </Typography>
                  )}
                </div>

                {/* Send OTP */}
                <div className="text-center">
                  <Button
                    type="submit"
                  className="w-full h-12 bg-[#7570BC] hover:bg-[#6a66b0]"
                    disabled={!isValid}
                  >
                    Send OTP
                  </Button>
                </div>

                {/* Back to Home */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-[#BFC7DE] text-[#7570BC] hover:bg-[#BFC7DE]/20"
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
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
