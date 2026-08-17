import api from './api';

export interface Agency {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  dailyRate: number;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  gearboxType: 'MANUAL' | 'AUTOMATIC';
  fuelType: 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
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

export interface CreateVehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  gearboxType: string;
  fuelType: string;
  status?: string;
  initialMileage: string;
  specificDailyRate?: string;
  agencyId: string;
  categoryId: string;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await api.get('/vehicles', { params: { page: 1, limit: 100 } });
  return res.data.items ?? res.data;
}

export async function createVehicle(data: CreateVehicleData) {
  const res = await api.post('/vehicles', data);
  return res.data;
}

export async function updateVehicleStatus(id: string, status: string) {
  const res = await api.patch(`/vehicles/${id}`, { status });
  return res.data;
}

export async function fetchAgencies(): Promise<Agency[]> {
  const res = await api.get('/agencies', { params: { page: 1, limit: 100 } });
  return res.data.items ?? res.data;
}

export async function createAgency(data: { name: string; address: string; city: string; phone: string; status?: string }) {
  const res = await api.post('/agencies', { status: 'ACTIVE', ...data });
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get('/categories', { params: { page: 1, limit: 100 } });
  return res.data.items ?? res.data;
}

export async function createCategory(data: { name: string; description: string; dailyRate: number }) {
  const res = await api.post('/categories', data);
  return res.data;
}