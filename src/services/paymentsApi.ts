import api from './api';
import type { CreatePaymentPayload, PaymentApi } from '@/types/Payment';

export async function createPayment(payload: CreatePaymentPayload): Promise<PaymentApi> {
  const res = await api.post<PaymentApi>('/payments', payload);
  return res.data;
}

export async function fetchPaymentById(id: string): Promise<PaymentApi> {
  const res = await api.get<PaymentApi>(`/payments/${id}`);
  return res.data;
}