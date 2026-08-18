import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
        <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
          <Car size={18} />
        </span>
        LocaCar
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/catalogue" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
          Catalogue
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/mon-compte" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              {user?.email}
            </Link>
            <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              S'inscrire
            </Link>
            <Button render={<Link to="/login" />} className="rounded-full">
              Connexion
            </Button>
          </>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}