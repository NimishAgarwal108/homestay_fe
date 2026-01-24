"use client";

import Typography from "@/components/layout/Typography";
import { BookingFormValues } from "@/types/booking";
import { ErrorMessage, Field, useFormikContext } from "formik";

const GuestDetails = () => {
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();

  // ✅ Auto-calculate number of rooms based on guests (3 guests per room)
  const calculateRooms = (guests: number): number => {
    if (guests <= 0) return 1;
    return Math.min(Math.ceil(guests / 3), 6); // Max 6 rooms
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newGuests = value === '' ? 0 : parseInt(value);
    setFieldValue('guests', newGuests);
    
    // Auto-adjust children if needed
    if (values.children > newGuests) {
      setFieldValue('children', newGuests);
    }

    // ✅ Auto-calculate rooms
    const calculatedRooms = calculateRooms(newGuests);
    setFieldValue('numberOfRooms', calculatedRooms);
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newChildren = value === '' ? 0 : parseInt(value);
    if (newChildren <= values.guests) {
      setFieldValue('children', newChildren);
    }
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newRooms = value === '' ? 1 : Math.min(parseInt(value), 6);
    setFieldValue('numberOfRooms', newRooms);
  };

  const adults = values.guests - values.children;

  return (
    <div className="space-y-5">
      {/* Guests, Children, and Rooms - Grid Layout */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Total Guests *
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="guests"
            value={values.guests || ''}
            placeholder="e.g. 5"
            onChange={handleGuestsChange}
            className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
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
            Children *
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="children"
            value={values.children || ''}
            placeholder="e.g. 2"
            onChange={handleChildrenChange}
            className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <ErrorMessage name="children">
            {(msg) => (
              <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                {msg}
              </Typography>
            )}
          </ErrorMessage>
        </div>

        {/* ✅ NEW: Number of Rooms Field */}
        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Rooms *
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="numberOfRooms"
            value={values.numberOfRooms || ''}
            placeholder="e.g. 2"
            onChange={handleRoomsChange}
            max={6}
            className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <ErrorMessage name="numberOfRooms">
            {(msg) => (
              <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                {msg}
              </Typography>
            )}
          </ErrorMessage>
          {/* ✅ Helper text */}
          <Typography variant="small" textColor="primary" className="mt-1 text-gray-500 text-xs">
            Max 6 rooms (auto-calculated: ~3 guests/room)
          </Typography>
        </div>
      </div>

      {/* Guest Summary Badge - Enhanced */}
      {values.guests > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Typography variant="small" textColor="primary" weight="semibold" className="text-gray-900">
                Booking Summary
              </Typography>
              <Typography variant="small" textColor="primary" className="text-xs text-gray-600">
                {adults} Adult{adults !== 1 ? 's' : ''} • {values.children} Child{values.children !== 1 ? 'ren' : ''} • {values.numberOfRooms} Room{values.numberOfRooms !== 1 ? 's' : ''}
              </Typography>
            </div>
            <div className="text-right">
              <Typography varient='paragraph' className="text-3xl font-bold text-blue-600">{values.guests}</Typography>
              <Typography variant="small" textColor="primary" className="text-xs text-gray-500">
                Total Guests
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Name and Phone - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default GuestDetails;