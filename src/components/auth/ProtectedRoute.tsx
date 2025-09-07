import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  // Mock auth check - replace with actual auth logic
  const isAuthenticated = true; // For now, always authenticated for demo

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}