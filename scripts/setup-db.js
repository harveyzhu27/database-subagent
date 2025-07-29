#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Setting up database...');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local not found. Creating with default values...');
  const defaultEnv = `DATABASE_URL="postgresql://postgres:password@localhost:5432/orchids_app"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"`;
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env.local with default values');
}

console.log('');
console.log('📋 Database Setup Instructions:');
console.log('');
console.log('1. Install PostgreSQL if not already installed');
console.log('2. Create a database named "orchids_app"');
console.log('3. Update DATABASE_URL in .env.local with your credentials');
console.log('4. Run the following commands:');
console.log('');
console.log('   npm run db:push    # Push schema to database');
console.log('   npm run db:studio  # Open Drizzle Studio (optional)');
console.log('');

// Check if we can connect to the database
try {
  console.log('🔍 Testing database connection...');
  // This would require the actual database to be running
  console.log('ℹ️  To test the connection, ensure PostgreSQL is running and run:');
  console.log('   npm run db:push');
} catch (error) {
  console.log('❌ Database connection failed. Please check your DATABASE_URL in .env.local');
}

console.log('');
console.log('🎯 Next steps:');
console.log('1. Start PostgreSQL server');
console.log('2. Update .env.local with your database credentials');
console.log('3. Run: npm run db:push');
console.log('4. Start the dev server: npm run dev');
console.log('5. Test API routes at http://localhost:3000/api/recently-played'); 