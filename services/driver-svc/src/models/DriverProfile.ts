import pool from '../database/connection';
import { DriverProfile, CreateDriverProfileRequest } from '../types/driver';
import { v4 as uuidv4 } from 'uuid';

export class DriverProfileModel {
  static async create(userId: string, profileData: CreateDriverProfileRequest): Promise<DriverProfile> {
    const query = `
      INSERT INTO driver.profiles (
        id, user_id, license_number, license_state, license_class,
        date_of_birth, address, city, state, zip_code, phone,
        emergency_contact_name, emergency_contact_phone, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      uuidv4(),
      userId,
      profileData.licenseNumber,
      profileData.licenseState,
      profileData.licenseClass,
      new Date(profileData.dateOfBirth),
      profileData.address,
      profileData.city,
      profileData.state,
      profileData.zipCode,
      profileData.phone,
      profileData.emergencyContactName || null,
      profileData.emergencyContactPhone || null,
      true
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: string): Promise<DriverProfile | null> {
    const query = 'SELECT * FROM driver.profiles WHERE user_id = $1 AND is_active = true';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<DriverProfile | null> {
    const query = 'SELECT * FROM driver.profiles WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByLicenseNumber(licenseNumber: string, licenseState: string): Promise<DriverProfile | null> {
    const query = `
      SELECT * FROM driver.profiles 
      WHERE license_number = $1 AND license_state = $2 AND is_active = true
    `;
    const result = await pool.query(query, [licenseNumber, licenseState]);
    return result.rows[0] || null;
  }

  static async updateByUserId(userId: string, updates: Partial<DriverProfile>): Promise<DriverProfile | null> {
    const fields = Object.keys(updates).filter(key => 
      key !== 'id' && key !== 'user_id' && key !== 'created_at'
    );
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `
      UPDATE driver.profiles 
      SET ${setClause}, updated_at = NOW() 
      WHERE user_id = $1 AND is_active = true 
      RETURNING *
    `;

    const values = [userId, ...fields.map(field => updates[field as keyof DriverProfile])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(userId: string): Promise<boolean> {
    const query = 'UPDATE driver.profiles SET is_active = false, updated_at = NOW() WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rowCount > 0;
  }

  static async findAll(limit: number = 50, offset: number = 0): Promise<DriverProfile[]> {
    const query = `
      SELECT * FROM driver.profiles 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async searchByLicense(searchTerm: string): Promise<DriverProfile[]> {
    const query = `
      SELECT * FROM driver.profiles 
      WHERE is_active = true 
      AND (license_number ILIKE $1 OR license_state ILIKE $1)
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}