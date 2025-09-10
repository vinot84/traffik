import pool from '../database/connection';
import { User, CreateUserRequest, UserRole } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async create(userData: CreateUserRequest & { password_hash: string }): Promise<User> {
    const query = `
      INSERT INTO auth.users (
        id, email, password_hash, role, first_name, last_name, 
        phone, badge_number, department, is_active, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      uuidv4(),
      userData.email.toLowerCase(),
      userData.password_hash,
      userData.role,
      userData.firstName || null,
      userData.lastName || null,
      userData.phone || null,
      userData.badgeNumber || null,
      userData.department || null,
      true,
      false
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM auth.users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM auth.users WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateById(id: string, updates: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `
      UPDATE auth.users 
      SET ${setClause}, updated_at = NOW() 
      WHERE id = $1 AND is_active = true 
      RETURNING *
    `;

    const values = [id, ...fields.map(field => updates[field as keyof User])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'UPDATE auth.users SET is_active = false, updated_at = NOW() WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  static async findByRole(role: UserRole): Promise<User[]> {
    const query = 'SELECT * FROM auth.users WHERE role = $1 AND is_active = true ORDER BY created_at DESC';
    const result = await pool.query(query, [role]);
    return result.rows;
  }
}