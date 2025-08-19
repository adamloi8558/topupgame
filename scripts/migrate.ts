#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// โหลด environment variables
dotenv.config();

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('🔄 Starting database migration...');

  try {
    // สร้าง connection สำหรับ migration
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);

    // รัน migrations
    await migrate(db, { 
      migrationsFolder: path.join(process.cwd(), 'drizzle')
    });

    console.log('✅ Database migration completed successfully!');
    
    // ปิด connection
    await migrationClient.end();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// รัน migration
runMigrations().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});