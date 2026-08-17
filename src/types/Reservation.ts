export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface ReservationApi {
  id: string;
  startDate: string;
  endDate: string;
  actualReturnDate: string | null;
  status: ReservationStatus;
  dailyRate: string;
  totalPrice: string;
  depositAmount: string;
  cancellationReason: string | null;
  createdAt: string;
  vehicleId: string;
  userId: string;
}

export interface PaginatedReservations {
  items: ReservationApi[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}