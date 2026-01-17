import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface AvailabilityDay {
  date: string;
  available: boolean;
}

interface RoomAvailabilityCalendarProps {
  roomId: string;
  onDateSelect?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  refreshTrigger?: number;
}

const RoomAvailabilityCalendar: React.FC<RoomAvailabilityCalendarProps> = ({
  roomId,
  onDateSelect,
  selectedCheckIn,
  selectedCheckOut,
  refreshTrigger
}) => {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectingCheckIn, setSelectingCheckIn] = useState<string | null>(null);
  const [selectingCheckOut, setSelectingCheckOut] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, [roomId, currentMonth, refreshTrigger]);

  useEffect(() => {
    setSelectingCheckIn(null);
    setSelectingCheckOut(null);
  }, [availability]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() + currentMonth);
      startDate.setDate(1);
      
      const API_URL = typeof window !== 'undefined' && (window as any).ENV?.VITE_API_URL 
        ? (window as any).ENV.VITE_API_URL 
        : 'http://localhost:3001';
      
      const apiUrl = `${API_URL}/api/rooms/${roomId}/availability-calendar?startDate=${startDate.toISOString()}`;
      
      console.log('🔍 Fetching availability for room:', roomId);
      console.log('📅 Start date:', startDate.toISOString());
      console.log('🌐 Full API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Server response not OK:', response.status);
        console.error('❌ Response text:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📥 Raw availability data received:', data);
      console.log('📥 Number of days:', data.availability?.length);
      
      if (data.success) {
        setAvailability(data.availability || []);
        
        // Log specific dates we care about
        const jan18 = data.availability?.find((d: any) => d.date === '2026-01-18');
        const jan19 = data.availability?.find((d: any) => d.date === '2026-01-19');
        const jan20 = data.availability?.find((d: any) => d.date === '2026-01-20');
        
        console.log('📅 Jan 18:', jan18);
        console.log('📅 Jan 19:', jan19);
        console.log('📅 Jan 20:', jan20);
        
        // Count available vs booked
        const availableCount = data.availability?.filter((d: any) => d.available).length;
        const bookedCount = data.availability?.filter((d: any) => !d.available).length;
        console.log(`✅ Available days: ${availableCount}, ❌ Booked days: ${bookedCount}`);
      } else {
        console.error('❌ API returned success=false:', data.message);
        setAvailability([]);
      }
    } catch (error) {
      console.error('❌ Error fetching availability:', error);
      console.log('⚠️ Falling back to dummy data');
      generateDummyAvailability();
    } finally {
      setLoading(false);
    }
  };

  const generateDummyAvailability = () => {
    console.log('⚠️ Generating dummy availability data');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + currentMonth);
    startDate.setDate(1);
    
    const daysInMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    ).getDate();
    
    const dummyData: AvailabilityDay[] = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(startDate);
      date.setDate(i + 1);
      dummyData.push({
        date: date.toISOString().split('T')[0],
        available: Math.random() > 0.3
      });
    }
    setAvailability(dummyData);
  };

  const isRangeAvailable = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const availabilityMap = new Map(
      availability.map(day => [day.date, day.available])
    );
    
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      if (!availabilityMap.get(dateString)) {
        return false;
      }
    }
    
    return true;
  };

  const handleDateClick = (date: string, available: boolean, isPast: boolean) => {
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
      
      if (!isRangeAvailable(selectingCheckIn, date)) {
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

  const isDateInRange = (date: string) => {
    if (!selectingCheckIn || !selectingCheckOut) return false;
    const current = new Date(date);
    const start = new Date(selectingCheckIn);
    const end = new Date(selectingCheckOut);
    return current >= start && current <= end;
  };

  const isDateSelected = (date: string) => {
    return date === selectingCheckIn || date === selectingCheckOut;
  };

  const groupByWeeks = (days: AvailabilityDay[]) => {
    const weeks: AvailabilityDay[][] = [];
    let currentWeek: AvailabilityDay[] = [];
    
    days.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      
      if (index === 0 && dayOfWeek !== 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: '', available: false });
        }
      }
      
      currentWeek.push(day);
      
      if (dayOfWeek === 6 || index === days.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  const getMonthName = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + currentMonth);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const weeks = groupByWeeks(availability);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          📌 <strong>How to select:</strong> Click a green date for check-in, then click another green date for check-out. 
          All dates between must be available.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
          disabled={currentMonth === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold">{getMonthName()}</h3>
        </div>
        
        <button
          onClick={() => setCurrentMonth(currentMonth + 1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => {
              if (!day.date) {
                return <div key={dayIndex} className="aspect-square" />;
              }

              const date = new Date(day.date);
              const dayNumber = date.getDate();
              const isSelected = isDateSelected(day.date);
              const inRange = isDateInRange(day.date);
              const isToday = day.date === new Date().toISOString().split('T')[0];
              const isPast = new Date(day.date) < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <button
                  key={day.date}
                  onClick={() => handleDateClick(day.date, day.available && !isPast, isPast)}
                  disabled={!day.available || isPast}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    transition-all duration-200
                    ${isPast
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : day.available 
                        ? 'bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer hover:scale-105' 
                        : 'bg-red-100 text-red-400 cursor-not-allowed line-through opacity-60'
                    }
                    ${isSelected ? 'ring-2 ring-blue-600 bg-blue-600 text-white hover:bg-blue-700' : ''}
                    ${inRange && !isSelected ? 'bg-blue-100 text-blue-800' : ''}
                    ${isToday && !isSelected ? 'ring-1 ring-gray-400' : ''}
                  `}
                  title={
                    isPast 
                      ? 'Past date' 
                      : !day.available 
                        ? 'Already booked - Not available' 
                        : isSelected 
                          ? 'Click to deselect' 
                          : 'Click to select'
                  }
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded border border-green-300"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded border border-red-300"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
          <span>Past</span>
        </div>
      </div>

      {selectingCheckIn && selectingCheckOut && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-900">
            ✅ Selected: {new Date(selectingCheckIn).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })} → {new Date(selectingCheckOut).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
          <button
            onClick={() => {
              setSelectingCheckIn(null);
              setSelectingCheckOut(null);
            }}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {selectingCheckIn && !selectingCheckOut && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900">
            📅 Check-in: {new Date(selectingCheckIn).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Now select your check-out date (must be available)
          </p>
          <button
            onClick={() => {
              setSelectingCheckIn(null);
              setSelectingCheckOut(null);
            }}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomAvailabilityCalendar;