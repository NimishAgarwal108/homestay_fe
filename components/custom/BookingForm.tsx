"use client";

import { formFields } from "@/app/constant";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Typography from "../Typography";

/* 🔹 Initial Values */
const initialValues = {
  checkIn: "",
  checkOut: "",
  guests: 2,
  name: "",
  email: "",
  phone: "",
  meals: "breakfast",
};

/* 🔹 Validation Schema */
const bookingSchema = Yup.object({
  checkIn: Yup.string().required("Check-in date is required"),
  checkOut: Yup.string().required("Check-out date is required"),
  guests: Yup.number().required("Guests are required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  meals: Yup.string().required("Meal preference is required"),
});

const BookingForm = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <section
        id="booking"
        className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#C9A177] via-[#C9A177]/90 to-[#BFC7DE]"
      >
        <div className="max-w-4xl mx-auto">
          {/* 🌄 Section Heading */}
          <div className="text-center mb-12">
            <Typography variant="h2" textColor="offWhite" weight="bold" align="center">
              Book Your Mountain Stay
            </Typography>
            <Typography
              variant="paragraph"
              textColor="cream"
              align="center"
              className="mt-2"
            >
              A peaceful escape surrounded by nature 🌿
            </Typography>
          </div>

          {/* 🏡 Booking Card */}
          <Formik
            initialValues={initialValues}
            validationSchema={bookingSchema}
            onSubmit={(values, { resetForm }) => {
              console.log("Booking Data:", values);
              setShowPopup(true);
              resetForm();
              setTimeout(() => setShowPopup(false), 3000);
            }}
          >
            {() => (
              <Form className="bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#BFC7DE]/40 space-y-8">
                
                {/* Card Title */}
                <div className="text-center">
                  <Typography variant="h3" textColor="primary" weight="bold">
                    Reservation Details
                  </Typography>
                  
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formFields.map((field) => (
                    <div key={field.name}>
                      <Typography
                        variant="label"
                        textColor="primary"
                        className="mb-2 block"
                      >
                        {field.label}
                      </Typography>

                      {field.type === "select" ? (
                        <Field
                          as="select"
                          name={field.name}
                          className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                        >
                          {field.options?.map((option) =>
                            typeof option === "number" ? (
                              <option key={option} value={option}>
                                {option} Guest{option > 1 ? "s" : ""}
                              </option>
                            ) : (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            )
                          )}
                        </Field>
                      ) : (
                        <Field
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                        />
                      )}

                      {/* Error */}
                      <ErrorMessage name={field.name}>
                        {(msg) => (
                          <Typography
                            variant="small"
                            textColor="primary"
                            className="mt-1"
                          >
                            {msg}
                          </Typography>
                        )}
                      </ErrorMessage>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7570BC] to-[#C59594] py-4 rounded-full hover:scale-[1.02] transition-transform shadow-xl"
                >
                  <Typography
                    variant="paragraph"
                    textColor="white"
                    weight="semibold"
                    align="center"
                  >
                    Confirm Booking
                  </Typography>
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {/* ✅ Bottom Popup */}
      {showPopup && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#7570BC] text-white px-6 py-4 rounded-2xl shadow-2xl">
            <Typography variant="paragraph" textColor="white" weight="semibold">
              🏡 Booking request submitted successfully!
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
