import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// ฟังก์ชันสำหรับสร้าง database connection
function createDbConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  // ในขั้นตอน build อาจไม่มี DATABASE_URL ให้ใช้ placeholder
  if (!connectionString) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is not set in production');
    }
    // สำหรับ build time ใช้ connection string placeholder
    const placeholderUrl = 'postgres://user:pass@localhost:5432/db';
    const client = postgres(placeholderUrl, { prepare: false });
    return drizzle(client, { schema });
  }

  // สร้าง connection ปกติ
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

// Export db instance
export const db = createDbConnection();

// Export client สำหรับกรณีที่ต้องการใช้ direct connection
export const client = process.env.DATABASE_URL 
  ? postgres(process.env.DATABASE_URL, { prepare: false })
  : null;

export * from './schema';