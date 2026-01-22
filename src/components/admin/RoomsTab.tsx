import React from 'react';
import { Edit, Home } from 'lucide-react';
import { Room } from '@/types/admin';

interface RoomsTabProps {
  rooms: Room[];
  loading: boolean;
  onEdit: (room: Room) => void;
  onToggleAvailability: (roomId: string) => void;
  onDelete: (roomId: string) => void;
}

export default function RoomsTab({ 
  rooms, 
  loading, 
  onEdit, 
  onToggleAvailability, 
  onDelete 
}: RoomsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Room Management</h2>
          <p className="text-sm text-gray-600 mt-1">Edit room details, prices, and availability</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div 
            key={room._id} 
            className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
          >
            <img 
              src={room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'}
              alt={room.name} 
              className="w-full h-48 object-cover" 
            />
            <div className="p-6">
              <div className="flex justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {room.type} • {room.capacity} guests
                  </p>
                </div>
                <button 
                  onClick={() => onToggleAvailability(room._id)} 
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer hover:opacity-80 ${
                    room.isAvailable 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Click to toggle availability"
                >
                  {room.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
              <p className="text-2xl font-bold mb-4">₹{room.price.toLocaleString()}/night</p>
              {room.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>
              )}
              <div className="flex gap-2 flex-wrap mb-4">
                {(room.amenities || room.features || []).slice(0, 3).map((item, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item}
                  </span>
                ))}
                {(room.amenities || room.features || []).length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{(room.amenities || room.features || []).length - 3} more
                  </span>
                )}
              </div>
              <button 
                onClick={() => onEdit(room)} 
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit size={16} />
                Edit Room
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Home size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No rooms found</p>
        </div>
      )}
    </div>
  );
}
