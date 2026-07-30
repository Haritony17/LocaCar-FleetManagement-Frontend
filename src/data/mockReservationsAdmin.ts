import type { ReservationAdmin } from '../types/ReservationAdmin';

export const mockReservationsAdmin: ReservationAdmin[] = [
  {
    id_reservation: 'R001', client_nom: 'Rakoto', client_prenom: 'Jean',
    vehicule_marque: 'Toyota', vehicule_modele: 'Corolla',
    date_debut: '2026-08-05T09:00', date_fin: '2026-08-10T18:00',
    prix_total: 150, statut: 'EN_ATTENTE',
  },
  {
    id_reservation: 'R002', client_nom: 'Rasoa', client_prenom: 'Marie',
    vehicule_marque: 'Hyundai', vehicule_modele: 'Tucson',
    date_debut: '2026-07-20T10:00', date_fin: '2026-07-30T10:00',
    prix_total: 500, statut: 'CONFIRMEE',
  },
  {
    id_reservation: 'R003', client_nom: 'Andry', client_prenom: 'Paul',
    vehicule_marque: 'Renault', vehicule_modele: 'Clio',
    date_debut: '2026-06-01T09:00', date_fin: '2026-06-05T18:00',
    prix_total: 100, statut: 'TERMINEE',
  },
  {
    id_reservation: 'R004', client_nom: 'Hery', client_prenom: 'Sarah',
    vehicule_marque: 'Kia', vehicule_modele: 'Sportage',
    date_debut: '2026-05-10T09:00', date_fin: '2026-05-15T18:00',
    prix_total: 300, statut: 'ANNULEE',
  },
];