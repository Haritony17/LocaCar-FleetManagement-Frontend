import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';

import api from '@/services/api';
import { fetchVehicles, type Vehicle } from '@/services/vehiclesApi';
import { createReservation } from '@/services/reservationCreateApi';
import { getOrCreateMyCustomer } from '@/services/customersApi';
import { useAuth } from '@/context/AuthContext';

interface VehiclePhoto {
  id: string;
  photoUrl: string;
  displayOrder: number | null;
}

const MILLISECONDES_PAR_JOUR = 1000 * 60 * 60 * 24;

const boiteFr: Record<string, string> = {
  MANUAL: 'Manuelle',
  AUTOMATIC: 'Automatique',
};

const motorisationFr: Record<string, string> = {
  PETROL: 'Essence',
  DIESEL: 'Diesel',
  HYBRID: 'Hybride',
  ELECTRIC: 'Électrique',
};

const statutFr: Record<Vehicle['status'], string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'En location',
  MAINTENANCE: 'En maintenance',
  OUT_OF_SERVICE: 'Hors service',
};

function toAtomFormat(date: string): string {
  return `${date}T00:00:00+00:00`;
}

function resolvePhotoUrl(photoUrl: string): string | null {
  try {
    const backend = new URL(
      api.defaults.baseURL || 'http://localhost:8000/api',
      window.location.origin
    );

    const url = new URL(photoUrl, `${backend.origin}/`);

    return ['http:', 'https:'].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function getErreurReservation(error: unknown): string {
  if (!isAxiosError(error)) {
    return 'Une erreur inattendue est survenue.';
  }

  if (!error.response) {
    return 'Impossible de joindre le serveur. Réessaie dans un instant.';
  }

  switch (error.response.status) {
    case 401:
      return 'Ta session a expiré. Reconnecte-toi pour réserver.';
    case 403:
      return "Ton compte n'est pas autorisé à effectuer cette réservation.";
    case 409:
      return 'Ce véhicule est déjà réservé pour les dates sélectionnées.';
    default: {
      const data = error.response.data;

      if (data && typeof data === 'object') {
        const message = data.detail || data.message || data.error;

        if (typeof message === 'string') {
          return message;
        }
      }

      return 'Impossible de créer la réservation. Vérifie tes informations.';
    }
  }
}

export default function VehiculeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [vehicule, setVehicule] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(true);

  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [reservationLoading, setReservationLoading] = useState(false);
  const [erreurReservation, setErreurReservation] = useState('');

  useEffect(() => {
    let actif = true;

    setLoading(true);
    setErreur('');
    setVehicule(null);
    setDateDebut('');
    setDateFin('');
    setErreurReservation('');

    async function chargerVehicule() {
      try {
        const vehicles = await fetchVehicles();

        if (!actif) return;

        const found = vehicles.find((vehicle) => vehicle.id === id);

        if (!found) {
          setErreur('Véhicule introuvable.');
          return;
        }

        setVehicule(found);
      } catch {
        if (actif) {
          setErreur('Impossible de charger ce véhicule.');
        }
      } finally {
        if (actif) {
          setLoading(false);
        }
      }
    }

    void chargerVehicule();

    return () => {
      actif = false;
    };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    setPhotoUrl(null);
    setPhotoLoading(true);

    async function chargerPhoto() {
      try {
        const response = await api.get<VehiclePhoto[]>(
          `/vehicles/${id}/photos`,
          { signal: controller.signal }
        );

        if (controller.signal.aborted) return;

        const photos = [...response.data].sort(
          (a, b) =>
            (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );

        const photo = photos.find((item) => item.photoUrl);

        if (photo) {
          setPhotoUrl(resolvePhotoUrl(photo.photoUrl));
        }
      } catch {
        if (!controller.signal.aborted) {
          setPhotoUrl(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setPhotoLoading(false);
        }
      }
    }

    if (id) {
      void chargerPhoto();
    } else {
      setPhotoLoading(false);
    }

    return () => controller.abort();
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
        <p role="alert" className="p-8 text-red-600">
          {erreur || 'Véhicule introuvable.'}
        </p>
      </div>
    );
  }

  const tarifAffiche = Number(vehicule.effectiveDailyRate);
  const tarifValide = Number.isFinite(tarifAffiche) && tarifAffiche > 0;
  const note = Number(vehicule.averageRating) || 0;

  const debutTimestamp = dateDebut
    ? Date.parse(toAtomFormat(dateDebut))
    : Number.NaN;

  const finTimestamp = dateFin
    ? Date.parse(toAtomFormat(dateFin))
    : Number.NaN;

  const datesValides =
    Number.isFinite(debutTimestamp) &&
    Number.isFinite(finTimestamp) &&
    finTimestamp > debutTimestamp;

  const nombreJours = datesValides
    ? Math.floor(
        (finTimestamp - debutTimestamp) / MILLISECONDES_PAR_JOUR
      )
    : 0;

  const prixTotal = tarifValide ? nombreJours * tarifAffiche : 0;
  const acompte = (prixTotal / 2).toFixed(2);

  const erreurDates =
    dateDebut && dateFin && !datesValides
      ? 'La date de fin doit être après la date de début.'
      : '';

  const indisponible =
    vehicule.status === 'MAINTENANCE' ||
    vehicule.status === 'OUT_OF_SERVICE';

  const handleReserver = async () => {
    if (reservationLoading) return;

    setErreurReservation('');

    if (!isAuthenticated || !user) {
      navigate('/login', {
        state: { from: `/vehicule/${id}` },
      });
      return;
    }

    if (!dateDebut || !dateFin) {
      setErreurReservation('Merci de sélectionner les dates.');
      return;
    }

    if (!datesValides) {
      setErreurReservation(
        'La date de fin doit être après la date de début.'
      );
      return;
    }

    if (!tarifValide) {
      setErreurReservation('Le tarif de ce véhicule est indisponible.');
      return;
    }

    if (indisponible) {
      setErreurReservation(
        "Ce véhicule n'est pas disponible à la réservation."
      );
      return;
    }

    setReservationLoading(true);

    try {
      const customer = await getOrCreateMyCustomer();

      await createReservation({
        startDate: toAtomFormat(dateDebut),
        endDate: toAtomFormat(dateFin),
        vehicleId: vehicule.id,
        customerId: customer.id,
        depositAmount: acompte,
      });

      navigate('/mon-compte/reservations');
    } catch (error: unknown) {
      setErreurReservation(getErreurReservation(error));
    } finally {
      setReservationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
        <div className="min-w-0">
          {/* Photo du véhicule */}
          <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-muted sm:h-80 lg:h-96">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${vehicule.brand} ${vehicule.model}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={() => setPhotoUrl(null)}
              />
            ) : (
              <div className="px-4 text-center text-muted-foreground">
                <p>
                  {vehicule.brand} {vehicule.model}
                </p>
                <p className="mt-2 text-sm">
                  {photoLoading
                    ? 'Chargement de la photo...'
                    : 'Photo indisponible'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">
              {vehicule.brand} {vehicule.model}
            </h1>

            <Badge
              variant="outline"
              className={
                vehicule.status === 'AVAILABLE'
                  ? 'border-emerald-300 text-emerald-700 dark:text-emerald-400'
                  : 'border-amber-300 text-amber-700 dark:text-amber-400'
              }
            >
              {statutFr[vehicule.status] ?? vehicule.status}
            </Badge>
          </div>

          <p className="text-muted-foreground">{vehicule.year}</p>

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="mb-3 font-semibold">Fiche technique</h2>

              <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Places : {vehicule.seats}</li>
                <li>
                  Boîte :{' '}
                  {boiteFr[vehicule.gearboxType] ?? vehicule.gearboxType}
                </li>
                <li>
                  Motorisation :{' '}
                  {motorisationFr[vehicule.fuelType] ?? vehicule.fuelType}
                </li>
                <li>Immatriculation : {vehicule.licensePlate}</li>
                <li>
                  Kilométrage :{' '}
                  {Number(vehicule.initialMileage).toLocaleString('fr-FR')} km
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="mb-3 font-semibold">
                Avis clients ⭐ {note.toFixed(1)} ({vehicule.reviewsCount})
              </h2>

              <p className="text-sm text-muted-foreground">
                {vehicule.reviewsCount > 0
                  ? "Le détail des avis n'est pas encore affiché."
                  : "Aucun avis pour l'instant."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire de réservation */}
        <Card className="h-fit w-full">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">
              {tarifValide ? `${tarifAffiche} $` : 'Tarif indisponible'}
              {tarifValide && (
                <span className="text-sm font-normal text-muted-foreground">
                  /jour
                </span>
              )}
            </h2>

            <Label htmlFor="date-debut">Date de début</Label>
            <Input
              id="date-debut"
              type="date"
              value={dateDebut}
              disabled={reservationLoading}
              onChange={(event) => {
                setDateDebut(event.target.value);
                setErreurReservation('');
              }}
              className="mt-1 mb-4"
            />

            <Label htmlFor="date-fin">Date de fin</Label>
            <Input
              id="date-fin"
              type="date"
              value={dateFin}
              min={dateDebut || undefined}
              disabled={reservationLoading}
              onChange={(event) => {
                setDateFin(event.target.value);
                setErreurReservation('');
              }}
              className="mt-1 mb-4"
            />

            {erreurDates && (
              <p className="mb-4 text-sm text-red-600">
                {erreurDates}
              </p>
            )}

            {datesValides && tarifValide && (
              <div className="mb-4 space-y-2 text-sm">
                <p>
                  {nombreJours} jour(s) × {tarifAffiche} $ ={' '}
                  <strong>{prixTotal.toFixed(2)} $</strong>
                </p>
                <p className="text-muted-foreground">
                  Acompte de 50 % : {acompte} $
                </p>
              </div>
            )}

            {indisponible && (
              <p className="mb-4 text-sm text-amber-700">
                Ce véhicule est actuellement indisponible.
              </p>
            )}

            {erreurReservation && (
              <p role="alert" className="mb-4 text-sm text-red-600">
                {erreurReservation}
              </p>
            )}

            <Button
              type="button"
              onClick={handleReserver}
              disabled={
                reservationLoading ||
                indisponible ||
                !tarifValide
              }
              className="w-full"
            >
              {reservationLoading
                ? 'Réservation...'
                : 'Réserver ce véhicule'}
            </Button>

            <p className="mt-3 text-xs text-muted-foreground">
              La disponibilité aux dates choisies sera vérifiée
              lors de la réservation.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}