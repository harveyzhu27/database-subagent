# PostgreSQL Setup Guide

## Option 1: Use Default PostgreSQL (Recommended for Development)

### 1. Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- During installation, note the password you set for the `postgres` user

### 2. Update .env.local with your actual password
```bash
# Replace 'your_actual_password' with the password you set during installation
echo "DATABASE_URL=postgresql://postgres:your_actual_password@localhost:5432/orchids_dev" > .env.local
```

### 3. Create the database
```bash
# Connect to PostgreSQL as the postgres user
psql -U postgres

# In the PostgreSQL prompt, create the database:
CREATE DATABASE orchids_dev;

# Exit PostgreSQL
\q
```

### 4. Test the connection
```bash
npm run db:push
```

## Option 2: Create Custom User (For Production-like Setup)

### 1. Connect to PostgreSQL as superuser
```bash
psql -U postgres
```

### 2. Run the setup script
```sql
-- Create the user
CREATE USER orchids_user WITH PASSWORD 'orchids_pass';

-- Create the database
CREATE DATABASE orchids_dev;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE orchids_dev TO orchids_user;

-- Connect to the database
\c orchids_dev;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO orchids_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO orchids_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO orchids_user;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO orchids_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO orchids_user;
```

### 3. Update .env.local
```bash
echo "DATABASE_URL=postgresql://orchids_user:orchids_pass@localhost:5432/orchids_dev" > .env.local
```

## Option 3: Use SQLite for Development (Easiest)

If PostgreSQL setup is complex, you can use SQLite for development:

### 1. Install SQLite dependencies
```bash
npm install better-sqlite3
npm install @types/better-sqlite3 --save-dev
```

### 2. Update .env.local
```bash
echo "DATABASE_URL=file:./dev.db" > .env.local
```

### 3. Update drizzle.config.ts
```typescript
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### 4. Update src/lib/db/index.ts
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('dev.db');
export const db = drizzle(sqlite, { schema });
export { schema };
```

## Troubleshooting

### Common Issues:

1. **"password authentication failed"**
   - Check your PostgreSQL password
   - Verify the user exists
   - Ensure the database exists

2. **"connection refused"**
   - Make sure PostgreSQL service is running
   - Check if PostgreSQL is installed correctly

3. **"database does not exist"**
   - Create the database first
   - Check the database name in your DATABASE_URL

### Testing Connection:

```bash
# Test with psql
psql -U postgres -d orchids_dev

# Test with our script
node scripts/test-db.js
```

## Next Steps

Once the database is connected:

1. **Push the schema:**
   ```bash
   npm run db:push
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Test API routes:**
   ```bash
   curl http://localhost:3000/api/recently-played?userId=user123
   ```

4. **Open Drizzle Studio (optional):**
   ```bash
   npm run db:studio
   ``` 