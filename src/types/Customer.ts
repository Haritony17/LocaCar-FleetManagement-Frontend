export interface CustomerApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  address: string | null;
  drivingLicenseNumber: string | null;
  createdAt: string;
}