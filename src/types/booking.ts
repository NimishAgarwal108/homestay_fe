/* 🔹 Room Interface */
export interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
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
    numberOfRooms: number;
    totalPrice: number;
    status: string;
  };
}

/* 🔹 Booking Form Values */
export interface BookingFormValues {
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  numberOfRooms: number; // ✅ Required field
  name: string;
  phone: string;
  roomId: string;
  specialRequests: string;
}

/* 🔹 Booking Data for API (matches backend schema) */
export interface BookingData {
  room: string;                    // Backend expects 'room', not 'roomId'
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  numberOfRooms: number;            // ✅ Must be included
  adults: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  taxAmount: number;
  discountAmount: number;
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

/* 🔹 Availability Check Response */
export interface AvailabilityCheckResponse {
  success: boolean;
  available: boolean;
  message?: string;
  conflictingBooking?: {
    checkIn: string;
    checkOut: string;
    bookingReference: string;
  };
}