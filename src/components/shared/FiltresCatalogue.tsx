import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export interface Filtres {
  places: number | null;
  boite: string | null;
  motorisation: string | null;
  prixMax: number;
}

interface Props {
  filtres: Filtres;
  onChange: (filtres: Filtres) => void;
}

const placesItems = [
  { label: '2 places', value: '2' },
  { label: '5 places', value: '5' },
  { label: '7 places', value: '7' },
];
const boiteItems = [
  { label: 'Manuelle', value: 'Manuelle' },
  { label: 'Automatique', value: 'Automatique' },
];
const motorisationItems = [
  { label: 'Essence', value: 'Essence' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Électrique', value: 'Electrique' },
  { label: 'Hybride', value: 'Hybride' },
];

export default function FiltresCatalogue({ filtres, onChange }: Props) {
  return (
    <aside className="w-64 flex flex-col gap-6 p-5 bg-card rounded-2xl border h-fit">
      <h3 className="font-semibold text-foreground">Filtres</h3>

      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Capacité</Label>
        <Select
          items={placesItems}
          value={filtres.places ? String(filtres.places) : null}
          onValueChange={(val) => onChange({ ...filtres, places: val ? Number(val) : null })}
        >
          <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Toutes" /></SelectTrigger>
          <SelectContent>
            {placesItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Boîte de vitesse</Label>
        <Select items={boiteItems} value={filtres.boite} onValueChange={(val) => onChange({ ...filtres, boite: val })}>
          <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Toutes" /></SelectTrigger>
          <SelectContent>
            {boiteItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Motorisation</Label>
        <Select items={motorisationItems} value={filtres.motorisation} onValueChange={(val) => onChange({ ...filtres, motorisation: val })}>
          <SelectTrigger className="mt-1.5 w-full"><SelectValue placeholder="Toutes" /></SelectTrigger>
          <SelectContent>
            {motorisationItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Prix max : <span className="text-teal-600 font-semibold">{filtres.prixMax} $/jour</span>
        </Label>
        <input
          type="range"
          min={20}
          max={100}
          step={5}
          value={filtres.prixMax}
          onChange={(e) => onChange({ ...filtres, prixMax: Number(e.target.value) })}
          className="w-full mt-2 accent-teal-600"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => onChange({ places: null, boite: null, motorisation: null, prixMax: 100 })}
      >
        Réinitialiser
      </Button>
    </aside>
  );
}