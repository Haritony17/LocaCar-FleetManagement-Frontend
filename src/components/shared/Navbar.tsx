import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Car,
  Menu,
  X,
  UserRound,
  LogOut,
  CalendarDays,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuMobile, setMenuMobile] = useState(false);
  const [menuCompte, setMenuCompte] = useState(false);

  const compteRef = useRef<HTMLDivElement>(null);
  const compteButtonRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const fermerMenus = () => {
    setMenuMobile(false);
    setMenuCompte(false);
  };

  const handleLogout = () => {
    fermerMenus();
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fermerAuClicExterieur = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (!compteRef.current?.contains(target)) {
        setMenuCompte(false);
      }

      if (!mobileRef.current?.contains(target)) {
        setMenuMobile(false);
      }
    };

    const fermerAvecEchap = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (menuCompte) {
        setMenuCompte(false);
        compteButtonRef.current?.focus();
      }

      if (menuMobile) {
        setMenuMobile(false);
        mobileButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', fermerAuClicExterieur);
    document.addEventListener('keydown', fermerAvecEchap);

    return () => {
      document.removeEventListener(
        'pointerdown',
        fermerAuClicExterieur
      );
      document.removeEventListener('keydown', fermerAvecEchap);
    };
  }, [menuCompte, menuMobile]);

  const catalogueActif = location.pathname.startsWith('/catalogue');
  const compteActif = location.pathname.startsWith('/mon-compte');

  const lienClass =
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground';

  const entreeCompteClass =
    'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-teal-600';

  return (
    <nav
      aria-label="Navigation principale"
      className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={fermerMenus}
          className="flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight text-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Car size={22} aria-hidden="true" />
          </span>
          LocaCar
        </Link>

        {/* Toutes les actions sont regroupées à droite */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/catalogue"
              onClick={fermerMenus}
              aria-current={catalogueActif ? 'page' : undefined}
              className={`${lienClass} ${
                catalogueActif
                  ? 'bg-teal-600/10 text-teal-600 dark:text-teal-400'
                  : 'text-muted-foreground'
              }`}
            >
              Catalogue
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                onClick={fermerMenus}
                className={`${lienClass} text-muted-foreground`}
              >
                S’inscrire
              </Link>
            )}
          </div>

          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <div
              ref={compteRef}
              className="relative"
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;

                if (
                  !(nextTarget instanceof Node) ||
                  !event.currentTarget.contains(nextTarget)
                ) {
                  setMenuCompte(false);
                }
              }}
            >
              <button
                ref={compteButtonRef}
                type="button"
                aria-label="Ouvrir les options du compte"
                aria-expanded={menuCompte}
                aria-controls="options-compte"
                onClick={() => {
                  setMenuCompte((ouvert) => !ouvert);
                  setMenuMobile(false);
                }}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                  menuCompte || compteActif
                    ? 'border-teal-600/40 bg-teal-600/15 text-teal-600 dark:text-teal-400'
                    : 'border-border bg-muted/40 text-foreground hover:border-teal-600/40 hover:bg-teal-600/10 hover:text-teal-600'
                }`}
              >
                <UserRound size={20} aria-hidden="true" />
              </button>

              <div
                id="options-compte"
                hidden={!menuCompte}
                className="absolute right-0 top-full mt-3 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border bg-background p-2 shadow-xl"
              >
                <p className="px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Espace personnel
                </p>

                <Link
                  to="/mon-compte/profil"
                  onClick={fermerMenus}
                  className={entreeCompteClass}
                >
                  <UserRound
                    size={18}
                    aria-hidden="true"
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Mon profil
                </Link>

                <Link
                  to="/mon-compte/reservations"
                  onClick={fermerMenus}
                  className={entreeCompteClass}
                >
                  <CalendarDays
                    size={18}
                    aria-hidden="true"
                    className="text-teal-600 dark:text-teal-400"
                  />
                  Mes réservations
                </Link>

                <div className="my-2 border-t" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${entreeCompteClass} text-red-600 hover:bg-red-600/10 dark:text-red-400`}
                >
                  <LogOut size={18} aria-hidden="true" />
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Button
              nativeButton={false}
              render={<Link to="/login" />}
              onClick={fermerMenus}
              className="hidden rounded-full md:inline-flex"
            >
              Connexion
            </Button>
          )}

          {/* Navigation mobile */}
          <div ref={mobileRef} className="relative md:hidden">
            <button
              ref={mobileButtonRef}
              type="button"
              aria-label={
                menuMobile ? 'Fermer le menu' : 'Ouvrir le menu'
              }
              aria-expanded={menuMobile}
              aria-controls="navigation-mobile"
              onClick={() => {
                setMenuMobile((ouvert) => !ouvert);
                setMenuCompte(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              {menuMobile ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>

            <div
              id="navigation-mobile"
              hidden={!menuMobile}
              className="absolute right-0 top-full mt-3 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border bg-background p-2 shadow-xl"
            >
              <Link
                to="/catalogue"
                onClick={fermerMenus}
                className={entreeCompteClass}
              >
                <Car size={18} aria-hidden="true" />
                Catalogue
              </Link>

              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    onClick={fermerMenus}
                    className={entreeCompteClass}
                  >
                    <UserRound size={18} aria-hidden="true" />
                    S’inscrire
                  </Link>

                  <Button
                    nativeButton={false}
                    render={<Link to="/login" />}
                    onClick={fermerMenus}
                    className="mt-2 w-full rounded-full"
                  >
                    Connexion
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}