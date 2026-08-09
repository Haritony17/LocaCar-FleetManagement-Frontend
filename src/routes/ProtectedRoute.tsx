import { Navigate } from 'react-router-dom';
import { useAuth, type Role } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: Role;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}