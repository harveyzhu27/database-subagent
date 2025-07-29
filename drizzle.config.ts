import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// For local development, ensure SSL is disabled
if (databaseUrl.includes('localhost')) {
  // Remove any existing sslmode parameter
  databaseUrl = databaseUrl.replace(/\?.*$/, '');
  // Add sslmode=disable
  databaseUrl += '?sslmode=disable';
}

console.log('Database URL loaded:', databaseUrl);

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
}); 