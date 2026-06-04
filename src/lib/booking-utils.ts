import { publicApi } from "@/lib/api-client";
import { BookingData, BookingFormValues, Room, RoomsResponse } from "@/types/booking";

/* 🔹 Calculate number of nights between dates */
export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return nights;
};

/* 🔹 Check room availability for selected dates with room count */
export const checkAvailability = async (
  roomId: string, 
  checkIn: string, 
  checkOut: string,
  requestedRooms: number = 1
): Promise<boolean> => {
  if (!roomId || !checkIn || !checkOut) {
    console.warn('⚠️ Missing parameters for availability check');
    return false;
  }
  
  try {
    console.log('🔍 Checking availability:', { roomId, checkIn, checkOut, requestedRooms });
    const response = await publicApi.rooms.checkDateAvailability(roomId, checkIn, checkOut);
    
    if (response.success && response.data) {
      const availableRooms = response.data.availableRooms || 0;
      const isEnoughRooms = availableRooms >= requestedRooms;
      
      console.log('✅ Availability result:', {
        available: response.data.available,
        availableRooms,
        requestedRooms,
        isEnoughRooms
      });
      
      return response.data.available && isEnoughRooms;
    }
    
    console.warn('⚠️ Unexpected availability response:', response);
    return false;
  } catch (error) {
    console.error("❌ Error checking availability:", error);
    return false;
  }
};

/* 🔹 Fetch available rooms */
export const fetchRooms = async (): Promise<Room[]> => {
  try {
    console.log('📡 Fetching rooms...');
    const response = await publicApi.rooms.getAll() as RoomsResponse;
    
    if (response.success) {
      let roomsData: Room[] = [];
      
      // Handle different response structures
      if (response.rooms && Array.isArray(response.rooms)) {
        roomsData = response.rooms;
      } else if (response.data && 'rooms' in response.data && Array.isArray(response.data.rooms)) {
        roomsData = response.data.rooms;
      } else if (response.data && Array.isArray(response.data)) {
        roomsData = response.data;
      }
      
      console.log('✅ Fetched rooms:', roomsData.length);
      return roomsData;
    }
    
    console.warn('⚠️ Room fetch unsuccessful:', response);
    return [];
  } catch (error) {
    console.error("❌ Error fetching rooms:", error);
    return [];
  }
};

/* 🔹 Prepare booking data for API submission - ONLY BASE + 5% GST */
export const prepareBookingData = (
  values: BookingFormValues,
  selectedRoom: Room
): BookingData => {
  // Calculate nights
  const nights = calculateNights(values.checkIn, values.checkOut);
  
  // Get price per night
  const pricePerNight = Number(selectedRoom.price) || 3500;
  
  // ✅ SIMPLIFIED PRICING: Base + 5% GST ONLY
  const basePrice = pricePerNight * nights * values.numberOfRooms;
  const gstAmount = Math.round(basePrice * 0.05); // 5% GST
  const totalPrice = basePrice + gstAmount; // No discounts

  // Calculate adults
  const adults = values.guests - values.children;

  // Clean phone number (remove non-digits)
  const cleanPhone = values.phone.replace(/\D/g, '');

  console.log('💰 Pricing Breakdown (Base + 5% GST ONLY):', {
    roomName: selectedRoom.name,
    pricePerNight,
    nights,
    numberOfRooms: values.numberOfRooms,
    basePrice,
    gstAmount,
    gstRate: '5%',
    totalPrice,
    guests: values.guests,
    adults,
    children: values.children
  });

  // Prepare booking data matching backend schema
  const bookingData: BookingData = {
    room: selectedRoom._id,
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    guests: Number(values.guests),
    children: Number(values.children) || 0,
    numberOfRooms: Number(values.numberOfRooms),
    adults: Number(adults),
    guestName: values.name.trim(),
    guestEmail: `${cleanPhone}@guest.com`, // Auto-generate email from phone
    guestPhone: cleanPhone,
    nights: Number(nights),
    pricePerNight: Number(pricePerNight),
    totalPrice: Number(totalPrice),
    gstAmount: Number(gstAmount), // Changed from taxAmount
    paymentStatus: "pending",
    status: "confirmed",
    specialRequests: values.specialRequests 
      ? values.specialRequests.substring(0, 500).trim()
      : ""
  };

  console.log('📤 Final booking payload:', bookingData);
  
  return bookingData;
};

/* 🔹 Format date for display */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/* 🔹 Validate booking dates */
export const validateBookingDates = (checkIn: string, checkOut: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!checkIn || !checkOut) {
    return { isValid: false, error: "Both check-in and check-out dates are required" };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return { isValid: false, error: "Check-in date cannot be in the past" };
  }

  if (checkOutDate <= checkInDate) {
    return { isValid: false, error: "Check-out date must be after check-in date" };
  }

  const nights = calculateNights(checkIn, checkOut);
  if (nights < 1) {
    return { isValid: false, error: "Booking must be for at least 1 night" };
  }

  return { isValid: true };
};

/* 🔹 Format price for display */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/* 🔹 Calculate pricing breakdown for display */
export const calculatePricingBreakdown = (
  pricePerNight: number,
  nights: number,
  numberOfRooms: number
) => {
  const basePrice = pricePerNight * nights * numberOfRooms;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;

  return {
    basePrice,
    gstAmount,
    gstRate: '5%',
    totalPrice
  };
};
