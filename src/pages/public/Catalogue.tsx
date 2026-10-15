import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Navbar from '@/components/shared/Navbar';
import VehiculeCard from '@/components/shared/VehiculeCard';
import FiltresCatalogue, {
  type Filtres,
} from '@/components/shared/FiltresCatalogue';
import { fetchVehicles, type Vehicle } from '@/services/vehiclesApi';

const boiteFr: Record<string, string> = {
  MANUAL: 'Manuelle',
  AUTOMATIC: 'Automatique',
};

const motorisationFr: Record<string, string> = {
  PETROL: 'Essence',
  DIESEL: 'Diesel',
  HYBRID: 'Hybride',
  ELECTRIC: 'Electrique',
};

function getTarif(vehicle: Vehicle): number {
  return Number(vehicle.effectiveDailyRate);
}

export default function Catalogue() {
  const [searchParams] = useSearchParams();

  const debut = searchParams.get('debut');
  const fin = searchParams.get('fin');
  const agenceId = searchParams.get('agence');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const [tri, setTri] = useState<'prix_asc' | 'prix_desc'>('prix_asc');

  const [filtres, setFiltres] = useState<Filtres>({
    places: null,
    boite: null,
    motorisation: null,
    prixMax: 100,
  });

  useEffect(() => {
    let actif = true;

    async function chargerCatalogue() {
      try {
        const data = await fetchVehicles();

        if (actif) {
          setVehicles(
            data.filter((vehicle) => vehicle.status === 'AVAILABLE')
          );
        }
      } catch {
        if (actif) {
          setErreur('Impossible de charger le catalogue.');
        }
      } finally {
        if (actif) {
          setLoading(false);
        }
      }
    }

    void chargerCatalogue();

    return () => {
      actif = false;
    };
  }, []);

  const vehiculesFiltres = vehicles.filter((vehicle) => {
     if (agenceId && vehicle.agencyId !== agenceId) {
    return false;
  }
    if (filtres.places && vehicle.seats !== filtres.places) {
      return false;
    }

    if (
      filtres.boite &&
      boiteFr[vehicle.gearboxType] !== filtres.boite
    ) {
      return false;
    }

    if (
      filtres.motorisation &&
      motorisationFr[vehicle.fuelType] !== filtres.motorisation
    ) {
      return false;
    }

    if (getTarif(vehicle) > filtres.prixMax) {
      return false;
    }

    return true;
  });

  const vehiculesTries = [...vehiculesFiltres].sort((a, b) =>
    tri === 'prix_asc'
      ? getTarif(a) - getTarif(b)
      : getTarif(b) - getTarif(a)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:p-8">
        <aside
          aria-label="Filtres des véhicules"
          className="w-full min-w-0 lg:w-64 lg:shrink-0 [&>*]:w-full [&>*]:min-w-0 [&>*]:max-w-full"
        >
          <FiltresCatalogue
            filtres={filtres}
            onChange={setFiltres}
          />
        </aside>

        <section className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Nos véhicules{' '}
              <span className="font-normal text-muted-foreground">
                ({vehiculesTries.length})
              </span>
            </h1>

            <div className="w-full sm:w-auto">
              <label htmlFor="tri-catalogue" className="sr-only">
                Trier les véhicules
              </label>

              <select
                id="tri-catalogue"
                value={tri}
                onChange={(event) =>
                  setTri(event.target.value as 'prix_asc' | 'prix_desc')
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground sm:w-auto"
              >
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {debut && fin && (
            <p className="mt-3 text-sm text-muted-foreground">
              Recherche du {new Date(debut).toLocaleString('fr-FR')}
              {' '}au {new Date(fin).toLocaleString('fr-FR')}
            </p>
          )}

          {loading && (
            <p className="mt-8 text-muted-foreground">
              Chargement des véhicules...
            </p>
          )}

          {erreur && (
            <p role="alert" className="mt-8 text-red-600">
              {erreur}
            </p>
          )}

          {!loading && !erreur && vehiculesTries.length === 0 && (
            <p className="mt-8 text-muted-foreground">
              Aucun véhicule ne correspond à ces critères.
            </p>
          )}

          {!loading && !erreur && (
            <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {vehiculesTries.map((vehicle) => (
                <VehiculeCard
                  key={vehicle.id}
                  vehicule={vehicle}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}