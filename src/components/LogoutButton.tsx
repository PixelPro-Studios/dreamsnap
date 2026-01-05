import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LogoutButton: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-20 hover:bg-opacity-40 backdrop-blur-sm transition-all duration-200 group"
      title="Sign Out"
      aria-label="Sign Out"
    >
      <svg
        className="w-4 h-4 text-white opacity-40 group-hover:opacity-80 transition-opacity"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  );
};
