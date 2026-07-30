import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { mockReservationsAdmin as initial } from '@/data/mockReservationsAdmin';
import type { ReservationAdmin, StatutReservationAdmin } from '@/types/ReservationAdmin';

const statutLabel: Record<StatutReservationAdmin, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  ANNULEE: 'Annulée',
  TERMINEE: 'Terminée',
};

const statutColor: Record<StatutReservationAdmin, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-700',
  CONFIRMEE: 'bg-emerald-100 text-emerald-700',
  ANNULEE: 'bg-red-100 text-red-700',
  TERMINEE: 'bg-slate-100 text-slate-700',
};

export default function GestionReservations() {
  const [reservations, setReservations] = useState<ReservationAdmin[]>(initial);

  // Dialog Prolonger / Reporter
  const [dialogAction, setDialogAction] = useState<'prolonger' | 'reporter' | null>(null);
  const [reservationCible, setReservationCible] = useState<ReservationAdmin | null>(null);
  const [nouvelleDateFin, setNouvelleDateFin] = useState('');
  const [nouvelleDateDebut, setNouvelleDateDebut] = useState('');

  const valider = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? { ...r, statut: 'CONFIRMEE' } : r))
    );
  };

  const annuler = (id: string) => {
    if (!confirm('Confirmer l\'annulation de cette réservation ?')) return;
    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? { ...r, statut: 'ANNULEE' } : r))
    );
  };

  const ouvrirDialog = (action: 'prolonger' | 'reporter', r: ReservationAdmin) => {
    setDialogAction(action);
    setReservationCible(r);
    setNouvelleDateDebut(r.date_debut.slice(0, 16));
    setNouvelleDateFin(r.date_fin.slice(0, 16));
  };

  const confirmerDialog = () => {
    if (!reservationCible) return;
    setReservations((prev) =>
      prev.map((r) =>
        r.id_reservation === reservationCible.id_reservation
          ? { ...r, date_debut: nouvelleDateDebut, date_fin: nouvelleDateFin }
          : r
      )
    );
    setDialogAction(null);
    setReservationCible(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Réservations</h1>
        <p className="text-muted-foreground text-sm">{reservations.length} réservations au total</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id_reservation}>
                  <TableCell>{r.client_prenom} {r.client_nom}</TableCell>
                  <TableCell>{r.vehicule_marque} {r.vehicule_modele}</TableCell>
                  <TableCell>{new Date(r.date_debut).toLocaleString('fr-FR')}</TableCell>
                  <TableCell>{new Date(r.date_fin).toLocaleString('fr-FR')}</TableCell>
                  <TableCell>{r.prix_total} $</TableCell>
                  <TableCell>
                    <Badge className={`${statutColor[r.statut]} hover:${statutColor[r.statut]}`}>
                      {statutLabel[r.statut]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      {r.statut === 'EN_ATTENTE' && (
                        <Button size="sm" onClick={() => valider(r.id_reservation)}>Valider</Button>
                      )}
                      {(r.statut === 'EN_ATTENTE' || r.statut === 'CONFIRMEE') && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => ouvrirDialog('reporter', r)}>
                            Reporter
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => ouvrirDialog('prolonger', r)}>
                            Prolonger
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => annuler(r.id_reservation)}>
                            Annuler
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogAction !== null} onOpenChange={(open) => !open && setDialogAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'prolonger' ? 'Prolonger la réservation' : 'Reporter la réservation'}
              {reservationCible && ` — ${reservationCible.client_prenom} ${reservationCible.client_nom}`}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            {dialogAction === 'reporter' && (
              <div>
                <Label>Nouvelle date de début</Label>
                <Input
                  type="datetime-local"
                  value={nouvelleDateDebut}
                  onChange={(e) => setNouvelleDateDebut(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label>Nouvelle date de fin</Label>
              <Input
                type="datetime-local"
                value={nouvelleDateFin}
                onChange={(e) => setNouvelleDateFin(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={confirmerDialog}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}