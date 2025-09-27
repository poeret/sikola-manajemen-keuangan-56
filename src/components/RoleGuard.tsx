import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  fallbackPath = "/" 
}: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

// Helper components untuk role tertentu
export const AdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin', 'admin']}>
    {children}
  </RoleGuard>
);

export const CashierOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowedRoles={['cashier']}>
    {children}
  </RoleGuard>
);

export const SuperAdminOnly = ({ children }: { children: ReactNode }) => (
  <RoleGuard allowedRoles={['super_admin']}>
    {children}
  </RoleGuard>
);
