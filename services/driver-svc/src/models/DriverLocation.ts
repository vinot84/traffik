import pool from '../database/connection';
import { DriverLocation, LocationUpdate } from '../types/driver';
import { v4 as uuidv4 } from 'uuid';

export class DriverLocationModel {
  static async updateLocation(userId: string, locationData: LocationUpdate): Promise<DriverLocation> {
    await pool.query('UPDATE driver.locations SET is_active = false WHERE user_id = $1', [userId]);

    const query = `
      INSERT INTO driver.locations (
        id, user_id, latitude, longitude, accuracy, altitude, heading, speed, timestamp, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      uuidv4(),
      userId,
      locationData.latitude,
      locationData.longitude,
      locationData.accuracy || null,
      locationData.altitude || null,
      locationData.heading || null,
      locationData.speed || null,
      new Date(),
      true
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getCurrentLocation(userId: string): Promise<DriverLocation | null> {
    const query = `
      SELECT * FROM driver.locations 
      WHERE user_id = $1 AND is_active = true 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async getLocationHistory(userId: string, hours: number = 24): Promise<DriverLocation[]> {
    const query = `
      SELECT * FROM driver.locations 
      WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getNearbyUsers(
    latitude: number, 
    longitude: number, 
    radiusMeters: number = 100
  ): Promise<Array<DriverLocation & { distance: number }>> {
    const query = `
      SELECT *, 
        ST_Distance(
          ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) as distance
      FROM driver.locations 
      WHERE is_active = true
      AND ST_DWithin(
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
        $3
      )
      AND timestamp >= NOW() - INTERVAL '10 minutes'
      ORDER BY distance
    `;
    
    const result = await pool.query(query, [latitude, longitude, radiusMeters]);
    return result.rows;
  }

  static async calculateDistance(
    lat1: number, lon1: number, lat2: number, lon2: number
  ): Promise<number> {
    const query = `
      SELECT ST_Distance(
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        ST_SetSRID(ST_MakePoint($4, $3), 4326)::geography
      ) as distance
    `;
    
    const result = await pool.query(query, [lat1, lon1, lat2, lon2]);
    return parseFloat(result.rows[0].distance);
  }

  static async cleanupOldLocations(daysOld: number = 30): Promise<void> {
    const query = `
      DELETE FROM driver.locations 
      WHERE timestamp < NOW() - INTERVAL '${daysOld} days'
    `;
    await pool.query(query);
  }
}