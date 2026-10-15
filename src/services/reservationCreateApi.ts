import api from './api';

export async function createReservation(data: {
  startDate: string;
  endDate: string;
  vehicleId: string;
  customerId: string;
  depositAmount: string;
}) {
  const res = await api.post('/reservations', data);
  return res.data;
}