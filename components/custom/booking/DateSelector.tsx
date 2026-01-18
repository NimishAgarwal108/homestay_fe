"use client";

import { ErrorMessage } from "formik";
import Typography from "../../Typography";
import RoomAvailabilityCalendar from "../../RoomAvailabilityCalendar";
import { formatDate } from "./utils";

interface DateSelectorProps {
  selectedRoomId: string;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  onDateSelect: (checkIn: string, checkOut: string) => void;
  selectedCheckIn: string;
  selectedCheckOut: string;
  refreshTrigger: number;
}

const DateSelector = ({
  selectedRoomId,
  showCalendar,
  setShowCalendar,
  onDateSelect,
  selectedCheckIn,
  selectedCheckOut,
  refreshTrigger
}: DateSelectorProps) => {
  if (!selectedRoomId) return null;

  return (
    <>
      {/* Calendar Section */}
      {showCalendar && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" textColor="primary" weight="semibold">
              📅 Select Your Dates
            </Typography>
            <button
              type="button"
              onClick={() => setShowCalendar(false)}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Hide Calendar
            </button>
          </div>
          <RoomAvailabilityCalendar
            roomId={selectedRoomId}
            onDateSelect={onDateSelect}
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            refreshTrigger={refreshTrigger}
          />
          
          {selectedCheckIn && selectedCheckOut && (
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-400">
              <Typography variant="paragraph" textColor="primary" weight="semibold" className="text-green-800">
                ✅ Dates Selected: {formatDate(selectedCheckIn)} - {formatDate(selectedCheckOut)}
              </Typography>
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="mt-2 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue to Guest Details →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toggle Calendar Button */}
      {!showCalendar && (
        <button
          type="button"
          onClick={() => setShowCalendar(true)}
          className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl transition-colors border-2 border-blue-300"
        >
          <Typography variant="paragraph" weight="semibold">
            {selectedCheckIn && selectedCheckOut 
              ? `📅 Change Dates (${formatDate(selectedCheckIn)} - ${formatDate(selectedCheckOut)})`
              : '📅 Select Dates'
            }
          </Typography>
        </button>
      )}

      {/* Date Display Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Check-in Date *
          </Typography>
          <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700">
            {selectedCheckIn ? formatDate(selectedCheckIn) : "Select from calendar above"}
          </div>
          <ErrorMessage name="checkIn">
            {(msg) => (
              <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                {msg}
              </Typography>
            )}
          </ErrorMessage>
        </div>

        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Check-out Date *
          </Typography>
          <div className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-700">
            {selectedCheckOut ? formatDate(selectedCheckOut) : "Select from calendar above"}
          </div>
          <ErrorMessage name="checkOut">
            {(msg) => (
              <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
                {msg}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      </div>
    </>
  );
};

export default DateSelector;