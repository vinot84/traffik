export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  badge_number?: string;
  department?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  badgeNumber?: string;
  department?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked: boolean;
}

export type UserRole = 'admin' | 'officer' | 'user';