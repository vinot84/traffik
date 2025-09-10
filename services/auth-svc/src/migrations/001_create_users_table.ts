import pool from '../database/connection';

export async function up(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth.users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'officer', 'user')),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone VARCHAR(20),
      badge_number VARCHAR(50),
      department VARCHAR(100),
      is_active BOOLEAN NOT NULL DEFAULT true,
      email_verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON auth.users(role);
    CREATE INDEX IF NOT EXISTS idx_users_badge_number ON auth.users(badge_number);
    CREATE INDEX IF NOT EXISTS idx_users_is_active ON auth.users(is_active);
  `);

  console.log('✓ Created users table and indexes');
}

export async function down(): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS auth.users CASCADE;');
  console.log('✓ Dropped users table');
}