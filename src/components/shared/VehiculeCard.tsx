import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Vehicle } from '@/services/vehiclesApi';

interface Props {
  vehicule: Vehicle;
}

const boiteFr: Record<string, string> = { MANUAL: 'Manu', AUTOMATIC: 'Auto' };

export default function VehiculeCard({ vehicule }: Props) {
  const navigate = useNavigate();
  const tarif = parseFloat(vehicule.effectiveDailyRate);
  const note = parseFloat(vehicule.averageRating) || 0;

  return (
    <Card className="overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition py-0 gap-0">
      <div className="relative">
        <div className="w-full h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">
          {vehicule.brand} {vehicule.model}
        </div>
        <Badge className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          ● Disponible
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold">{vehicule.brand} {vehicule.model}</h3>
        <p className="text-sm text-muted-foreground">{vehicule.year}</p>

        <div className="grid grid-cols-3 gap-2 text-center border-t mt-4 pt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Places</p>
            <p className="font-semibold text-sm">{vehicule.seats}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Boîte</p>
            <p className="font-semibold text-sm">{boiteFr[vehicule.gearboxType] ?? vehicule.gearboxType}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Note</p>
            <p className="font-semibold text-sm">⭐ {note.toFixed(1)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">
            {tarif} $<span className="text-sm font-normal text-muted-foreground">/jour</span>
          </span>
          <Button
            variant="link"
            className="text-teal-600 p-0"
            onClick={() => navigate(`/vehicule/${vehicule.id}`)}
          >
            Voir →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}