import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, ClipboardList, ShieldCheck, MapPin, Wallet, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/admin/flotte', label: 'Gestion Flotte', icon: Car },
  { to: '/admin/reservations', label: 'Réservations', icon: ClipboardList },
  { to: '/admin/kyc', label: 'Vérification KYC', icon: ShieldCheck },
  { to: '/admin/gps', label: 'Suivi GPS', icon: MapPin },
  { to: '/admin/paiements', label: 'Paiements', icon: Wallet },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-card border-r flex flex-col p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg px-2 mb-8">
          <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Car size={18} />
          </span>
          <span>LocaCar <span className="text-muted-foreground font-normal text-sm">Admin</span></span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon size={18} className="shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bas de sidebar : theme + user + logout */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">Thème</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {user?.nom?.charAt(0) ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.nom}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut size={14} />
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}