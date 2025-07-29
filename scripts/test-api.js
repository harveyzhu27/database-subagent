#!/usr/bin/env node

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🧪 Testing database connection and queries...');
console.log('Database URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ Not found');

async function testDatabase() {
  try {
    // Import the database client
    const { db } = require('../src/lib/db/index.ts');
    console.log('✅ Database client imported successfully');
    
    // Test a simple query
    const result = await db.select().from(db.schema.recentlyPlayed).limit(1);
    console.log('✅ Database query executed successfully');
    console.log(`📊 Found ${result.length} records in recently_played table`);
    
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Run the test
testDatabase().then(success => {
  if (success) {
    console.log('');
    console.log('🎉 Database is working! The issue might be in the API route.');
  } else {
    console.log('');
    console.log('🔧 Database connection failed. Please check:');
    console.log('1. PostgreSQL is running');
    console.log('2. DATABASE_URL in .env.local is correct');
    console.log('3. Database and tables exist');
  }
  process.exit(success ? 0 : 1);
}); 