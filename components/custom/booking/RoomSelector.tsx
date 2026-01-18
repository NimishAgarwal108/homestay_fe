"use client";

import { Field, ErrorMessage } from "formik";
import Typography from "../../Typography";
import { Room } from "./types";

interface RoomSelectorProps {
  rooms: Room[];
  onRoomChange: (roomId: string) => void;
}

const RoomSelector = ({ rooms, onRoomChange }: RoomSelectorProps) => {
  return (
    <div>
      <Typography variant="label" textColor="primary" className="mb-2 block">
        Select Room *
      </Typography>
      <Field
        as="select"
        name="roomId"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          onRoomChange(e.target.value);
        }}
        className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
      >
        <option value="">Choose a room...</option>
        {rooms.map((room) => (
          <option key={room._id} value={room._id}>
            {room.name} - ₹{room.price}/night
          </option>
        ))}
      </Field>
      <ErrorMessage name="roomId">
        {(msg) => (
          <Typography variant="small" textColor="primary" className="mt-1 text-red-600">
            {msg}
          </Typography>
        )}
      </ErrorMessage>
    </div>
  );
};

export default RoomSelector;