"use client";

import { Field, ErrorMessage } from "formik";
import Typography from "@/components/layout/Typography";
import { Room } from "@/types/booking";

interface RoomSelectorProps {
  rooms: Room[];
  onRoomChange: (roomId: string) => void;
}

const RoomSelector = ({ rooms, onRoomChange }: RoomSelectorProps) => {
  return (
    <div>
      <Field
        as="select"
        name="roomId"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          onRoomChange(e.target.value);
        }}
        className="w-full px-4 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/30 text-gray-900 font-medium shadow-sm hover:bg-white focus:bg-white focus:border-white focus:ring-4 focus:ring-white/40 outline-none transition-all"
      >
        <option value="">Choose a room...</option>
        {rooms.map((room) => (
          <option key={room._id} value={room._id}>
            {room.name} - ₹{room.price.toLocaleString()}/night
          </option>
        ))}
      </Field>
      <ErrorMessage name="roomId">
        {(msg) => (
          <Typography variant="small" textColor="primary" className="mt-2 text-red-100 bg-red-500/20 px-3 py-1.5 rounded-lg inline-block">
            ⚠️ {msg}
          </Typography>
        )}
      </ErrorMessage>
    </div>
  );
};

export default RoomSelector;
