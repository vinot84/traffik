import pool from '../database/connection';

export async function up(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      revoked BOOLEAN NOT NULL DEFAULT false
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON auth.refresh_tokens(token_hash);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON auth.refresh_tokens(expires_at);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked ON auth.refresh_tokens(revoked);
  `);

  console.log('✓ Created refresh_tokens table and indexes');
}

export async function down(): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;');
  console.log('✓ Dropped refresh_tokens table');
}