import pool from '../database/connection';

export async function up(): Promise<void> {
  await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS driver.locations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      accuracy DECIMAL(8, 2),
      altitude DECIMAL(8, 2),
      heading DECIMAL(6, 2),
      speed DECIMAL(8, 2),
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      is_active BOOLEAN NOT NULL DEFAULT true
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_driver_locations_user_id ON driver.locations(user_id);
    CREATE INDEX IF NOT EXISTS idx_driver_locations_timestamp ON driver.locations(timestamp);
    CREATE INDEX IF NOT EXISTS idx_driver_locations_is_active ON driver.locations(is_active);
    CREATE INDEX IF NOT EXISTS idx_driver_locations_coords ON driver.locations USING GIST(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));
  `);

  console.log('✓ Created driver locations table and indexes');
}

export async function down(): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS driver.locations CASCADE;');
  console.log('✓ Dropped driver locations table');
}