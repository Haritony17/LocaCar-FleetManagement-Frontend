import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, ClipboardList, MapPin } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import { cn } from '@/lib/utils';

const links = [
  { to: '/mon-compte/profil', label: 'Profil & Documents', icon: User },
  { to: '/mon-compte/reservations', label: 'Mes Réservations', icon: ClipboardList },
  { to: '/mon-compte/gps', label: 'Suivi GPS', icon: MapPin },
];

export default function ClientLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex gap-8 p-8 max-w-6xl mx-auto">
        <aside className="w-56 flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
                  active ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </aside>
        <main className="flex-1"><Outlet /></main>
      </div>
    </div>
  );
}