const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV); 