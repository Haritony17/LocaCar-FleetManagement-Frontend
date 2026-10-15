import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { fetchVehicles, type Vehicle } from '@/services/vehiclesApi';
import { useAuth } from '@/context/AuthContext';
import { createReservation } from '@/services/reservationCreateApi';
import { getOrCreateMyCustomer } from '@/services/customersApi';

const boiteFr: Record<string, string> = { MANUAL: 'Manuelle', AUTOMATIC: 'Automatique' };
const motorisationFr: Record<string, string> = { PETROL: 'Essence', DIESEL: 'Diesel', HYBRID: 'Hybride', ELECTRIC: 'Électrique' };

export default function VehiculeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [reservationLoading, setReservationLoading] = useState(false);

  const [vehicule, setVehicule] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  useEffect(() => {
    fetchVehicles()
      .then((all) => {
        const found = all.find((v) => v.id === id);
        if (!found) {
          setErreur('Véhicule introuvable.');
        } else {
          setVehicule(found);
        }
      })
      .catch(() => setErreur('Impossible de charger ce véhicule.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="p-8 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (erreur || !vehicule) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="p-8 text-muted-foreground">{erreur || 'Véhicule introuvable.'}</p>
      </div>
    );
  }

  const tarifAffiche = parseFloat(vehicule.effectiveDailyRate);
  const note = parseFloat(vehicule.averageRating) || 0;

  const nombreJours = dateDebut && dateFin
    ? Math.max(1, Math.ceil((new Date(dateFin).getTime() - new Date(dateDebut).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const prixTotal = nombreJours * tarifAffiche;
  const toAtomFormat = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
};

 const handleReserver = async () => {
  if (!isAuthenticated || !user) {
    navigate('/login', { state: { from: `/vehicule/${id}` } });
    return;
  }
  if (!dateDebut || !dateFin) {
    alert('Merci de sélectionner les dates.');
    return;
  }

  setReservationLoading(true);
  try {
    const customer = await getOrCreateMyCustomer();
    const acompte = (prixTotal / 2).toFixed(2);
    await createReservation({
      startDate: toAtomFormat(dateDebut),
      endDate: toAtomFormat(dateFin),
      vehicleId: vehicule.id,
      customerId: customer.id,
      depositAmount: acompte,
    });
    navigate('/mon-compte/reservations');
  } catch (err: any) {
    alert(err?.response?.data?.detail || 'Erreur lors de la création de la réservation.');
  } finally {
    setReservationLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex gap-8 p-8 max-w-6xl mx-auto flex-wrap">
        <div className="flex-[2] min-w-[320px]">
          <div className="w-full h-72 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
            {vehicule.brand} {vehicule.model}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <h1 className="text-2xl font-bold">{vehicule.brand} {vehicule.model}</h1>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">● Disponible</Badge>
          </div>
          <p className="text-muted-foreground">{vehicule.year}</p>

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Fiche technique</h2>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                <li>Places : {vehicule.seats}</li>
                <li>Boîte : {boiteFr[vehicule.gearboxType] ?? vehicule.gearboxType}</li>
                <li>Motorisation : {motorisationFr[vehicule.fuelType] ?? vehicule.fuelType}</li>
                <li>Immatriculation : {vehicule.licensePlate}</li>
                <li>Kilométrage : {Number(vehicule.initialMileage).toLocaleString('fr-FR')} km</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Avis clients ⭐ {note.toFixed(1)} ({vehicule.reviewsCount})</h2>
              <p className="text-sm text-muted-foreground">Aucun avis pour l'instant.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 min-w-[280px] h-fit">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">{tarifAffiche} $<span className="text-sm font-normal text-muted-foreground">/jour</span></h2>

            <Label>Date de début</Label>
            <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="mt-1 mb-4" />

            <Label>Date de fin</Label>
            <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="mt-1 mb-4" />

            {nombreJours > 0 && (
              <p className="text-sm mb-4">{nombreJours} jour(s) × {tarifAffiche} $ = <strong>{prixTotal} $</strong></p>
            )}

           <Button onClick={handleReserver} disabled={reservationLoading} className="w-full">
  {reservationLoading ? 'Réservation...' : 'Réserver ce véhicule'}
</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}