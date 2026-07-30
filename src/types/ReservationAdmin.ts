export type StatutReservationAdmin = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE';

export interface ReservationAdmin {
  id_reservation: string;
  client_nom: string;
  client_prenom: string;
  vehicule_marque: string;
  vehicule_modele: string;
  date_debut: string;
  date_fin: string;
  prix_total: number;
  statut: StatutReservationAdmin;
}