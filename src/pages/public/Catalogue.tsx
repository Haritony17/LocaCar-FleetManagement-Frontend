import { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import VehiculeCard from '../../components/shared/VehiculeCard';
import FiltresCatalogue, { type Filtres } from '../../components/shared/FiltresCatalogue';
import { mockVehicules } from '../../data/mockVehicules';
import { useSearchParams } from 'react-router-dom';

export default function Catalogue() {
  const [tri, setTri] = useState<'prix_asc' | 'prix_desc'>('prix_asc');
  const [filtres, setFiltres] = useState<Filtres>({
    places: null,
    boite: null,
    motorisation: null,
    prixMax: 100,
  });

 const getTarif = (v: typeof mockVehicules[number]) =>
  v.tarif_journalier_specifique ?? v.tarif_defaut_categorie;

const vehiculesFiltres = mockVehicules.filter((v) => {
  if (filtres.places && v.nombre_places !== filtres.places) return false;
  if (filtres.boite && v.type_boite_vitesse !== filtres.boite) return false;
  if (filtres.motorisation && v.motorisation !== filtres.motorisation) return false;
  if (getTarif(v) > filtres.prixMax) return false;
  return true;
});

const vehiculesTries = [...vehiculesFiltres].sort((a, b) =>
  tri === 'prix_asc'
    ? getTarif(a) - getTarif(b)
    : getTarif(b) - getTarif(a)
);
  const [searchParams] = useSearchParams();
const debut = searchParams.get('debut');
const fin = searchParams.get('fin');

  return (
    <div>
      <Navbar />

      <div style={{ display: 'flex' }}>
        <FiltresCatalogue filtres={filtres} onChange={setFiltres} />

        <div style={{ flex: 1, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1>Nos véhicules ({vehiculesTries.length})</h1>

            <select value={tri} onChange={(e) => setTri(e.target.value as 'prix_asc' | 'prix_desc')}>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
          </div>

          {vehiculesTries.length === 0 && <p style={{ color: '#64748b' }}>Aucun véhicule ne correspond à ces critères.</p>}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {vehiculesTries.map((v) => (
              <VehiculeCard key={v.id_vehicule} vehicule={v} />
            ))}
            {debut && fin && (
  <p style={{ color: '#64748b', marginTop: '-1rem', marginBottom: '1rem' }}>
    Recherche du {new Date(debut).toLocaleString('fr-FR')} au {new Date(fin).toLocaleString('fr-FR')}
  </p>
)}
          </div>
        </div>
      </div>
    </div>
  );
}