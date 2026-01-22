import { publicApi } from "@/lib/api-client";
import { Room, RoomsResponse, BookingFormValues, BookingData } from "@/types/booking";

/* 🔹 Calculate number of nights between dates */
export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/* 🔹 Check room availability for selected dates */
export const checkAvailability = async (
  roomId: string, 
  checkIn: string, 
  checkOut: string
): Promise<boolean> => {
  if (!roomId || !checkIn || !checkOut) return false;
  
  try {
    const response = await publicApi.rooms.checkDateAvailability(roomId, checkIn, checkOut);
    
    if (response.success && response.data) {
      return response.data.available;
    }
    return false;
  } catch (error) {
    console.error("Error checking availability:", error);
    return false;
  }
};

/* 🔹 Fetch available rooms */
export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const response = await publicApi.rooms.getAll() as RoomsResponse;
    
    if (response.success) {
      let roomsData: Room[] = [];
      
      if (response.rooms && Array.isArray(response.rooms)) {
        roomsData = response.rooms;
      } else if (response.data && 'rooms' in response.data && Array.isArray(response.data.rooms)) {
        roomsData = response.data.rooms;
      } else if (response.data && Array.isArray(response.data)) {
        roomsData = response.data;
      }
      
      console.log('📋 Available rooms for booking:', roomsData);
      return roomsData;
    }
    return [];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
};

/* 🔹 Prepare booking data for API submission - ✅ UPDATED to include children/adults */
export const prepareBookingData = (
  values: BookingFormValues,
  selectedRoom: Room
): BookingData => {
  const nights = calculateNights(values.checkIn, values.checkOut);
  const pricePerNight = Number(selectedRoom.price) || 3500;
  const basePrice = pricePerNight * nights;
  const taxAmount = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + taxAmount;

  // ✅ Calculate adults (total guests - children)
  const adults = values.guests - values.children;

  console.log('💰 Pricing Calculation:', {
    pricePerNight,
    nights,
    basePrice,
    taxAmount,
    totalPrice,
    guests: values.guests,
    adults,
    children: values.children
  });

  const cleanPhone = values.phone.replace(/\D/g, '');

  return {
    room: selectedRoom._id,
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    guests: Number(values.guests),
    children: Number(values.children), // ✅ Added
    adults: Number(adults), // ✅ Added
    guestName: values.name.trim(),
    guestEmail: `${cleanPhone}@guest.com`,
    guestPhone: cleanPhone,
    nights: Number(nights),
    pricePerNight: Number(pricePerNight),
    totalPrice: Number(totalPrice),
    taxAmount: Number(taxAmount),
    discountAmount: 0,
    paymentStatus: "pending",
    status: "pending",
    // ✅ REMOVED meal preference from special requests
    specialRequests: values.specialRequests 
      ? values.specialRequests.substring(0, 500).trim()
      : ""
  };
};

/* 🔹 Format date for display */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
