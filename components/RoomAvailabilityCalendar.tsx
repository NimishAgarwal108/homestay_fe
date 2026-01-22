// components/RoomAvailabilityCalendar.tsx
import React from 'react';
import { RoomAvailabilityCalendarProps } from '../types/calendar';
import { useCalendarState } from '../hooks/useCalendarState';
import { 
  groupByWeeks, 
  getMonthName, 
  isDateInRange, 
  isDateSelected, 
  isPastDate, 
  isTodayDate 
} from '../lib/calendarUtils';
import {
  CalendarHeader,
  CalendarDay,
  CalendarLegend,
  SelectionInfo,
  InstructionBanner,
} from '../components/calendar/CalendarComponents';

const RoomAvailabilityCalendar: React.FC<RoomAvailabilityCalendarProps> = ({
  roomId,
  onDateSelect,
  refreshTrigger,
}) => {
  const {
    availability,
    loading,
    currentMonth,
    setCurrentMonth,
    selectingCheckIn,
    selectingCheckOut,
    handleDateClick,
    clearSelection,
  } = useCalendarState(roomId, refreshTrigger);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const weeks = groupByWeeks(availability);
  const monthName = getMonthName(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <InstructionBanner />

      <CalendarHeader
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthName={monthName}
      />

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-xs font-semibold text-gray-600 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day.date) {
                return <div key={dayIndex} className="aspect-square" />;
              }

              const date = new Date(day.date);
              const dayNumber = date.getDate();
              const isSelected = isDateSelected(day.date, selectingCheckIn, selectingCheckOut);
              const inRange = isDateInRange(day.date, selectingCheckIn, selectingCheckOut);
              const isToday = isTodayDate(day.date);
              const isPast = isPastDate(day.date);

              return (
                <CalendarDay
                  key={day.date}
                  date={day.date}
                  dayNumber={dayNumber}
                  available={day.available}
                  isSelected={isSelected}
                  inRange={inRange}
                  isToday={isToday}
                  isPast={isPast}
                  onClick={() => handleDateClick(day.date, day.available && !isPast, isPast, onDateSelect)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <CalendarLegend />

      <SelectionInfo
        checkIn={selectingCheckIn}
        checkOut={selectingCheckOut}
        onClear={clearSelection}
      />
    </div>
  );
};

export default RoomAvailabilityCalendar;