export const mockKpis = {
  revenuTotal: 4850,
  dureeMoyenneJours: 5.2,
  totalReservations: 42,
  vehiculePlusDemande: 'Toyota Corolla',
  totalDepensesEntretien: 620,
  totalKm: 18450,
};

export const mockReservationsParVehicule = [
  { vehicule: 'Corolla', reservations: 14 },
  { vehicule: 'Tucson', reservations: 9 },
  { vehicule: 'Clio', reservations: 11 },
  { vehicule: 'Sportage', reservations: 5 },
  { vehicule: 'Leaf', reservations: 3 },
];

export const mockStatutsReservations = [
  { statut: 'Confirmées', valeur: 28, couleur: '#0d9488' },
  { statut: 'Annulées', valeur: 6, couleur: '#ef4444' },
  { statut: 'Prolongées', valeur: 5, couleur: '#3b82f6' },
  { statut: 'En attente', valeur: 3, couleur: '#f59e0b' },
];

export const mockCAparVehicule = [
  { vehicule: 'Corolla', ca: 1400 },
  { vehicule: 'Tucson', ca: 1350 },
  { vehicule: 'Clio', ca: 900 },
  { vehicule: 'Sportage', ca: 800 },
  { vehicule: 'Leaf', ca: 400 },
];