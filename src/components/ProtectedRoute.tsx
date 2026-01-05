import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutButton } from './LogoutButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block relative mb-6">
            <div className="w-20 h-20 border-8 border-primary-200 border-t-primary-600 rounded-full animate-spin shadow-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-3 shadow-xl">
                <svg className="w-8 h-8 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
            Verifying Access...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <LogoutButton />
      {children}
    </>
  );
};
