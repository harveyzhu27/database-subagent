-- PostgreSQL Setup Script
-- Run this as a PostgreSQL superuser (usually 'postgres')

-- Create the user
CREATE USER orchids_user WITH PASSWORD 'orchids_pass';

-- Create the database
CREATE DATABASE orchids_dev;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE orchids_dev TO orchids_user;

-- Connect to the database and grant schema privileges
\c orchids_dev;
GRANT ALL ON SCHEMA public TO orchids_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO orchids_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO orchids_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO orchids_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO orchids_user; 