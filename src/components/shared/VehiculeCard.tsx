import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import api from '@/services/api';
import type { Vehicle } from '@/services/vehiclesApi';

interface Props {
  vehicule: Vehicle;
}

interface VehiclePhoto {
  id: string;
  photoUrl: string;
  displayOrder: number | null;
  vehicleId: string;
}

const boiteFr: Record<string, string> = {
  MANUAL: 'Manu',
  AUTOMATIC: 'Auto',
};

const statutFr: Record<Vehicle['status'], string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'En location',
  MAINTENANCE: 'En maintenance',
  OUT_OF_SERVICE: 'Hors service',
};

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

export default function VehiculeCard({ vehicule }: Props) {
  const navigate = useNavigate();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(true);
  const [photoErreur, setPhotoErreur] = useState(false);

  const tarif = Number(vehicule.effectiveDailyRate);
  const note = Number(vehicule.averageRating) || 0;
  const nomVehicule = `${vehicule.brand} ${vehicule.model}`;

  useEffect(() => {
    const controller = new AbortController();

    setPhotoLoading(true);
    setPhotoErreur(false);
    setPhotoUrl(null);

    async function chargerPhoto() {
      try {
        const response = await api.get<VehiclePhoto[]>(
          `/vehicles/${vehicule.id}/photos`,
          { signal: controller.signal }
        );

        if (controller.signal.aborted) return;

        const photos = [...response.data].sort(
          (a, b) =>
            (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );

        const photo = photos.find((item) => item.photoUrl);

        if (photo) {
          const url = resolvePhotoUrl(photo.photoUrl);

          setPhotoUrl(url);
          setPhotoErreur(url === null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setPhotoErreur(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setPhotoLoading(false);
        }
      }
    }

    void chargerPhoto();

    return () => {
      controller.abort();
    };
  }, [vehicule.id]);

  return (
    <Card className="min-w-0 gap-0 overflow-hidden py-0 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {!photoLoading && photoUrl && !photoErreur ? (
          <img
            src={photoUrl}
            alt={nomVehicule}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={() => setPhotoErreur(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
            <span>{nomVehicule}</span>

            <span className="text-xs">
              {photoLoading
                ? 'Chargement de la photo...'
                : photoErreur
                  ? 'Photo indisponible'
                  : 'Aucune photo'}
            </span>
          </div>
        )}

        <Badge
          className={`absolute left-3 top-3 ${
            vehicule.status === 'AVAILABLE'
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
              : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
          }`}
        >
          ● {statutFr[vehicule.status] ?? vehicule.status}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold">{nomVehicule}</h3>

        <p className="text-sm text-muted-foreground">
          {vehicule.year}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              Places
            </p>
            <p className="text-sm font-semibold">
              {vehicule.seats}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              Boîte
            </p>
            <p className="text-sm font-semibold">
              {boiteFr[vehicule.gearboxType] ?? vehicule.gearboxType}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              Note
            </p>
            <p className="text-sm font-semibold">
              ⭐ {note.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">
            {Number.isFinite(tarif) ? `${tarif} $` : 'Tarif indisponible'}
            {Number.isFinite(tarif) && (
              <span className="text-sm font-normal text-muted-foreground">
                /jour
              </span>
            )}
          </span>

          <Button
            type="button"
            variant="link"
            className="p-0 text-teal-600"
            onClick={() => navigate(`/vehicule/${vehicule.id}`)}
            aria-label={`Voir ${nomVehicule}`}
          >
            Voir →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}