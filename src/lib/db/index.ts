import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { logger } from '../logger';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// ฟังก์ชันสำหรับสร้าง database connection แบบ lazy
function getDbConnection() {
  if (_db) {
    return _db;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    const error = new Error('DATABASE_URL is not set');
    logger.error('Database connection failed', error);
    throw error;
  }

  try {
    logger.info('Initializing database connection...');
    _client = postgres(connectionString, { 
      prepare: false,
      max: 10, // Connection pool size
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout 10 seconds
    });
    _db = drizzle(_client, { schema });
    
    logger.info('Database connection initialized successfully');
    return _db;
  } catch (error) {
    logger.error('Failed to initialize database connection', error);
    throw error;
  }
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