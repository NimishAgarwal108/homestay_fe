"use client";

import { formFields } from "@/app/constant";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Typography from "../Typography";
import { api } from "@/lib/api-clients";
import RoomAvailabilityCalendar from "../RoomAvailabilityCalendar";

/* 🔹 Room Interface */
interface Room {
  _id: string;
  name: string;
  price: number;
}

/* 🔹 API Response Interface */
interface RoomsResponse {
  success: boolean;
  count?: number;
  rooms?: Room[];
  data?: {
    rooms?: Room[];
  } | Room[];
  error?: string;
}

/* 🔹 Initial Values */
const initialValues = {
  checkIn: "",
  checkOut: "",
  guests: 2,
  meals: "Confirm Later",
  name: "",
  phone: "",
  roomId: "",
  specialRequests: "",
};

/* 🔹 Validation Schema */
const bookingSchema = Yup.object({
  checkIn: Yup.date()
    .required("Check-in date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)), 
      "Check-in date cannot be in the past"
    ),
  checkOut: Yup.date()
    .required("Check-out date is required")
    .min(Yup.ref("checkIn"), "Check-out must be after check-in"),
  guests: Yup.number()
    .required("Number of guests is required")
    .min(1, "At least 1 guest required")
    .max(6, "Maximum 6 guests allowed"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[+]?[0-9\s-]{10,15}$/, "Please enter a valid phone number"),
  meals: Yup.string().required("Meal plan is required"),
  roomId: Yup.string().required("Please select a room"),
});

