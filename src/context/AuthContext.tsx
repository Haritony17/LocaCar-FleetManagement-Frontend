import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'client' | 'admin';

interface User {
  email: string;
  nom: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; role?: Role };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Comptes de démo
const DEMO_ACCOUNTS: Record<string, { password: string; nom: string; role: Role }> = {
  'admin@locacar.mg': { password: 'admin123', nom: 'Administrateur', role: 'admin' },
  'client@locacar.mg': { password: 'client123', nom: 'Jean Rakoto', role: 'client' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('demo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string) => {
    const account = DEMO_ACCOUNTS[email];
    if (!account || account.password !== password) {
      return { success: false };
    }
    const newUser: User = { email, nom: account.nom, role: account.role };
    setUser(newUser);
    localStorage.setItem('demo_user', JSON.stringify(newUser));
    return { success: true, role: account.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
}