import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:TOlzjx9704pSelGoqphlO5E7wgczII2IkpJVWC3wyNUZ3pJY883lSQ5y3WJcIcRS@167.71.215.156:7878/topupgame';

// Disable prefetch as it is not supported for "Transaction" pool mode eiei
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export * from './schema'; 