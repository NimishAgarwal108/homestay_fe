import { useState, useEffect, useRef } from "react";
import { publicApi } from "@/lib/api-clients";
import { Room, BookingFormValues, PopupType } from "./types";
import { fetchRooms, checkAvailability, calculateNights, prepareBookingData } from "./utils";

export const useBookingForm = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<PopupType>("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);
  
  const formikRef = useRef<any>(null);

  /* 🔹 Initialize and setup event listeners */
  useEffect(() => {
    setMounted(true);
    loadRooms();
    
    const handleRoomSelected = (event: CustomEvent) => {
      const { roomId } = event.detail;
      console.log('🎯 Room selected from Rooms component:', roomId);
      
      setSelectedRoomId(roomId);
      setShowCalendar(true);
      
      if (formikRef.current?.setFieldValue) {
        formikRef.current.setFieldValue('roomId', roomId);
      }
    };
    
    window.addEventListener('roomSelected', handleRoomSelected as EventListener);
    
    const storedRoomId = sessionStorage.getItem('selectedRoomId');
    if (storedRoomId) {
      console.log('🎯 Pre-selected room from storage:', storedRoomId);
      setSelectedRoomId(storedRoomId);
      setShowCalendar(true);
      sessionStorage.removeItem('selectedRoomId');
    }
    
    return () => {
      window.removeEventListener('roomSelected', handleRoomSelected as EventListener);
    };
  }, []);

  /* 🔹 Retry loading rooms if empty */
  useEffect(() => {
    if (mounted && rooms.length === 0) {
      const timer = setTimeout(() => {
        loadRooms();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, rooms.length]);

  /* 🔹 Load available rooms */
  const loadRooms = async () => {
    const roomsData = await fetchRooms();
    setRooms(roomsData);
  };

  /* 🔹 Handle room selection change */
  const handleRoomChange = (roomId: string, setFieldValue: any) => {
    setFieldValue('roomId', roomId);
    setSelectedRoomId(roomId);
    if (roomId) {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
    }
  };

  /* 🔹 Handle date selection from calendar */
  const handleDateSelect = (checkIn: string, checkOut: string, setFieldValue: any) => {
    setFieldValue('checkIn', checkIn);
    setFieldValue('checkOut', checkOut);
  };

  /* 🔹 Handle form submission */
  const handleSubmit = async (values: BookingFormValues, { resetForm }: any) => {
    setIsSubmitting(true);

    try {
      let availableRooms = rooms;
      
      if (availableRooms.length === 0) {
        availableRooms = await fetchRooms();
        setRooms(availableRooms);
        
        if (availableRooms.length === 0) {
          throw new Error("Unable to load rooms. Please refresh the page and try again.");
        }
      }

      setIsCheckingAvailability(true);
      const isAvailable = await checkAvailability(values.roomId, values.checkIn, values.checkOut);
      setIsCheckingAvailability(false);
      
      if (!isAvailable) {
        throw new Error("Selected dates are not available. Please choose different dates.");
      }

      const nights = calculateNights(values.checkIn, values.checkOut);
      
      if (nights < 1) {
        throw new Error("Booking must be for at least 1 night");
      }
      
      const selectedRoom = availableRooms.find(room => room._id === values.roomId);
      
      if (!selectedRoom) {
        throw new Error("Please select a room.");
      }

      const bookingData = prepareBookingData(values, selectedRoom);

      console.log('📤 Sending booking data:', bookingData);

      const response = await publicApi.bookings.create(bookingData);

      console.log('📥 Booking response:', response);

      if (response.success) {
        setPopupType("success");
        setPopupMessage(`🎉 Booking confirmed! Reference: ${response.booking?.bookingReference || 'Pending'}. We'll contact you at ${values.phone} soon!`);
        resetForm();
        setSelectedRoomId("");
        setShowCalendar(false);
        setCalendarRefreshKey(prev => prev + 1);
        
        setTimeout(() => setShowPopup(false), 6000);
      } else {
        throw new Error(response.error || response.message || "Failed to submit booking");
      }
    } catch (error: any) {
      console.error("❌ Booking submission error:", error);
      
      let errorMessage = error.message || "Failed to submit booking. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setPopupType("error");
      setPopupMessage(`❌ ${errorMessage}`);
      
      setTimeout(() => setShowPopup(false), 7000);
    } finally {
      setIsSubmitting(false);
      setIsCheckingAvailability(false);
      setShowPopup(true);
    }
  };

  return {
    mounted,
    showPopup,
    popupMessage,
    popupType,
    isSubmitting,
    rooms,
    showCalendar,
    setShowCalendar,
    selectedRoomId,
    isCheckingAvailability,
    calendarRefreshKey,
    formikRef,
    handleRoomChange,
    handleDateSelect,
    handleSubmit,
  };
};