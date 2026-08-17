import api from './api';
import type { ReservationApi, PaginatedReservations } from '@/types/Reservation';

export async function fetchAllReservations(): Promise<ReservationApi[]> {
  const first = await api.get<PaginatedReservations>('/reservations', { params: { page: 1, limit: 100 } });
  let all = [...first.data.items];
  const totalPages = first.data.totalPages;

  for (let page = 2; page <= totalPages; page++) {
    const res = await api.get<PaginatedReservations>('/reservations', { params: { page, limit: 100 } });
    all = all.concat(res.data.items);
  }

  return all;
}

export async function fetchAllVehicles() {
  const res = await api.get('/vehicles', { params: { page: 1, limit: 100 } });
  return res.data.items ?? res.data;
}