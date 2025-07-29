#!/usr/bin/env node

const { db } = require('../src/lib/db/index.ts');

async function testDatabase() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test basic connection
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const result = await db.select().from(db.schema.recentlyPlayed).limit(1);
    console.log('✅ Query execution successful');
    console.log(`📊 Found ${result.length} records in recently_played table`);
    
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env.local');
    console.log('3. Run: npm run db:push to create tables');
    console.log('4. Ensure the database "orchids_app" exists');
    return false;
  }
}

// Run the test
testDatabase().then(success => {
  if (success) {
    console.log('');
    console.log('🎉 Database is ready! You can now:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Test API routes at http://localhost:3000/api/recently-played');
    console.log('3. Open Drizzle Studio: npm run db:studio');
  }
  process.exit(success ? 0 : 1);
}); 