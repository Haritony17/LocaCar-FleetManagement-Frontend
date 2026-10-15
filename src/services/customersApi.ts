import api from './api';
import type { CustomerApi } from '@/types/Customer';

export async function getOrCreateMyCustomer(): Promise<CustomerApi> {
  const res = await api.get<CustomerApi>('/customers/me');
  return res.data;
}