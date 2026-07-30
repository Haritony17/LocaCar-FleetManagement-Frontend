import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-background border-b sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-sm">L</span>
        LocaCar
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/catalogue" className="text-muted-foreground hover:text-foreground text-sm font-medium transition">
          Catalogue
        </Link>
        <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm font-medium transition">
          S'inscrire
        </Link>
        <Button render={<Link to="/login" />} className="rounded-full">
  Connexion
</Button>
        <ThemeToggle />
      </div>
    </nav>
  );
}