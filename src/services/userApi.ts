import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  role: string;
  kycStatus: string;
  createdAt: string;
}

export async function fetchUserProfile(id: string): Promise<UserProfile> {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

export async function updateUserProfile(id: string, data: {
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
}): Promise<UserProfile> {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
}