"use client";

import { Field, ErrorMessage, useFormikContext } from "formik";
import { BookingFormValues } from "./types";
import Typography from "../../Typography";

const GuestDetails = () => {
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newGuests = value === '' ? 0 : parseInt(value);
    setFieldValue('guests', newGuests);
    
    if (values.children > newGuests) {
      setFieldValue('children', newGuests);
    }
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newChildren = value === '' ? 0 : parseInt(value);
    if (newChildren <= values.guests) {
      setFieldValue('children', newChildren);
    }
  };

  const adults = values.guests - values.children;

  return (
    <div className="space-y-5">
      {/* Guests and Children - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Guest Summary Badge - Compact */}
      {values.guests > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">👥</span>
              </div>
              <div>
                <Typography variant="small" textColor="primary" weight="semibold" className="text-gray-900">
                  Guest Summary
                </Typography>
                <Typography variant="small" textColor="primary" className="text-xs text-gray-600">
                  {adults} Adult{adults !== 1 ? 's' : ''} • {values.children} Child{values.children !== 1 ? 'ren' : ''}
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{values.guests}</p>
              <Typography variant="small" textColor="primary" className="text-xs text-gray-500">
                Total
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