const BookingForm = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  // 🆕 Add refresh trigger state
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchRooms();
  }, []);

  useEffect(() => {
    if (mounted && rooms.length === 0) {
      const timer = setTimeout(() => {
        fetchRooms();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, rooms.length]);

  const fetchRooms = async () => {
    try {
      const response = await api.rooms.getAll() as RoomsResponse;
      
      if (response.success) {
        let roomsData: Room[] = [];
        
        if (response.rooms && Array.isArray(response.rooms)) {
          roomsData = response.rooms;
        } else if (response.data && 'rooms' in response.data && Array.isArray(response.data.rooms)) {
          roomsData = response.data.rooms;
        } else if (response.data && Array.isArray(response.data)) {
          roomsData = response.data;
        }
        
        setRooms(roomsData);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const calculateNights = (checkIn: string, checkOut: string): number => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const checkAvailability = async (roomId: string, checkIn: string, checkOut: string): Promise<boolean> => {
    if (!roomId || !checkIn || !checkOut) return false;
    
    setIsCheckingAvailability(true);
    try {
      const response = await api.rooms.checkDateAvailability(roomId, checkIn, checkOut);
      
      if (response.success && response.data) {
        return response.data.available;
      }
      return false;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleDateSelect = (checkIn: string, checkOut: string, setFieldValue: any) => {
    setFieldValue('checkIn', checkIn);
    setFieldValue('checkOut', checkOut);
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);

    try {
      let availableRooms = rooms;
      
      if (availableRooms.length === 0) {
        const response = await api.rooms.getAll() as RoomsResponse;
        
        if (response.success && response.rooms && Array.isArray(response.rooms)) {
          availableRooms = response.rooms;
          setRooms(availableRooms);
        } else {
          throw new Error("Unable to load rooms. Please refresh the page and try again.");
        }
      }
      
      if (availableRooms.length === 0) {
        throw new Error("No rooms available. Please contact us directly.");
      }

      const isAvailable = await checkAvailability(values.roomId, values.checkIn, values.checkOut);
      
      if (!isAvailable) {
        throw new Error("Selected dates are not available. Please choose different dates.");
      }

      const nights = calculateNights(values.checkIn, values.checkOut);
      
      if (nights < 1) {
        throw new Error("Booking must be for at least 1 night");
      }
      
      const selectedRoom = availableRooms.find(room => room._id === values.roomId);
      
      if (!selectedRoom) {
        throw new Error("Please select a room.");
      }

      const pricePerNight = Number(selectedRoom.price) || 3500;
      const basePrice = pricePerNight * nights;
      const taxAmount = Math.round(basePrice * 0.12);
      const totalPrice = basePrice + taxAmount;

      console.log('💰 Pricing Calculation:', {
        pricePerNight,
        nights,
        basePrice,
        taxAmount,
        totalPrice
      });

      const cleanPhone = values.phone.replace(/\D/g, '');

      const bookingData = {
        room: selectedRoom._id,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guests: Number(values.guests),
        guestName: values.name.trim(),
        guestEmail: `${cleanPhone}@guest.com`,
        guestPhone: cleanPhone,
        nights: Number(nights),
        pricePerNight: Number(pricePerNight),
        totalPrice: Number(totalPrice),
        taxAmount: Number(taxAmount),
        discountAmount: 0,
        paymentStatus: "pending" as const,
        status: "pending" as const,
        specialRequests: values.specialRequests 
          ? `${values.specialRequests.substring(0, 450)} | Meal: ${values.meals}` 
          : `Meal preference: ${values.meals}`
      };

      console.log('📤 Sending booking data:', bookingData);

      const response = await api.bookings.create(bookingData);

      console.log('📥 Booking response:', response);

      if (response.success) {
        setPopupType("success");
        setPopupMessage(`🎉 Booking confirmed! Reference: ${response.booking?.bookingReference || 'Pending'}. We'll contact you at ${values.phone} soon!`);
        resetForm();
        setSelectedRoomId("");
        setShowCalendar(false);
        
        // 🆕 Trigger calendar refresh to show newly booked dates as unavailable
        setCalendarRefreshKey(prev => prev + 1);
        
        setTimeout(() => setShowPopup(false), 6000);
      } else {
        throw new Error(response.error || response.message || "Failed to submit booking");
      }
    } catch (error: any) {
      console.error("❌ Booking submission error:", error);
      
      let errorMessage = error.message || "Failed to submit booking. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setPopupType("error");
      setPopupMessage(`❌ ${errorMessage}`);
      
      setTimeout(() => setShowPopup(false), 7000);
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <section
        id="booking"
        className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#C9A177] via-[#C9A177]/90 to-[#BFC7DE]"
      >
        <div className="max-w-4xl mx-auto">
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

          <Formik
            initialValues={initialValues}
            validationSchema={bookingSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#BFC7DE]/40 space-y-8">
                
                <div className="text-center">
                  <Typography variant="h3" textColor="primary" weight="bold">
                    Reservation Details
                  </Typography>
                </div>

                {/* Room Selection */}
                <div>
                  <Typography variant="label" textColor="primary" className="mb-2 block">
                    Select Room *
                  </Typography>
                  <Field
                    as="select"
                    name="roomId"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const roomId = e.target.value;
                      setFieldValue('roomId', roomId);
                      setSelectedRoomId(roomId);
                      if (roomId) {
                        setShowCalendar(true);
                      } else {
                        setShowCalendar(false);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                  >
                    <option value="">Choose a room...</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.name} - ₹{room.price}/night
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="roomId">
                    {(msg) => (
                      <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                        {msg}
                      </Typography>
                    )}
                  </ErrorMessage>
                </div>

                {/* Calendar Section - Collapsible */}
                {showCalendar && selectedRoomId && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h4" textColor="primary" weight="semibold">
                        📅 Select Your Dates
                      </Typography>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(false)}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                      >
                        Hide Calendar
                      </button>
                    </div>
                    <RoomAvailabilityCalendar
                      roomId={selectedRoomId}
                      onDateSelect={(checkIn, checkOut) => handleDateSelect(checkIn, checkOut, setFieldValue)}
                      selectedCheckIn={values.checkIn}
                      selectedCheckOut={values.checkOut}
                      refreshTrigger={calendarRefreshKey}
                    />
                    
                    {values.checkIn && values.checkOut && (
                      <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-400">
                        <Typography variant="paragraph" textColor="primary" weight="semibold" className="text-green-800">
                          ✅ Dates Selected: {new Date(values.checkIn).toLocaleDateString()} - {new Date(values.checkOut).toLocaleDateString()}
                        </Typography>
                        <button
                          type="button"
                          onClick={() => setShowCalendar(false)}
                          className="mt-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Continue to Guest Details →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Toggle Calendar Button */}
                {selectedRoomId && !showCalendar && (
                  <button
                    type="button"
                    onClick={() => setShowCalendar(true)}
                    className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl transition-colors border-2 border-blue-300"
                  >
                    <Typography variant="paragraph" weight="semibold">
                      {values.checkIn && values.checkOut 
                        ? `📅 Change Dates (${new Date(values.checkIn).toLocaleDateString()} - ${new Date(values.checkOut).toLocaleDateString()})`
                        : '📅 Select Dates'
                      }
                    </Typography>
                  </button>
                )}

                {/* Date Display Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="label" textColor="primary" className="mb-2 block">
                      Check-in Date *
                    </Typography>
                    <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700">
                      {values.checkIn ? new Date(values.checkIn).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : "Select from calendar above"}
                    </div>
                    <ErrorMessage name="checkIn">
                      {(msg) => (
                        <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Typography variant="label" textColor="primary" className="mb-2 block">
                      Check-out Date *
                    </Typography>
                    <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700">
                      {values.checkOut ? new Date(values.checkOut).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : "Select from calendar above"}
                    </div>
                    <ErrorMessage name="checkOut">
                      {(msg) => (
                        <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* Guest Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Typography variant="label" textColor="primary" className="mb-2 block">
                      Number of Guests *
                    </Typography>
                    <Field
                      as="select"
                      name="guests"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="guests">
                      {(msg) => (
                        <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Typography variant="label" textColor="primary" className="mb-2 block">
                      Meal Plan *
                    </Typography>
                    <Field
                      as="select"
                      name="meals"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                    >
                      <option value="Confirm Later">Confirm Later</option>
                      <option value="Breakfast Only">Breakfast Only</option>
                      <option value="Breakfast + Dinner">Breakfast + Dinner</option>
                      <option value="All Meals">All Meals</option>
                      <option value="No Meals">No Meals</option>
                    </Field>
                    <ErrorMessage name="meals">
                      {(msg) => (
                        <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Typography variant="label" textColor="primary" className="mb-2 block">
                      Full Name *
                    </Typography>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                    />
                    <ErrorMessage name="name">
                      {(msg) => (
                        <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Typography variant="label" textColor="primary" className="mb-2 block">
                      Phone Number *
                    </Typography>
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                    />
                    <ErrorMessage name="phone">
                      {(msg) => (
                        <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Typography variant="label" textColor="primary" className="mb-2 block">
                    Special Requests (Optional)
                  </Typography>
                  <Field
                    as="textarea"
                    name="specialRequests"
                    rows={3}
                    placeholder="Any special requirements or requests..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isCheckingAvailability}
                  className={`w-full bg-gradient-to-r from-[#7570BC] to-[#C59594] py-4 rounded-full hover:scale-[1.02] transition-transform shadow-xl ${
                    (isSubmitting || isCheckingAvailability) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Typography variant="paragraph" textColor="white" weight="semibold" align="center">
                    {isSubmitting ? "Submitting..." : isCheckingAvailability ? "Checking Availability..." : "Confirm Booking"}
                  </Typography>
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {/* Bottom Popup */}
      {showPopup && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div
            className={`${
              popupType === "success"
                ? "bg-[#7570BC]"
                : "bg-red-500"
            } text-white px-6 py-4 rounded-2xl shadow-2xl`}
          >
            <Typography variant="paragraph" textColor="white" weight="semibold">
              {popupMessage}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;