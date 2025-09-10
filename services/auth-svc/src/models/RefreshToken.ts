import pool from '../database/connection';
import { RefreshToken } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

export class RefreshTokenModel {
  static async create(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
    const query = `
      INSERT INTO auth.refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [uuidv4(), userId, tokenHash, expiresAt];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const query = `
      SELECT * FROM auth.refresh_tokens 
      WHERE token_hash = $1 AND revoked = false AND expires_at > NOW()
    `;
    const result = await pool.query(query, [tokenHash]);
    return result.rows[0] || null;
  }

  static async revokeToken(tokenHash: string): Promise<boolean> {
    const query = 'UPDATE auth.refresh_tokens SET revoked = true WHERE token_hash = $1';
    const result = await pool.query(query, [tokenHash]);
    return result.rowCount > 0;
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    const query = 'UPDATE auth.refresh_tokens SET revoked = true WHERE user_id = $1';
    await pool.query(query, [userId]);
  }

  static async cleanupExpiredTokens(): Promise<void> {
    const query = 'DELETE FROM auth.refresh_tokens WHERE expires_at < NOW() OR revoked = true';
    await pool.query(query);
  }
}