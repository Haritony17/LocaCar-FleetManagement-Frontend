export interface VehicleApi {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  gearboxType: string;
  fuelType: string;
  status: string;
  initialMileage: string;
  specificDailyRate: string | null;
  effectiveDailyRate: string;
  averageRating: string;
  reviewsCount: number;
  agencyId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}