"use client";

import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import Typography from "../Typography";
import { initialValues, bookingSchema } from "./booking/validation";
import { useBookingForm } from "./booking/useBookingForm";
import RoomSelector from "./booking/RoomSelector";
import DateSelector from "./booking/DateSelector";
import GuestDetails from "./booking/GuestDetails";
import NotificationPopup from "./booking/NotificationPopup";

const BookingForm = () => {
  const {
    mounted,
    showPopup,
    popupMessage,
    popupType,
    isSubmitting,
    rooms,
    showCalendar,
    setShowCalendar,
    selectedRoomId,
    isCheckingAvailability,
    calendarRefreshKey,
    formikRef,
    handleRoomChange,
    handleDateSelect,
    handleSubmit,
  } = useBookingForm();

  if (!mounted) return null;

  return (
    <>
      <section
        id="booking"
        className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#C9A177] via-[#C9A177]/90 to-[#BFC7DE]"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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

          {/* Booking Form */}
          <Formik
            initialValues={{ ...initialValues, roomId: selectedRoomId }}
            enableReinitialize={true}
            validationSchema={bookingSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
          >
            {({ values, setFieldValue }) => {
              // Update formik ref
              useEffect(() => {
                formikRef.current = { setFieldValue };
              }, [setFieldValue]);
              
              // Sync selected room when it changes from outside
              useEffect(() => {
                if (selectedRoomId && selectedRoomId !== values.roomId) {
                  setFieldValue('roomId', selectedRoomId);
                }
              }, [selectedRoomId, setFieldValue]);

              return (
                <Form className="bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#BFC7DE]/40 space-y-8">
                  
                  {/* Form Title */}
                  <div className="text-center">
                    <Typography variant="h3" textColor="primary" weight="bold">
                      Reservation Details
                    </Typography>
                  </div>

                  {/* Room Selection */}
                  <RoomSelector 
                    rooms={rooms}
                    onRoomChange={(roomId) => handleRoomChange(roomId, setFieldValue)}
                  />

                  {/* Date Selection */}
                  <DateSelector
                    selectedRoomId={selectedRoomId}
                    showCalendar={showCalendar}
                    setShowCalendar={setShowCalendar}
                    onDateSelect={(checkIn, checkOut) => handleDateSelect(checkIn, checkOut, setFieldValue)}
                    selectedCheckIn={values.checkIn}
                    selectedCheckOut={values.checkOut}
                    refreshTrigger={calendarRefreshKey}
                  />

                  {/* Guest Details */}
                  <GuestDetails />

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
              );
            }}
          </Formik>
        </div>
      </section>

      {/* Notification Popup */}
      <NotificationPopup 
        show={showPopup}
        type={popupType}
        message={popupMessage}
      />
    </>
  );
};

export default BookingForm;