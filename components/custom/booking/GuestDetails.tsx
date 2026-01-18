"use client";

import { Field, ErrorMessage } from "formik";
import Typography from "../../Typography";

const GuestDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Number of Guests */}
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

      {/* Meal Plan */}
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

      {/* Full Name */}
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

      {/* Phone Number */}
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
  );
};

export default GuestDetails;