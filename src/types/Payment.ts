export type PaymentMethod = 'MOBILE_MONEY' | 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD';
export type PaymentOperator = 'MVOLA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'BANK' | 'NONE';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface CreatePaymentPayload {
  amount: string;
  paymentMethod: PaymentMethod;
  operator?: PaymentOperator;
  phoneNumber?: string;
  reservationId: string;
}

export interface PaymentApi {
  id: string;
  amount: string;
  paymentMethod: PaymentMethod;
  operator: PaymentOperator | null;
  phoneNumber: string | null;
  status: PaymentStatus;
  paymentDate: string;
  referenceTransaction: string | null;
  reservationId: string;
}