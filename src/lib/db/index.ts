import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// ฟังก์ชันสำหรับสร้าง database connection แบบ lazy
function getDbConnection() {
  if (_db) {
    return _db;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  _client = postgres(connectionString, { prepare: false });
  _db = drizzle(_client, { schema });
  
  return _db;
}

// Export db instance ที่จะสร้าง connection เมื่อถูกเรียกใช้
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const connection = getDbConnection();
    return (connection as any)[prop];
  }
});

// Export client สำหรับกรณีที่ต้องการใช้ direct connection
export const getClient = () => {
  if (!_client) {
    getDbConnection(); // สร้าง connection
  }
  return _client;
};

export * from './schema';