/* 🔹 Room Interface */
export interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number; // ✅ Total number of physical rooms
  description?: string;
  amenities?: string[];
  images?: string[];
  isAvailable?: boolean;
}

/* 🔹 API Response Interfaces */
export interface RoomsResponse {
  success: boolean;
  count?: number;
  rooms?: Room[];
  data?: {
    rooms?: Room[];
  } | Room[];
  error?: string;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  error?: string;
  booking?: {
    _id: string;
    bookingReference: string;
    room: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    children: number;
    numberOfRooms: number;
    totalPrice: number;
    status: string;
    guestName: string;
    guestPhone: string;
  };
}

/* 🔹 Booking Form Values (Frontend) */
export interface BookingFormValues {
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  numberOfRooms: number;
  name: string;
  phone: string;
  roomId: string;
  specialRequests: string;
}

/* 🔹 Booking Data for API Submission (matches backend schema exactly) */
export interface BookingData {
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  numberOfRooms: number;
  adults: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  gstAmount: number; // ✅ CHANGED from taxAmount to gstAmount (5% GST)
  paymentStatus: "pending" | "paid" | "refunded";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests: string;
}

/* 🔹 Popup State */
export type PopupType = "success" | "error";

/* 🔹 Availability Check Request */
export interface AvailabilityCheckRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  excludeBookingId?: string;
}

/* 🔹 Date Availability Response - ✅ FIXED WITH NEW FIELDS */
export interface DateAvailabilityResponse {
  available: boolean;
  availableRooms: number;  // ✅ NEW: How many rooms are available
  totalRooms: number;      // ✅ NEW: Total rooms of this type
  bookedRooms: number;     // ✅ NEW: How many rooms are booked
  message?: string;
  conflictingBooking?: {
    checkIn: Date;
    checkOut: Date;
    status: string;
  } | null;
}

/* 🔹 Availability Check Response - Same as DateAvailabilityResponse */
export interface AvailabilityCheckResponse extends DateAvailabilityResponse {
  success?: boolean;
}

/* 🔹 Room Capacity Constants */
export const ROOM_CAPACITY = {
  "Family Suite": 9,
  "Deluxe Mountain View": 6,
  "Cozy Mountain Cabin": 3,
} as const;

export const MAX_ROOMS_PER_TYPE = {
  "Family Suite": 3,
  "Deluxe Mountain View": 2,
  "Cozy Mountain Cabin": 1,
} as const;

/* 🔹 Booking for Display/Admin */
export interface Booking {
  _id: string;
  room: Room | string;
  checkIn: Date | string;
  checkOut: Date | string;
  guests: number;
  children: number;
  numberOfRooms: number;
  adults?: number;
  totalPrice: number;
  pricePerNight: number;
  gstAmount: number; // ✅ CHANGED from taxAmount to gstAmount (5% GST)
  discountAmount: number; // Always 0 - no discounts
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "cash" | "card" | "upi" | "online";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingReference: string;
  nights: number;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/* 🔹 Date Validation Result */
export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

/* 🔹 Pricing Breakdown for Display */
export interface PricingBreakdown {
  basePrice: number;
  gstAmount: number;
  gstRate: string;
  totalPrice: number;
}
