import { Booking } from '@/types/admin';
import { X } from 'lucide-react';
import Typography from '../layout/Typography';
import StatusBadge from './StatusBadge';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between sticky top-0 bg-white">
          <Typography variant='h3' className="text-xl font-bold">Booking Details</Typography>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Booking Reference</Typography> 
              <Typography varient='paragraph' className="font-semibold font-mono">{booking.bookingReference}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Status</Typography> 
              <StatusBadge status={booking.status} />
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Guest Name</Typography> 
              <Typography varient='paragraph' className="font-semibold">{booking.guestName}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Email</Typography> 
              <Typography varient='paragraph' className="font-semibold">{booking.guestEmail}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Phone</Typography> 
              <Typography varient='paragraph' className="font-semibold">{booking.guestPhone}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Guests</Typography> 
              <Typography varient='paragraph' className="font-semibold">{booking.guests}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Room</Typography> 
              <Typography varient='paragraph' className="font-semibold">{booking.room?.name || 'Room Deleted'}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Type</Typography> 
              <Typography varient='paragraph' className="font-semibold capitalize">{booking.room?.type || 'N/A'}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Check-in</Typography> 
              <Typography varient='paragraph' className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Check-out</Typography> 
              <Typography varient='paragraph' className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Nights</Typography> 
              <Typography varient='paragraph' className="font-semibold">{booking.nights}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Price/Night</Typography> 
              <Typography varient='paragraph' className="font-semibold">₹{booking.pricePerNight.toLocaleString()}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Total</Typography> 
              <Typography varient='paragraph' className="font-semibold text-lg text-green-600">₹{booking.totalPrice.toLocaleString()}</Typography> 
            </div>
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600">Payment</Typography> 
              <Typography varient='paragraph' className="font-semibold capitalize">{booking.paymentStatus}</Typography> 
            </div>
          </div>
          {booking.specialRequests && (
            <div>
              <Typography varient='paragraph' className="text-sm text-gray-600 mb-1">Special Requests</Typography> 
              <Typography varient='paragraph' className="p-3 bg-gray-50 rounded-lg">{booking.specialRequests}</Typography> 
            </div>
          )}
          <div className="pt-4 border-t">
            <Typography varient='paragraph' className="text-xs text-gray-500">Booked: {new Date(booking.createdAt).toLocaleString()}</Typography> 
            <Typography varient='paragraph' className="text-xs text-gray-500">Updated: {new Date(booking.updatedAt).toLocaleString()}</Typography> 
          </div>
        </div>
      </div>
    </div>
  );
}
