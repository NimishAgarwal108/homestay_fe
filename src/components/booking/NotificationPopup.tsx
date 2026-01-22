"use client";

import Typography from "@/components/layout/Typography";
import { PopupType } from "@/types/booking";

interface NotificationPopupProps {
  show: boolean;
  type: PopupType;
  message: string;
}

const NotificationPopup = ({ show, type, message }: NotificationPopupProps) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div
        className={`${
          type === "success" ? "bg-[#7570BC]" : "bg-red-500"
        } text-white px-6 py-4 rounded-2xl shadow-2xl`}
      >
        <Typography variant="paragraph" textColor="white" weight="semibold">
          {message}
        </Typography>
      </div>
    </div>
  );
};

export default NotificationPopup;
