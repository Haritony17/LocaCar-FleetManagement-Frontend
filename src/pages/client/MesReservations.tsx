import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getReservations } from '@/data/reservationsStore';
import type { StatutReservation } from '@/types/Reservation';

const statutLabel: Record<StatutReservation, string> = {
  A_VENIR: 'À venir',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};

const statutColor: Record<StatutReservation, string> = {
  A_VENIR: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  EN_COURS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  TERMINEE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  ANNULEE: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function MesReservations() {
  const reservations = getReservations();
  const categories: StatutReservation[] = ['A_VENIR', 'EN_COURS', 'TERMINEE', 'ANNULEE'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mes Réservations</h1>
      <p className="text-muted-foreground text-sm mb-6">Historique et suivi de tes locations.</p>

      <Tabs defaultValue="A_VENIR" className="block w-full">
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
          const filtered = reservations.filter((r) => r.statut === cat);

          return (
            <TabsContent key={cat} value={cat} className="flex flex-col gap-4 mt-6">
              {filtered.length === 0 && (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  Aucune réservation dans cette catégorie.
                </p>
              )}

              {filtered.map((r) => (
                <Card key={r.id_reservation} className="overflow-hidden">
                  <CardContent className="p-4 flex gap-4 items-center flex-wrap">
                    <img
                      src={r.vehicule_photo}
                      alt={`${r.vehicule_marque} ${r.vehicule_modele}`}
                      className="w-28 h-20 object-cover rounded-xl shrink-0"
                    />

                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{r.vehicule_marque} {r.vehicule_modele}</p>
                        <Badge className={`${statutColor[r.statut]} border-none`}>
                          {statutLabel[r.statut]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Du {new Date(r.date_debut).toLocaleDateString('fr-FR')} au {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm font-medium mt-1">{r.prix_total} $</p>
                    </div>

                    {(cat === 'A_VENIR' || cat === 'EN_COURS') && (
                      <div className="flex gap-2">
                        {cat === 'A_VENIR' && <Button variant="outline" size="sm">Reporter</Button>}
                        <Button variant="outline" size="sm">Prolonger</Button>
                        <Button variant="destructive" size="sm">Annuler</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}