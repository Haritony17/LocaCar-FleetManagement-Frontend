import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Vehicule } from '@/types/Vehicule';

interface Props {
  vehicule: Vehicule;
}

export default function VehiculeCard({ vehicule }: Props) {
  const navigate = useNavigate();
  const tarifAffiche = vehicule.tarif_journalier_specifique ?? vehicule.tarif_defaut_categorie;

  return (
    <Card className="overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition py-0 gap-0">
      <div className="relative">
        <img
          src={vehicule.photo_url}
          alt={`${vehicule.marque} ${vehicule.modele}`}
          className="w-full h-40 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          ● Disponible
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold">{vehicule.marque} {vehicule.modele}</h3>
        <p className="text-sm text-muted-foreground">{vehicule.categorie} · {vehicule.anee}</p>

        <div className="grid grid-cols-3 gap-2 text-center border-t mt-4 pt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Places</p>
            <p className="font-semibold text-sm">{vehicule.nombre_places}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Boîte</p>
            <p className="font-semibold text-sm">{vehicule.type_boite_vitesse.slice(0, 4)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Note</p>
            <p className="font-semibold text-sm">⭐ {vehicule.note_moyenne}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">
            {tarifAffiche} $<span className="text-sm font-normal text-muted-foreground">/jour</span>
          </span>
          <Button
            variant="link"
            className="text-teal-600 p-0"
            onClick={() => navigate(`/vehicule/${vehicule.id_vehicule}`)}
          >
            Voir →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}