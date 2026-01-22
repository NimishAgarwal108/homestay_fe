import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
    completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
  };
  
  const { bg, text, icon: Icon } = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}