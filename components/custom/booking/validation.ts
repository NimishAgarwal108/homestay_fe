import * as Yup from "yup";
import { BookingFormValues } from "./types";

/* 🔹 Initial Form Values */
export const initialValues: BookingFormValues = {
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