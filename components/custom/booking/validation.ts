import * as Yup from "yup";
import { BookingFormValues } from "./types";

/* 🔹 Initial Form Values */
export const initialValues: BookingFormValues = {
  checkIn: "",
  checkOut: "",
  guests: 1,
  children: 0, // ✅ Added: Default to 0 children
  name: "",
  phone: "",
  roomId: "",
  specialRequests: "",
};

/* 🔹 Validation Schema */
export const bookingSchema = Yup.object({
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
    .max(20, "Maximum 20 guests allowed") // ✅ Updated max limit
    .integer("Number of guests must be a whole number"),
  children: Yup.number() // ✅ Added: Children validation
    .required("Number of children is required")
    .min(0, "Number of children cannot be negative")
    .max(Yup.ref("guests"), "Number of children cannot exceed total guests")
    .integer("Number of children must be a whole number"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[+]?[0-9\s-]{10,15}$/, "Please enter a valid phone number"),
  roomId: Yup.string().required("Please select a room"),
});