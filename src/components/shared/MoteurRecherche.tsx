import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchAgencies,
  type Agency,
} from '@/services/vehiclesApi';

export default function MoteurRecherche() {
  const navigate = useNavigate();

  const [agence, setAgence] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [erreur, setErreur] = useState('');

  const [agences, setAgences] = useState<Agency[]>([]);
  const [loadingAgences, setLoadingAgences] = useState(true);
  const [erreurAgences, setErreurAgences] = useState('');

  useEffect(() => {
    let actif = true;

    async function chargerAgences() {
      try {
        const data = await fetchAgencies();

        if (actif) {
          setAgences(
            data.filter((item) => item.status === 'ACTIVE')
          );
        }
      } catch {
        if (actif) {
          setErreurAgences('Impossible de charger les agences.');
        }
      } finally {
        if (actif) {
          setLoadingAgences(false);
        }
      }
    }

    void chargerAgences();

    return () => {
      actif = false;
    };
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!dateDebut || !dateFin) {
      setErreur('Merci de sélectionner les dates de début et de fin.');
      return;
    }

    const debut = new Date(dateDebut).getTime();
    const fin = new Date(dateFin).getTime();

    if (
      !Number.isFinite(debut) ||
      !Number.isFinite(fin) ||
      fin <= debut
    ) {
      setErreur('La date de fin doit être après la date de début.');
      return;
    }

    setErreur('');

    const params = new URLSearchParams();

    if (agence) params.set('agence', agence);
    params.set('debut', dateDebut);
    params.set('fin', dateFin);

    navigate(`/catalogue?${params.toString()}`);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl min-w-0">
      <CardContent className="p-4 sm:p-6">
        <form
          onSubmit={handleSearch}
          className="grid min-w-0 grid-cols-1 items-end gap-4 text-left sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <div className="min-w-0">
            <Label>Agence de retrait</Label>

            <Select
              value={agence || 'ALL'}
              onValueChange={(value) =>
                setAgence(value === 'ALL' ? '' : (value ?? ''))
              }
              disabled={loadingAgences || Boolean(erreurAgences)}
            >
              <SelectTrigger className="mt-1 w-full min-w-0">
                <SelectValue placeholder="Toutes les agences" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">
                  Toutes les agences
                </SelectItem>

                {agences.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} — {item.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {loadingAgences && (
              <p
                role="status"
                className="mt-1 text-xs text-muted-foreground"
              >
                Chargement des agences...
              </p>
            )}

            {erreurAgences && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {erreurAgences} Tu peux rechercher dans toutes les agences.
              </p>
            )}
          </div>

          <div className="min-w-0">
            <Label htmlFor="recherche-debut">Date de début</Label>
            <Input
              id="recherche-debut"
              type="datetime-local"
              value={dateDebut}
              onChange={(event) => {
                setDateDebut(event.target.value);
                setErreur('');
              }}
              className="mt-1 w-full min-w-0 max-w-full"
              required
            />
          </div>

          <div className="min-w-0">
            <Label htmlFor="recherche-fin">Date de fin</Label>
            <Input
              id="recherche-fin"
              type="datetime-local"
              value={dateFin}
              min={dateDebut || undefined}
              onChange={(event) => {
                setDateFin(event.target.value);
                setErreur('');
              }}
              className="mt-1 w-full min-w-0 max-w-full"
              required
            />
          </div>

          <Button type="submit" className="w-full lg:w-auto">
            Rechercher
          </Button>

          {erreur && (
            <p
              role="alert"
              className="text-sm text-red-600 sm:col-span-2 lg:col-span-4"
            >
              {erreur}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}