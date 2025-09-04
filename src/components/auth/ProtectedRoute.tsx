// src/components/auth/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth(); // ALWAYS call the hook
  const navigate = useNavigate();
  const location = useLocation();

  // run redirect logic in effect (never during render)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { state: { from: location }, replace: true });
    }
  }, [loading, user, navigate, location]);

  // While auth loading, show spinner but DO NOT change hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // If not logged in we already navigated; return null to avoid rendering children
  if (!user) return null;

  // Authenticated: render children
  return <>{children}</>;
};

export default ProtectedRoute;
