export interface DriverProfile {
  id: string;
  user_id: string;
  license_number: string;
  license_state: string;
  license_class: string;
  date_of_birth: Date;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDriverProfileRequest {
  licenseNumber: string;
  licenseState: string;
  licenseClass: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface UpdateDriverProfileRequest extends Partial<CreateDriverProfileRequest> {}

export interface DriverLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
  is_active: boolean;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface ProximityCheck {
  officerUserId: string;
  driverUserId: string;
  distance: number;
  withinRange: boolean;
  timestamp: Date;
}