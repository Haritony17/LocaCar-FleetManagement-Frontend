import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { mockAgences } from '@/data/mockAgences';

export default function MoteurRecherche() {
  const navigate = useNavigate();
  const [agence, setAgence] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [erreur, setErreur] = useState('');

  const handleSearch = () => {
    if (!dateDebut || !dateFin) {
      setErreur('Merci de sélectionner les dates de début et de fin.');
      return;
    }
    if (new Date(dateFin) <= new Date(dateDebut)) {
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
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] text-left">
          <Label>Agence de retrait</Label>
          <Select value={agence} onValueChange={setAgence}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Toutes les agences" />
            </SelectTrigger>
            <SelectContent>
              {mockAgences.map((a) => (
                <SelectItem key={a.id_agence} value={a.id_agence}>{a.nom} — {a.ville}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[180px] text-left">
          <Label>Date de début</Label>
          <Input type="datetime-local" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className="mt-1" />
        </div>

        <div className="flex-1 min-w-[180px] text-left">
          <Label>Date de fin</Label>
          <Input type="datetime-local" value={dateFin} onChange={(e) => setDateFin(e.target.value)} className="mt-1" />
        </div>

        <Button onClick={handleSearch}>Rechercher</Button>

        {erreur && <p className="text-sm text-red-600 w-full text-left">{erreur}</p>}
      </CardContent>
    </Card>
  );
}