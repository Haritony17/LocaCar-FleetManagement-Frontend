import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'client';
}

interface TokenPayload {
  roles: string[];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const hasRole = decoded.roles.includes(`ROLE_${role.toUpperCase()}`);

    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}