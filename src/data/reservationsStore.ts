import type { Reservation } from '@/types/Reservation';
import { mockReservations } from './mockReservations';

let reservations: Reservation[] = [...mockReservations];

export function getReservations() {
  return reservations;
}

export function addReservation(reservation: Reservation) {
  reservations = [reservation, ...reservations];
}