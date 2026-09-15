import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { ReservationApi, ReservationStatus, PaginatedReservations } from '@/types/Reservation';
import PaiementAcompteDialog from '@/components/shared/PaiementAcompteDialog';

const statutLabel: Record<ReservationStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
  REJECTED: 'Rejetée',
};

const statutColor: Record<ReservationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  IN_PROGRESS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  COMPLETED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function MesReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const [dialogReservation, setDialogReservation] = useState<ReservationApi | null>(null);
  const [acomptesPayes, setAcomptesPayes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    api.get<PaginatedReservations>('/reservations', { params: { userId: user.id, page: 1, limit: 100 } })
      .then((res) => setReservations(res.data.items))
      .catch((err) => {
        if (err?.response?.status === 403) {
          setErreur("Cette fonctionnalité arrive bientôt — l'accès à tes réservations est en cours de finalisation côté serveur.");
        } else {
          setErreur('Impossible de charger tes réservations.');
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const categories: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  if (loading) return <p className="text-muted-foreground">Chargement...</p>;
  if (erreur) return <p className="text-red-600">{erreur}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mes Réservations</h1>
      <p className="text-muted-foreground text-sm mb-6">Historique et suivi de tes locations.</p>

      <Tabs defaultValue="PENDING" className="block w-full">
        <TabsList className="inline-flex w-auto h-auto bg-muted p-1 rounded-full gap-1">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-full px-4 py-1.5 text-sm h-auto data-[selected]:bg-background data-[selected]:shadow-sm"
            >
              {statutLabel[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => {
          const filtered = reservations.filter((r) => r.status === cat);

          return (
            <TabsContent key={cat} value={cat} className="flex flex-col gap-4 mt-6">
              {filtered.length === 0 && (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  Aucune réservation dans cette catégorie.
                </p>
              )}

              {filtered.map((r) => {
                const depositAmount = parseFloat(r.depositAmount);
                const acompteDejaEnvoye = acomptesPayes.has(r.id);

                return (
                  <Card key={r.id} className="overflow-hidden">
                    <CardContent className="p-4 flex gap-4 items-center flex-wrap">
                      <div className="flex-1 min-w-[180px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${statutColor[r.status]} border-none`}>
                            {statutLabel[r.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Du {new Date(r.startDate).toLocaleDateString('fr-FR')} au {new Date(r.endDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm font-medium mt-1">{r.totalPrice} $</p>
                        {depositAmount > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Acompte requis : {r.depositAmount} $
                          </p>
                        )}
                      </div>

                      {cat === 'PENDING' && depositAmount > 0 && (
                        acompteDejaEnvoye ? (
                          <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                            Paiement envoyé, en attente de confirmation
                          </Badge>
                        ) : (
                          <Button size="sm" onClick={() => setDialogReservation(r)}>
                            Payer l'acompte
                          </Button>
                        )
                      )}

                      {(cat === 'PENDING' || cat === 'CONFIRMED') && (
                        <Badge variant="outline">Modification possible via l'agence</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          );
        })}
      </Tabs>

      {dialogReservation && (
        <PaiementAcompteDialog
          open={!!dialogReservation}
          onOpenChange={(open) => !open && setDialogReservation(null)}
          reservationId={dialogReservation.id}
          montant={dialogReservation.depositAmount}
          onSuccess={() => {
            setAcomptesPayes((prev) => new Set(prev).add(dialogReservation.id));
          }}
        />
      )}
    </div>
  );
}