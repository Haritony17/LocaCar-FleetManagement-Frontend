import { createContext, useContext, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

export type Role = 'client' | 'admin';

interface User {
  id: string;
  email: string;
  role: Role;
}

interface TokenPayload {
  roles: string[];
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
interface TokenPayload {
  roles: string[];
  username: string;
  userId: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
}

interface TokenPayload {
  roles: string[];
  username: string;
  userId: string;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeUser(token: string): User {
  const decoded = jwtDecode<TokenPayload>(token);
  const role: Role = decoded.roles.includes('ROLE_ADMIN') ? 'admin' : 'client';
  return { id: decoded.userId, email: decoded.username, role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return decodeUser(token);
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login_check', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      const newUser = decodeUser(token);
      setUser(newUser);
      return { success: true, role: newUser.role };
    } catch {
      return { success: false };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await api.post('/users/register', data);
      return { success: true };
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || "Erreur lors de l'inscription.";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
}