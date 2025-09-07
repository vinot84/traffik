import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  // Mock user role - replace with actual user data
  const userRole: UserRole = 'driver'; // For demo purposes

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}