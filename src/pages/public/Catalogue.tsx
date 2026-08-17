import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import VehiculeCard from '@/components/shared/VehiculeCard';
import FiltresCatalogue, { type Filtres } from '@/components/shared/FiltresCatalogue';
import { fetchVehicles, type Vehicle } from '@/services/vehiclesApi';

export default function Catalogue() {
  const [searchParams] = useSearchParams();
  const debut = searchParams.get('debut');
  const fin = searchParams.get('fin');

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
    fetchVehicles()
      .then((data) => setVehicles(data.filter((v) => v.status === 'AVAILABLE')))
      .catch(() => setErreur('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false));
  }, []);

  const getTarif = (v: Vehicle) => parseFloat(v.effectiveDailyRate);

  const boiteFr: Record<string, string> = { MANUAL: 'Manuelle', AUTOMATIC: 'Automatique' };
  const motorisationFr: Record<string, string> = { PETROL: 'Essence', DIESEL: 'Diesel', HYBRID: 'Hybride', ELECTRIC: 'Electrique' };

  const vehiculesFiltres = vehicles.filter((v) => {
    if (filtres.places && v.seats !== filtres.places) return false;
    if (filtres.boite && boiteFr[v.gearboxType] !== filtres.boite) return false;
    if (filtres.motorisation && motorisationFr[v.fuelType] !== filtres.motorisation) return false;
    if (getTarif(v) > filtres.prixMax) return false;
    return true;
  });

  const vehiculesTries = [...vehiculesFiltres].sort((a, b) =>
    tri === 'prix_asc' ? getTarif(a) - getTarif(b) : getTarif(b) - getTarif(a)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex gap-6 p-8 max-w-7xl mx-auto">
        <FiltresCatalogue filtres={filtres} onChange={setFiltres} />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-2xl font-bold text-foreground">
              Nos véhicules <span className="text-muted-foreground font-normal">({vehiculesTries.length})</span>
            </h1>

            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as 'prix_asc' | 'prix_desc')}
              className="px-3 py-2 rounded-lg border text-sm bg-background"
            >
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
          </div>

          {debut && fin && (
            <p className="text-sm text-muted-foreground mb-5">
              Recherche du {new Date(debut).toLocaleString('fr-FR')} au {new Date(fin).toLocaleString('fr-FR')}
            </p>
          )}

          {loading && <p className="text-muted-foreground mt-8">Chargement des véhicules...</p>}
          {erreur && <p className="text-red-600 mt-8">{erreur}</p>}
          {!loading && !erreur && vehiculesTries.length === 0 && (
            <p className="text-muted-foreground mt-8">Aucun véhicule ne correspond à ces critères.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {vehiculesTries.map((v) => (
              <VehiculeCard key={v.id} vehicule={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}