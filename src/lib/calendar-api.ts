// src/lib/calendar-api.ts
import { AvailabilityDay } from '@/types/calendar';
import { getApiUrl } from './calendar-utils';
import { publicApi } from './api-client';

export const fetchRoomAvailability = async (
  roomId: string, 
  currentMonth: number
): Promise<AvailabilityDay[]> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + currentMonth);
  startDate.setDate(1);
  
  // Calculate end date (end of the month)
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0); // Last day of the month
  
  const API_URL = getApiUrl();
  
  const timestamp = new Date().getTime();
  const apiUrl = `${API_URL}/rooms/${roomId}/availability-calendar?startDate=${startDate.toISOString()}&_t=${timestamp}`;
  
  console.log('🔍 Fetching availability for room:', roomId);
  console.log('📅 Start date:', startDate.toISOString());
  console.log('🌐 Full API URL:', apiUrl);
  
  try {
    // ✅ STEP 1: Fetch regular availability calendar
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Server response not OK:', response.status);
      console.error('❌ Response text:', text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('📥 Raw availability data received:', data);
    
    if (!data.success) {
      console.error('❌ API returned success=false:', data.message);
      throw new Error(data.message || 'Failed to fetch availability');
    }

    let availability = data.availability || [];
    
    // ✅ STEP 2: Fetch unavailable dates (where ALL rooms are booked)
    console.log('🔴 Fetching unavailable dates for room:', roomId);
    
    const unavailableDatesResponse = await publicApi.rooms.getUnavailableDates(
      roomId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    if (unavailableDatesResponse.success && unavailableDatesResponse.data) {
      const unavailableDates = unavailableDatesResponse.data.unavailableDates || [];
      
      console.log('🔴 Unavailable dates received:', unavailableDates);
      console.log(`🔴 Total ${unavailableDates.length} dates are fully booked`);
      
      // ✅ STEP 3: Mark these dates as unavailable in the calendar
      const unavailableDateSet = new Set(unavailableDates);
      
      availability = availability.map((day: AvailabilityDay) => {
        if (unavailableDateSet.has(day.date)) {
          console.log(`🔴 Marking ${day.date} as unavailable (all rooms booked)`);
          return {
            ...day,
            available: false, // ✅ Mark as unavailable (will show RED)
          };
        }
        return day;
      });
    } else {
      console.warn('⚠️ Could not fetch unavailable dates, using default availability');
    }
    
    const availableCount = availability.filter((d: any) => d.available).length;
    const bookedCount = availability.filter((d: any) => !d.available).length;
    console.log(`✅ Available days: ${availableCount}, ❌ Booked days: ${bookedCount}`);
    
    return availability;
    
  } catch (error) {
    console.error('❌ Error in fetchRoomAvailability:', error);
    throw error;
  }
};