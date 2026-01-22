// components/calendar/CalendarComponents.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  monthName: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  setCurrentMonth,
  monthName,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
        disabled={currentMonth === 0}
        className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-semibold">{monthName}</h3>
      </div>
      
      <button
        onClick={() => setCurrentMonth(currentMonth + 1)}
        className="p-1.5 rounded-lg hover:bg-gray-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

interface CalendarDayProps {
  date: string;
  dayNumber: number;
  available: boolean;
  isSelected: boolean;
  inRange: boolean;
  isToday: boolean;
  isPast: boolean;
  onClick: () => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  dayNumber,
  available,
  isSelected,
  inRange,
  isToday,
  isPast,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!available || isPast}
      className={`
        aspect-square rounded-lg flex items-center justify-center text-xs font-medium
        transition-all duration-200
        ${isPast
          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
          : available 
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
          : !available 
            ? 'Already booked - Not available' 
            : isSelected 
              ? 'Click to deselect' 
              : 'Click to select'
      }
    >
      {dayNumber}
    </button>
  );
};

export const CalendarLegend: React.FC = () => {
  return (
    <div className="mt-3 flex gap-3 text-xs flex-wrap justify-center">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 bg-green-100 rounded border border-green-300"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 bg-red-100 rounded border border-red-300"></div>
        <span>Booked</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 bg-blue-600 rounded"></div>
        <span>Selected</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
        <span>Past</span>
      </div>
    </div>
  );
};

interface SelectionInfoProps {
  checkIn: string | null;
  checkOut: string | null;
  onClear: () => void;
}

export const SelectionInfo: React.FC<SelectionInfoProps> = ({
  checkIn,
  checkOut,
  onClear,
}) => {
  if (checkIn && checkOut) {
    return (
      <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
        <p className="text-xs font-medium text-green-900">
          ✅ Selected: {new Date(checkIn).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })} → {new Date(checkOut).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
        <button
          onClick={onClear}
          className="mt-1 text-xs text-red-600 hover:text-red-800 underline"
        >
          Clear selection
        </button>
      </div>
    );
  }

  if (checkIn && !checkOut) {
    return (
      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs font-medium text-blue-900">
          📅 Check-in: {new Date(checkIn).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Now select your check-out date (must be available)
        </p>
        <button
          onClick={onClear}
          className="mt-1 text-xs text-red-600 hover:text-red-800 underline"
        >
          Clear selection
        </button>
      </div>
    );
  }

  return null;
};

export const InstructionBanner: React.FC = () => {
  return (
    <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-xs text-blue-900">
        📌 <strong>How to select:</strong> Click a green date for check-in, then click another green date for check-out. 
        All dates between must be available.
      </p>
    </div>
  );
};