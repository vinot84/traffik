import fs from 'fs';
import path from 'path';
import pool from '../database/connection';

interface Migration {
  filename: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

async function createMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth.migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query('SELECT filename FROM auth.migrations ORDER BY id');
  return result.rows.map(row => row.filename);
}

async function markMigrationAsExecuted(filename: string): Promise<void> {
  await pool.query('INSERT INTO auth.migrations (filename) VALUES ($1)', [filename]);
}

async function runMigrations(): Promise<void> {
  try {
    console.log('🔄 Starting database migrations...');
    
    await createMigrationsTable();
    
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.ts') && file !== 'run.ts')
      .sort();

    const executedMigrations = await getExecutedMigrations();
    const pendingMigrations = migrationFiles.filter(file => !executedMigrations.includes(file));

    if (pendingMigrations.length === 0) {
      console.log('✓ No pending migrations');
      return;
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migrations`);

    for (const migrationFile of pendingMigrations) {
      try {
        console.log(`⏳ Executing migration: ${migrationFile}`);
        
        const migration: Migration = await import(path.join(migrationsDir, migrationFile));
        await migration.up();
        await markMigrationAsExecuted(migrationFile);
        
        console.log(`✅ Migration completed: ${migrationFile}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`, error);
        throw error;
      }
    }

    console.log('🎉 All migrations completed successfully');
  } catch (error) {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}