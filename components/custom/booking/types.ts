/* 🔹 Room Interface */
export interface Room {
  _id: string;
  name: string;
  price: number;
}

/* 🔹 API Response Interface */
export interface RoomsResponse {
  success: boolean;
  count?: number;
  rooms?: Room[];
  data?: {
    rooms?: Room[];
  } | Room[];
  error?: string;
}

/* 🔹 Booking Form Values */
export interface BookingFormValues {
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number; // ✅ Added: Number of children
  name: string;
  phone: string;
  roomId: string;
  specialRequests: string;
}

/* 🔹 Booking Data for API */
export interface BookingData {
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number; // ✅ Added: Number of children
  adults: number; // ✅ Added: Number of adults (calculated)
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  taxAmount: number;
  discountAmount: number;
  paymentStatus: "pending";
  status: "pending";
  specialRequests: string;
}

/* 🔹 Popup State */
export type PopupType = "success" | "error";