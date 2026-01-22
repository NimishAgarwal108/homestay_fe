// types/calendar.ts
export interface AvailabilityDay {
  date: string;
  available: boolean;
}

export interface RoomAvailabilityCalendarProps {
  roomId: string;
  onDateSelect?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  refreshTrigger?: number;
}

export interface CalendarState {
  availability: AvailabilityDay[];
  loading: boolean;
  currentMonth: number;
  selectingCheckIn: string | null;
  selectingCheckOut: string | null;
}