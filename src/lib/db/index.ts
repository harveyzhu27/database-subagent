import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client
const client = postgres(databaseUrl);

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export for convenience
export { schema }; 