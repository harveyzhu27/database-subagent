#!/usr/bin/env node

const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🗄️  Pushing database schema...');
console.log('Database URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ Not found');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  console.log('Please check your .env.local file contains:');
  console.log('DATABASE_URL=postgresql://username:password@localhost:5432/database_name');
  process.exit(1);
}

try {
  // Run drizzle-kit push
  execSync('npx drizzle-kit push', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('✅ Database schema pushed successfully!');
} catch (error) {
  console.error('❌ Failed to push database schema:', error.message);
  process.exit(1);
} 