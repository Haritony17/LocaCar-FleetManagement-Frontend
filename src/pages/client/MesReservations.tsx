import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockReservations } from '@/data/mockReservations';
import type { StatutReservation } from '@/types/Reservation';

const statutLabel: Record<StatutReservation, string> = {
  A_VENIR: 'À venir',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};

const statutColor: Record<StatutReservation, string> = {
  A_VENIR: 'bg-blue-100 text-blue-700',
  EN_COURS: 'bg-emerald-100 text-emerald-700',
  TERMINEE: 'bg-slate-100 text-slate-700',
  ANNULEE: 'bg-red-100 text-red-700',
};

export default function MesReservations() {
  const categories: StatutReservation[] = ['A_VENIR', 'EN_COURS', 'TERMINEE', 'ANNULEE'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mes Réservations</h1>
      <p className="text-muted-foreground text-sm mb-6">Historique et suivi de tes locations.</p>

      <Tabs defaultValue="A_VENIR">
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{statutLabel[cat]}</TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => {
          const reservations = mockReservations.filter((r) => r.statut === cat);

          return (
            <TabsContent key={cat} value={cat} className="flex flex-col gap-4 mt-4">
              {reservations.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucune réservation dans cette catégorie.</p>
              )}

              {reservations.map((r) => (
                <Card key={r.id_reservation}>
                  <CardContent className="p-4 flex gap-4 items-center">
                    <img
                      src={r.vehicule_photo}
                      alt={`${r.vehicule_marque} ${r.vehicule_modele}`}
                      className="w-24 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{r.vehicule_marque} {r.vehicule_modele}</p>
                        <Badge className={`${statutColor[r.statut]} hover:${statutColor[r.statut]}`}>
                          {statutLabel[r.statut]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Du {new Date(r.date_debut).toLocaleDateString('fr-FR')} au {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm font-medium mt-1">{r.prix_total} $</p>
                    </div>

                    {(cat === 'A_VENIR' || cat === 'EN_COURS') && (
                      <div className="flex gap-2">
                        {cat === 'A_VENIR' && (
                          <Button variant="outline" size="sm">Reporter</Button>
                        )}
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