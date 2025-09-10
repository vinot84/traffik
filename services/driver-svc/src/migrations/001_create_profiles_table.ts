import pool from '../database/connection';

export async function up(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS driver.profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL UNIQUE,
      license_number VARCHAR(50) NOT NULL,
      license_state VARCHAR(2) NOT NULL,
      license_class VARCHAR(10) NOT NULL,
      date_of_birth DATE NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(2) NOT NULL,
      zip_code VARCHAR(10) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      emergency_contact_name VARCHAR(200),
      emergency_contact_phone VARCHAR(20),
      profile_image_url TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_driver_profiles_user_id ON driver.profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_driver_profiles_license ON driver.profiles(license_number, license_state);
    CREATE INDEX IF NOT EXISTS idx_driver_profiles_is_active ON driver.profiles(is_active);
    CREATE INDEX IF NOT EXISTS idx_driver_profiles_created_at ON driver.profiles(created_at);
  `);

  console.log('✓ Created driver profiles table and indexes');
}

export async function down(): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS driver.profiles CASCADE;');
  console.log('✓ Dropped driver profiles table');
}