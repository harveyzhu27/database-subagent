# Spotify Clone - Full-Stack Music Application

A modern, full-stack Spotify clone built with Next.js, TypeScript, and PostgreSQL. This application demonstrates a complete music streaming interface with database integration, API routes, and a responsive UI.

## 🎵 Features

- **Spotify-like Interface**: Complete music player interface with sidebar, main content, and bottom player
- **Database Integration**: PostgreSQL database with Drizzle ORM for data persistence
- **API Routes**: RESTful API endpoints for recently played songs, playlists, and albums
- **Real-time Player**: Interactive music player with play/pause, seek, volume control
- **Responsive Design**: Modern UI with dark theme and smooth animations
- **Type Safety**: Full TypeScript implementation throughout the stack

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL (or use the SQLite option below)
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd orchids-takehome-app
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL** from [postgresql.org](https://www.postgresql.org/download/)

2. **Create the database**:
   ```bash
   psql -U postgres
   CREATE DATABASE orchids_dev;
   \q
   ```

3. **Set up environment variables**:
   ```bash
   # Create .env.local file with your database credentials
   echo "DATABASE_URL=postgresql://postgres:your_password@localhost:5432/orchids_dev" > .env.local
   ```
   
   **Note**: Replace `your_password` with the password you set during PostgreSQL installation.

#### Option B: SQLite (Easier for Development)

1. **Install SQLite dependencies**:
   ```bash
   npm install better-sqlite3 @types/better-sqlite3 --save-dev
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env.local file for SQLite
   echo "DATABASE_URL=file:./dev.db" > .env.local
   ```

### 3. Initialize Database

```bash
# Push the database schema
npm run db:push

# (Optional) View database in Drizzle Studio
npm run db:studio
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 Demo Features

### Interactive Music Player
- Play/pause functionality
- Seek bar with time tracking
- Volume control
- Shuffle and repeat modes
- Like/unlike songs

### Navigation
- Sidebar with Home, Search, and Library sections
- Breadcrumb navigation with back/forward buttons
- Search functionality
- User menu

### Data Integration
- Recently played songs loaded from database
- Playlists and albums with sample data
- Real-time API calls
- Type-safe data handling

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:setup     # Setup database connection

# Testing
npm run test-api     # Test API endpoints
npm run test-db      # Test database connection
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   └── page.tsx           # Main application
├── components/             # React components
│   ├── spotify-*.tsx      # Spotify UI components
│   └── ui/                # Reusable UI components
└── lib/
    └── db/                # Database configuration
        ├── schema.ts       # Database schema
        └── queries.ts      # Database queries
```

## 🎨 Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Animations**: Framer Motion, Three.js
- **Icons**: Lucide React, Tabler Icons

## 🔧 API Endpoints

- `GET /api/recently-played` - Fetch recently played songs
- `GET /api/playlists` - Fetch user playlists
- `GET /api/albums` - Fetch popular albums
- `PATCH /api/recently-played` - Update song like status

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running: `sudo service postgresql start` (Linux) or start from Services (Windows)
   - Verify your password in the DATABASE_URL
   - Check that the database `orchids_dev` exists

2. **Port Already in Use**
   - The app runs on port 3000 by default
   - If port 3000 is busy, Next.js will automatically try the next available port

3. **Environment Variables Not Loading**
   - Ensure your `.env.local` file is in the root directory
   - Restart the development server after creating the file

4. **TypeScript Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that your Node.js version is 18+

### Testing Your Setup

```bash
# Test database connection
npm run test-db

# Test API endpoints
npm run test-api

# View database in browser
npm run db:studio
```

## 🚀 Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js applications.

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set environment variables** in your deployment platform:
   - `DATABASE_URL`: Your PostgreSQL connection string

3. **Deploy** using your preferred platform

## 📝 License

This project is for demonstration purposes as part of a technical assessment.
