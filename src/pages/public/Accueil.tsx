import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard } from 'lucide-react';

import Navbar from '@/components/shared/Navbar';
import MoteurRecherche from '@/components/shared/MoteurRecherche';
import VehiculeCard from '@/components/shared/VehiculeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  fetchVehicles,
  type Vehicle,
} from '@/services/vehiclesApi';

export default function Accueil() {
  const [topVehicules, setTopVehicules] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [tentative, setTentative] = useState(0);

  useEffect(() => {
    let actif = true;

    setLoading(true);
    setErreur('');

    async function chargerVehicules() {
      try {
        const vehicles = await fetchVehicles();

        const selection = vehicles
          .filter((vehicle) => vehicle.status === 'AVAILABLE')
          .sort((a, b) => {
            const noteA = Number(a.averageRating) || 0;
            const noteB = Number(b.averageRating) || 0;

            return noteB - noteA || b.reviewsCount - a.reviewsCount;
          })
          .slice(0, 3);

        if (actif) {
          setTopVehicules(selection);
        }
      } catch {
        if (actif) {
          setErreur('Impossible de charger les véhicules pour le moment.');
        }
      } finally {
        if (actif) {
          setLoading(false);
        }
      }
    }

    void chargerVehicules();

    return () => {
      actif = false;
    };
  }, [tentative]);

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />

      {/* Accueil et recherche */}
      <section
        className="relative flex min-h-[calc(100svh-73px)] items-center bg-cover bg-center py-12 sm:py-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=900&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative mx-auto w-full max-w-4xl px-4 text-center">
          <Badge className="mb-4 max-w-full whitespace-normal bg-white/15 text-white backdrop-blur-sm hover:bg-white/15">
            🚗 Location de véhicules à Madagascar
          </Badge>

          <h1 className="mb-3 text-3xl font-bold text-white md:text-5xl">
            Louez le véhicule qu’il vous faut
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base text-white/85 sm:mb-10 sm:text-lg">
            Des citadines aux SUV, trouvez votre véhicule et préparez
            votre prochaine location en quelques clics.
          </p>

          <MoteurRecherche />
        </div>
      </section>

      {/* Présentation des services */}
      <section
        aria-label="Nos services"
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3 md:py-16"
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950">
              <MapPin size={22} aria-hidden="true" />
            </div>

            <p className="font-semibold text-foreground">
              Suivi GPS
            </p>

            <p className="text-sm text-muted-foreground">
              Le suivi de votre véhicule pendant la location sera
              prochainement disponible.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950">
              <ShieldCheck size={22} aria-hidden="true" />
            </div>

            <p className="font-semibold text-foreground">
              Votre espace personnel
            </p>

            <p className="text-sm text-muted-foreground">
              Retrouvez vos réservations et gérez vos informations
              depuis votre compte.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950">
              <CreditCard size={22} aria-hidden="true" />
            </div>

            <p className="font-semibold text-foreground">
              Un tarif visible
            </p>

            <p className="text-sm text-muted-foreground">
              Consultez le tarif journalier et l’estimation de votre
              location avant de réserver.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Véhicules provenant du backend */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Notre sélection de véhicules
          </h2>

          <Link
            to="/catalogue"
            className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Voir tout le catalogue →
          </Link>
        </div>

        {loading && (
          <p role="status" className="py-8 text-muted-foreground">
            Chargement des véhicules...
          </p>
        )}

        {!loading && erreur && (
          <div className="rounded-xl border p-6">
            <p role="alert" className="mb-4 text-sm text-red-600">
              {erreur}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => setTentative((valeur) => valeur + 1)}
            >
              Réessayer
            </Button>
          </div>
        )}

        {!loading && !erreur && topVehicules.length === 0 && (
          <p className="py-8 text-muted-foreground">
            Aucun véhicule disponible à afficher pour le moment.
          </p>
        )}

        {!loading && !erreur && topVehicules.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topVehicules.map((vehicle) => (
              <VehiculeCard
                key={vehicle.id}
                vehicule={vehicle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}