import { AlertCircle, CheckCircle, X } from 'lucide-react';
import Typography from '../layout/Typography';

interface NotificationBannerProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export default function NotificationBanner({ type, message, onClose }: NotificationBannerProps) {
  const isSuccess = type === 'success';
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className={`${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex gap-3`}>
        {isSuccess ? (
          <CheckCircle className="text-green-600" size={20} />
        ) : (
          <AlertCircle className="text-red-600" size={20} />
        )}
        <Typography varient='paragraph' className={`${isSuccess ? 'text-green-800' : 'text-red-800'} flex-1`}>{message}</Typography>
        <button onClick={onClose}>
          <X size={18} className={isSuccess ? 'text-green-600' : 'text-red-600'} />
        </button>
      </div>
    </div>
  );
}