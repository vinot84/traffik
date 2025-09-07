export type UserRole = 'driver' | 'officer' | 'admin';

export type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export type CitationStatus = 'issued' | 'paid' | 'contested' | 'dismissed';

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'incomplete';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  kycStatus: KYCStatus;
  kycRejectionReason?: string;
}

export interface Session {
  id: string;
  driverId: string;
  officerId?: string;
  status: SessionStatus;
  location: Location;
  startedAt: string;
  endedAt?: string;
  citations: Citation[];
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Citation {
  id: string;
  sessionId: string;
  violations: Violation[];
  amount: number;
  status: CitationStatus;
  issuedAt: string;
  paidAt?: string;
}

export interface Violation {
  code: string;
  description: string;
  amount: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string;
}