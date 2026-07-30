import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { mockVehicules, mockAvis } from '@/data/mockVehicules';

export default function VehiculeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const vehicule = mockVehicules.find((v) => v.id_vehicule === id);
  const avis = mockAvis.filter((a) => a.id_vehicule === id);

  if (!vehicule) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <p className="p-8 text-muted-foreground">Véhicule introuvable.</p>
      </div>
    );
  }

  const nombreJours = dateDebut && dateFin
    ? Math.max(1, Math.ceil((new Date(dateFin).getTime() - new Date(dateDebut).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const tarifAffiche = vehicule.tarif_journalier_specifique ?? vehicule.tarif_defaut_categorie;
  const prixTotal = nombreJours * tarifAffiche;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex gap-8 p-8 max-w-6xl mx-auto flex-wrap">
        <div className="flex-[2] min-w-[320px]">
          <img src={vehicule.photo_url} alt={`${vehicule.marque} ${vehicule.modele}`} className="w-full max-h-96 object-cover rounded-2xl" />

          <div className="flex items-center gap-3 mt-4">
            <h1 className="text-2xl font-bold">{vehicule.marque} {vehicule.modele}</h1>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">● Disponible</Badge>
          </div>
          <p className="text-muted-foreground">{vehicule.categorie} · {vehicule.anee}</p>

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Fiche technique</h2>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                <li>Places : {vehicule.nombre_places}</li>
                <li>Boîte : {vehicule.type_boite_vitesse}</li>
                <li>Motorisation : {vehicule.motorisation}</li>
                <li>Immatriculation : {vehicule.immatriculation}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Avis clients ⭐ {vehicule.note_moyenne} ({vehicule.nombre_avis})</h2>
              {avis.length === 0 && <p className="text-sm text-muted-foreground">Aucun avis pour l'instant.</p>}
              {avis.map((a) => (
                <div key={a.id} className="border-t py-3 first:border-t-0 first:pt-0">
                  <p className="font-medium text-sm">{a.auteur} — {'⭐'.repeat(a.note)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{a.commentaire}</p>
                </div>
              ))}
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

            <Button onClick={() => navigate('/login')} className="w-full">Réserver ce véhicule</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}