import api from './api';

export interface DocumentKyc {
  id: string;
  documentType: 'CIN' | 'DRIVING_LICENSE';
  documentPath: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  processedAt: string | null;
  userId: string;
}

export async function fetchMyDocuments(): Promise<DocumentKyc[]> {
  const res = await api.get('/kyc/my-documents');
  return res.data;
}

export async function uploadKycDocument(
  documentType: 'CIN' | 'DRIVING_LICENSE',
  file: File
) {
  const formData = new FormData();

  formData.append('documentType', documentType);
  formData.append('file', file, file.name);

  const response = await api.post('/kyc/upload', formData);

  return response.data;
}