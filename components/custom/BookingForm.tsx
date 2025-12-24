"use client";

import { formFields } from "@/app/constant";
import { useEffect, useState } from "react";
import Typography from "../Typography";

const BookingForm = () => {
  // 🔹 Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔹 Form state
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    meals: "breakfast",
  });

  // 🔹 Handle input changes
  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  // 🔹 Handle submit
  const handleBookingSubmit = () => {
    const { checkIn, checkOut, name, email, phone } = bookingData;

    if (!checkIn || !checkOut || !name || !email || !phone) {
      alert("Please fill in all required fields");
      return;
    }

    alert("Booking request submitted! We will contact you shortly.");
  };

  // 🔹 Avoid SSR hydration issues
  if (!mounted) return null;

  return (
    <section
      id="booking"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#C9A177]"
      suppressHydrationWarning
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <Typography
            variant="h2"
            textColor="offWhite"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Book Your Stay
          </Typography>
          <Typography variant="paragraph" textColor="cream" align="center">
            Reserve your mountain escape today
          </Typography>
        </div>

        {/* Form Card */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {formFields.map((field) => (
              <div key={field.name}>
                <Typography
                  variant="label"
                  textColor="primary"
                  className="block mb-2"
                >
                  {field.label}
                </Typography>

                {/* SELECT */}
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={
                      bookingData[field.name as keyof typeof bookingData]
                    }
                    onChange={handleBookingChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none"
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
                  </select>
                ) : (
                  /* INPUT */
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      bookingData[field.name as keyof typeof bookingData]
                    }
                    placeholder={field.placeholder}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleBookingSubmit}
            className="w-full bg-[#7570BC] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#C59594] transition-all transform hover:scale-105 shadow-lg"
          >
            <Typography variant="paragraph" textColor="white" weight="semibold">
              Confirm Booking
            </Typography>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
