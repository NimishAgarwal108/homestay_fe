import Cookies from 'js-cookie';
import { ExternalLink, LogOut, RefreshCw } from 'lucide-react';
import Typography from '../layout/Typography';

interface AdminHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminHeader({ loading, onRefresh }: AdminHeaderProps) {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      Cookies.remove('adminToken', { path: '/' });
      console.log('✅ Logged out - localStorage and cookie cleared');
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant='h1' className="text-2xl font-bold">Aamantran Homestay</Typography>
            <Typography variant='paragraph' className="text-sm text-gray-600">Admin Dashboard</Typography>
          </div>
          <div className="flex gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button 
              onClick={onRefresh} 
              className="p-2 hover:bg-gray-100 rounded-lg" 
              disabled={loading}
            >
              <RefreshCw size={20} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}