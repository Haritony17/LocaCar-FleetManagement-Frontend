import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fetchAllReservations, fetchAllVehicles } from '@/services/reservationsApi';
import type { ReservationApi } from '@/types/Reservation';
import type { VehicleApi } from '@/types/Vehicule';

const STATUT_COULEUR: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#0d9488',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#64748b',
  CANCELLED: '#ef4444',
  REJECTED: '#ef4444',
};

const STATUT_LABEL: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmées',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminées',
  CANCELLED: 'Annulées',
  REJECTED: 'Rejetées',
};

export default function DashboardAdmin() {
  const [reservations, setReservations] = useState<ReservationApi[]>([]);
  const [vehicles, setVehicles] = useState<VehicleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    Promise.all([fetchAllReservations(), fetchAllVehicles()])
      .then(([res, veh]) => {
        setReservations(res);
        setVehicles(veh);
      })
      .catch(() => setErreur('Impossible de charger les données du dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Chargement du tableau de bord...</p>;
  }

  if (erreur) {
    return <p className="text-red-600">{erreur}</p>;
  }

  // --- Calculs des KPIs ---
  const revenuTotal = reservations
    .filter((r) => r.status === 'COMPLETED' || r.status === 'IN_PROGRESS')
    .reduce((sum, r) => sum + parseFloat(r.totalPrice || '0'), 0);

  const dureesEnJours = reservations
    .filter((r) => r.status !== 'CANCELLED' && r.status !== 'REJECTED')
    .map((r) => {
      const debut = new Date(r.startDate).getTime();
      const fin = new Date(r.endDate).getTime();
      return Math.max(1, Math.round((fin - debut) / (1000 * 60 * 60 * 24)));
    });
  const dureeMoyenne = dureesEnJours.length
    ? (dureesEnJours.reduce((a, b) => a + b, 0) / dureesEnJours.length).toFixed(1)
    : '0';

  const totalDepensesEntretien = 0; // pas encore de données d'entretien branchées

  const vehiculeIdToLabel = (id: string) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? `${v.brand} ${v.model}` : 'Inconnu';
  };

  const reservationsParVehiculeMap = new Map<string, number>();
  reservations.forEach((r) => {
    const label = vehiculeIdToLabel(r.vehicleId);
    reservationsParVehiculeMap.set(label, (reservationsParVehiculeMap.get(label) ?? 0) + 1);
  });
  const reservationsParVehicule = Array.from(reservationsParVehiculeMap.entries())
    .map(([vehicule, reservations]) => ({ vehicule, reservations }))
    .sort((a, b) => b.reservations - a.reservations)
    .slice(0, 6);

  const vehiculePlusDemande = reservationsParVehicule[0]?.vehicule ?? '—';

  const caParVehiculeMap = new Map<string, number>();
  reservations
    .filter((r) => r.status === 'COMPLETED' || r.status === 'IN_PROGRESS')
    .forEach((r) => {
      const label = vehiculeIdToLabel(r.vehicleId);
      caParVehiculeMap.set(label, (caParVehiculeMap.get(label) ?? 0) + parseFloat(r.totalPrice || '0'));
    });
  const caParVehicule = Array.from(caParVehiculeMap.entries())
    .map(([vehicule, ca]) => ({ vehicule, ca: Math.round(ca) }))
    .sort((a, b) => b.ca - a.ca)
    .slice(0, 6);

  const statutsMap = new Map<string, number>();
  reservations.forEach((r) => {
    statutsMap.set(r.status, (statutsMap.get(r.status) ?? 0) + 1);
  });
  const statutsReservations = Array.from(statutsMap.entries()).map(([statut, valeur]) => ({
    statut: STATUT_LABEL[statut] ?? statut,
    valeur,
    couleur: STATUT_COULEUR[statut] ?? '#94a3b8',
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble des réservations et de la flotte.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Revenu total</p>
            <p className="text-2xl font-bold mt-1">{revenuTotal.toFixed(0)} $</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Durée moyenne</p>
            <p className="text-2xl font-bold mt-1">{dureeMoyenne} j</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Réservations</p>
            <p className="text-2xl font-bold mt-1">{reservations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Véhicule top</p>
            <p className="text-lg font-bold mt-1">{vehiculePlusDemande}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Dépenses entretien</p>
            <p className="text-2xl font-bold mt-1">{totalDepensesEntretien} $</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Véhicules actifs</p>
            <p className="text-2xl font-bold mt-1">{vehicles.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <p className="font-semibold mb-4">Réservations par véhicule</p>
            {reservationsParVehicule.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée pour l'instant.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={reservationsParVehicule}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="vehicule" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="reservations" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="font-semibold mb-4">Répartition des statuts</p>
            {statutsReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée pour l'instant.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statutsReservations}
                    dataKey="valeur"
                    nameKey="statut"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {statutsReservations.map((entry) => (
                      <Cell key={entry.statut} fill={entry.couleur} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <p className="font-semibold mb-4">Chiffre d'affaires par véhicule</p>
            {caParVehicule.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée pour l'instant.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={caParVehicule} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="vehicule" type="category" fontSize={12} width={80} />
                  <Tooltip />
                  <Bar dataKey="ca" fill="#0f766e" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}