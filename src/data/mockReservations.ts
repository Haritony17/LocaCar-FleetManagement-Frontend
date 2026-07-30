import type { Reservation } from '../types/Reservation';

export const mockReservations: Reservation[] = [
  {
    id_reservation: 'R001',
    vehicule_marque: 'Toyota',
    vehicule_modele: 'Corolla',
    vehicule_photo: 'https://images.unsplash.com/photo-1623869675184-6d0b1e7f3b9f?w=300&h=200&fit=crop',
    date_debut: '2026-08-05T09:00',
    date_fin: '2026-08-10T18:00',
    prix_total: 150,
    statut: 'A_VENIR',
  },
  {
    id_reservation: 'R002',
    vehicule_marque: 'Hyundai',
    vehicule_modele: 'Tucson',
    vehicule_photo: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&h=200&fit=crop',
    date_debut: '2026-07-20T10:00',
    date_fin: '2026-07-30T10:00',
    prix_total: 500,
    statut: 'EN_COURS',
  },
  {
    id_reservation: 'R003',
    vehicule_marque: 'Renault',
    vehicule_modele: 'Clio',
    vehicule_photo: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=300&h=200&fit=crop',
    date_debut: '2026-06-01T09:00',
    date_fin: '2026-06-05T18:00',
    prix_total: 100,
    statut: 'TERMINEE',
  },
  {
    id_reservation: 'R004',
    vehicule_marque: 'Kia',
    vehicule_modele: 'Sportage',
    vehicule_photo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&h=200&fit=crop',
    date_debut: '2026-05-10T09:00',
    date_fin: '2026-05-15T18:00',
    prix_total: 300,
    statut: 'ANNULEE',
  },
];