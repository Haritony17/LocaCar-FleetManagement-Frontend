import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  mockKpis,
  mockReservationsParVehicule,
  mockStatutsReservations,
  mockCAparVehicule,
} from '@/data/mockDashboards';

export default function DashboardAdmin() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble des réservations et de la flotte.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Revenu total</p>
            <p className="text-2xl font-bold mt-1">{mockKpis.revenuTotal} $</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Durée moyenne</p>
            <p className="text-2xl font-bold mt-1">{mockKpis.dureeMoyenneJours} j</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Réservations</p>
            <p className="text-2xl font-bold mt-1">{mockKpis.totalReservations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Véhicule top</p>
            <p className="text-lg font-bold mt-1">{mockKpis.vehiculePlusDemande}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Dépenses entretien</p>
            <p className="text-2xl font-bold mt-1">{mockKpis.totalDepensesEntretien} $</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Km parcourus</p>
            <p className="text-2xl font-bold mt-1">{mockKpis.totalKm.toLocaleString('fr-FR')} km</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <p className="font-semibold mb-4">Réservations par véhicule</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockReservationsParVehicule}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="vehicule" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="reservations" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="font-semibold mb-4">Répartition des statuts</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={mockStatutsReservations}
                  dataKey="valeur"
                  nameKey="statut"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {mockStatutsReservations.map((entry) => (
                    <Cell key={entry.statut} fill={entry.couleur} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <p className="font-semibold mb-4">Chiffre d'affaires par véhicule</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockCAparVehicule} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="vehicule" type="category" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="ca" fill="#0f766e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}