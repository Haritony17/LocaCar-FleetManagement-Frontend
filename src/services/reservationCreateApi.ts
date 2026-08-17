import api from './api';

export async function createReservation(data: {
  startDate: string;
  endDate: string;
  vehicleId: string;
  userId: string;
}) {
  const res = await api.post('/reservations', {
    ...data,
    depositAmount: '0.00',
  });
  return res.data;
}