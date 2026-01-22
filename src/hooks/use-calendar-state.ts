// hooks/use-calendar-state.ts
import { useState, useEffect } from 'react';
import { AvailabilityDay } from '@/types/calendar';
import { fetchRoomAvailability } from '@/lib/calendar-api';
import { generateDummyAvailability, isRangeAvailable } from '@/lib/calendar-utils';

export const useCalendarState = (
  roomId: string, 
  refreshTrigger?: number
) => {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectingCheckIn, setSelectingCheckIn] = useState<string | null>(null);
  const [selectingCheckOut, setSelectingCheckOut] = useState<string | null>(null);

  useEffect(() => {
    loadAvailability();
  }, [roomId, currentMonth, refreshTrigger]);

  useEffect(() => {
    setSelectingCheckIn(null);
    setSelectingCheckOut(null);
  }, [availability]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const data = await fetchRoomAvailability(roomId, currentMonth);
      setAvailability(data);
    } catch (error) {
      console.error('❌ Error fetching availability:', error);
      console.log('⚠️ Falling back to dummy data');
      setAvailability(generateDummyAvailability(currentMonth));
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (
    date: string, 
    available: boolean, 
    isPast: boolean,
    onDateSelect?: (checkIn: string, checkOut: string) => void
  ) => {
    console.log('🖱️ Date clicked:', { date, available, isPast });
    
    if (!available || isPast) {
      console.log('⛔ Date not clickable (unavailable or past)');
      return;
    }

    if (date === selectingCheckIn) {
      console.log('🔄 Deselecting check-in');
      setSelectingCheckIn(null);
      setSelectingCheckOut(null);
      return;
    }

    if (date === selectingCheckOut) {
      console.log('🔄 Deselecting check-out');
      setSelectingCheckOut(null);
      return;
    }

    if (!selectingCheckIn) {
      console.log('✅ Setting check-in:', date);
      setSelectingCheckIn(date);
      setSelectingCheckOut(null);
      return;
    }

    if (selectingCheckIn && !selectingCheckOut) {
      const checkIn = new Date(selectingCheckIn);
      const checkOut = new Date(date);
      
      if (checkOut <= checkIn) {
        console.log('🔄 Check-out before check-in, resetting to new check-in');
        setSelectingCheckIn(date);
        setSelectingCheckOut(null);
        return;
      }

      console.log('🔍 Checking if range is available:', selectingCheckIn, 'to', date);
      
      if (!isRangeAvailable(selectingCheckIn, date, availability)) {
        const start = new Date(selectingCheckIn);
        const end = new Date(date);
        
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          const dayAvailability = availability.find(day => day.date === dateString);
          
          if (dayAvailability && !dayAvailability.available) {
            console.log('❌ Found unavailable date in range:', dateString);
            alert(`❌ Cannot select this range. ${new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} is already booked. Please choose different dates.`);
            
            setSelectingCheckIn(null);
            setSelectingCheckOut(null);
            return;
          }
        }
      }

      console.log('✅ Setting check-out:', date);
      setSelectingCheckOut(date);
      onDateSelect?.(selectingCheckIn, date);
      return;
    }

    if (selectingCheckIn && selectingCheckOut) {
      console.log('🔄 Both dates selected, starting over with new check-in');
      setSelectingCheckIn(date);
      setSelectingCheckOut(null);
    }
  };

  const clearSelection = () => {
    setSelectingCheckIn(null);
    setSelectingCheckOut(null);
  };

  return {
    availability,
    loading,
    currentMonth,
    setCurrentMonth,
    selectingCheckIn,
    selectingCheckOut,
    handleDateClick,
    clearSelection,
  };
};