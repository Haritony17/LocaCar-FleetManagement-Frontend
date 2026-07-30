export type StatutReservation = 'A_VENIR' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

export interface Reservation {
  id_reservation: string;
  vehicule_marque: string;
  vehicule_modele: string;
  vehicule_photo: string;
  date_debut: string;
  date_fin: string;
  prix_total: number;
  statut: StatutReservation;
}