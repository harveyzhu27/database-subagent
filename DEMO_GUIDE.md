# Database Agent Demo Guide

## 🎭 Live Demo Script

### Step 1: Introduction
"Today I'm going to show you how our AI agent can handle complete database operations from start to finish. The agent can create tables, populate data, build API routes, and integrate everything with the frontend."

### Step 2: Show Current State
```bash
# Run the demo overview
node scripts/demo-agent.js
```

**Say:** "As you can see, we already have a working database with tables for recently played songs, playlists, and albums. Let me show you how the agent created all of this."

### Step 3: Demonstrate Agent Capabilities

#### Scenario 1: "Can you store the recently played songs in a table"

**What to show:**
1. **Database Schema** (`src/lib/db/schema.ts`):
   ```typescript
   export const recentlyPlayed = pgTable("recently_played", {
     id: serial("id").primaryKey(),
     user_id: text("user_id").notNull(),
     song_id: text("song_id").notNull(),
     song_title: text("song_title").notNull(),
     artist_name: text("artist_name").notNull(),
     album_art: text("album_art"),
     played_at: timestamp("played_at").defaultNow().notNull(),
     duration_ms: integer("duration_ms"),
   });
   ```

2. **API Route** (`src/app/api/recently-played/route.ts`):
   ```typescript
   export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url);
     const userId = searchParams.get("userId");
     const limit = parseInt(searchParams.get("limit") || "20");
     
     const songs = await getRecentlyPlayedSongs(userId, limit);
     return NextResponse.json({ songs });
   }
   ```

3. **Frontend Integration** (`src/components/recently-played-list.tsx`):
   ```typescript
   useEffect(() => {
     fetch(`/api/recently-played?userId=${userId}&limit=${limit}`)
       .then(res => res.json())
       .then(data => setSongs(data.songs));
   }, [userId, limit]);
   ```

#### Scenario 2: "Can you store the 'Made for you' and 'Popular albums' in a table"

**What to show:**
1. **Multiple Tables Created**:
   - `playlists` table for "Made for you"
   - `albums` table for "Popular albums"
   - `playlist_songs` junction table

2. **Multiple API Routes**:
   - `/api/playlists` for playlists
   - `/api/albums` for albums

3. **Frontend Components**:
   - `PlaylistList` component
   - `AlbumList` component

### Step 4: Live Demo Commands

```bash
# 1. Show database schema
npm run db:studio

# 2. Test API endpoints
curl http://localhost:3001/api/recently-played?userId=user123

# 3. Show frontend
npm run dev
# Open http://localhost:3001
```

### Step 5: Key Features to Highlight

1. **Automatic Schema Generation**
   - Agent creates proper database schemas
   - Handles relationships between tables
   - Includes proper data types and constraints

2. **API Route Creation**
   - Generates RESTful endpoints
   - Includes proper error handling
   - Supports query parameters (userId, limit, etc.)

3. **Frontend Integration**
   - Creates React components
   - Handles loading states
   - Includes error handling
   - Maintains TypeScript types

4. **Complete Workflow**
   - Database → API → Frontend
   - End-to-end integration
   - Production-ready code

### Step 6: Demo Script

**Say:** "Let me show you how this works in practice. When you ask the agent 'Can you store the recently played songs in a table', it:

1. **Analyzes the request** and determines it needs a database table
2. **Creates the schema** with proper columns and relationships
3. **Generates API routes** to fetch and manipulate the data
4. **Builds frontend components** that consume the API
5. **Integrates everything** so it works seamlessly

The result is a complete, working feature that you can use immediately."

### Step 7: Show Results

**Navigate to:** `http://localhost:3001`

**Point out:**
- The recently played songs are loaded from the database
- The data is fetched via API calls
- The UI updates dynamically
- Everything is type-safe and production-ready

### Step 8: Bonus Features

**Mention:**
- Error handling throughout the stack
- Loading states and user feedback
- TypeScript type safety
- Optimized database queries
- RESTful API design
- Scalable architecture

## 🎯 Demo Checklist

- [ ] Run demo overview script
- [ ] Show database schema
- [ ] Demonstrate API endpoints
- [ ] Show frontend integration
- [ ] Highlight key features
- [ ] Test live functionality
- [ ] Explain the complete workflow

## 🚀 Key Takeaways

1. **Complete Automation**: Agent handles the entire stack
2. **Production Ready**: Code includes error handling, types, and best practices
3. **Scalable**: Architecture supports growth and changes
4. **User Friendly**: Simple natural language requests
5. **Fast Development**: Complete features in minutes, not hours

This demo shows how AI can transform database development from a complex, multi-step process into a simple conversation! 