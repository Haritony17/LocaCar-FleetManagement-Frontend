import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { mockVehicules as initialVehicules } from '@/data/mockVehicules';
import type { Vehicule, StatutVehicule } from '@/types/Vehicule';

const statutLabel: Record<StatutVehicule, string> = {
  DISPONIBLE: 'Disponible',
  LOUEE: 'Louée',
  NETTOYAGE: 'Nettoyage',
  EN_MAINTENANCE: 'En maintenance',
};

const statutColor: Record<StatutVehicule, string> = {
  DISPONIBLE: 'bg-emerald-100 text-emerald-700',
  LOUEE: 'bg-blue-100 text-blue-700',
  NETTOYAGE: 'bg-amber-100 text-amber-700',
  EN_MAINTENANCE: 'bg-red-100 text-red-700',
};

export default function GestionFlotte() {
  const [vehicules, setVehicules] = useState<Vehicule[]>(initialVehicules);
  const [recherche, setRecherche] = useState('');

  // Dialog changement de statut
  const [vehiculeStatutId, setVehiculeStatutId] = useState<string | null>(null);
  const [nouveauStatut, setNouveauStatut] = useState<StatutVehicule>('DISPONIBLE');
  const [motif, setMotif] = useState('');

  const vehiculesFiltres = vehicules.filter((v) =>
    `${v.marque} ${v.modele} ${v.immatriculation}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const ouvrirDialogStatut = (v: Vehicule) => {
    setVehiculeStatutId(v.id_vehicule);
    setNouveauStatut(v.statut);
    setMotif('');
  };

  const confirmerChangementStatut = () => {
    if (!motif.trim()) {
      alert('Le motif est obligatoire.');
      return;
    }
    setVehicules((prev) =>
      prev.map((v) =>
        v.id_vehicule === vehiculeStatutId ? { ...v, statut: nouveauStatut } : v
      )
    );
    setVehiculeStatutId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion de la Flotte</h1>
          <p className="text-muted-foreground text-sm">{vehicules.length} véhicules enregistrés</p>
        </div>
        <Button>+ Ajouter un véhicule</Button>
      </div>

      <Input
        placeholder="Rechercher par marque, modèle, immatriculation..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Tarif/jour</TableHead>
                <TableHead>Km</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehiculesFiltres.map((v) => {
                const tarifAffiche = v.tarif_journalier_specifique ?? v.tarif_defaut_categorie;
                const estFallback = v.tarif_journalier_specifique === null;

                return (
                  <TableRow key={v.id_vehicule}>
                    <TableCell className="flex items-center gap-3">
                      <img src={v.photo_url} alt="" className="w-12 h-9 object-cover rounded" />
                      <div>
                        <p className="font-medium">{v.marque} {v.modele}</p>
                        <p className="text-xs text-muted-foreground">{v.anee}</p>
                      </div>
                    </TableCell>
                    <TableCell>{v.immatriculation}</TableCell>
                    <TableCell>{v.categorie}</TableCell>
                    <TableCell>
                      {tarifAffiche} $
                      {estFallback && <span className="text-xs text-muted-foreground ml-1">(défaut)</span>}
                    </TableCell>
                    <TableCell>{v.compteur_km_initial.toLocaleString('fr-FR')} km</TableCell>
                    <TableCell>
                      <Badge className={`${statutColor[v.statut]} hover:${statutColor[v.statut]}`}>
                        {statutLabel[v.statut]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={vehiculeStatutId === v.id_vehicule} onOpenChange={(open) => !open && setVehiculeStatutId(null)}>
                        <DialogTrigger render={
    <Button variant="outline" size="sm" onClick={() => ouvrirDialogStatut(v)}>
      Changer statut
    </Button>
  }
/>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Changer le statut — {v.marque} {v.modele}</DialogTitle>
                          </DialogHeader>

                          <div className="flex flex-col gap-4 mt-2">
                            <div>
                              <Label>Nouveau statut</Label>
                              <Select value={nouveauStatut} onValueChange={(val) => setNouveauStatut(val as StatutVehicule)}>
                                <SelectTrigger className="mt-1 w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                                  <SelectItem value="LOUEE">Louée</SelectItem>
                                  <SelectItem value="NETTOYAGE">Nettoyage</SelectItem>
                                  <SelectItem value="EN_MAINTENANCE">En maintenance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Motif du changement (obligatoire)</Label>
                              <Textarea
                                value={motif}
                                onChange={(e) => setMotif(e.target.value)}
                                placeholder="Ex : Passage en maintenance pour changement des plaquettes de frein"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <DialogFooter className="mt-4">
                            <Button onClick={confirmerChangementStatut}>Confirmer</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}