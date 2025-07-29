# Database Agent Demo

This demo shows how the Orchids Agent can handle database operations including:
1. Creating tables
2. Populating data
3. Creating API routes
4. Integrating with the frontend

## Demo Scenarios

### Scenario 1: "Can you store the recently played songs in a table"

**What the agent should do:**
1. ✅ Create the `recently_played` table
2. ✅ Populate it with sample data
3. ✅ Create API route to fetch data
4. ✅ Integrate with frontend to display data

**Current Status:** ✅ COMPLETED
- Table exists in `src/lib/db/schema.ts`
- Sample data added via API
- Route exists at `/api/recently-played`
- Frontend integration in `RecentlyPlayedList` component

### Scenario 2: "Can you store the 'Made for you' and 'Popular albums' in a table"

**What the agent should do:**
1. ✅ Create `playlists` and `albums` tables
2. ✅ Populate with sample data
3. ✅ Create API routes
4. ✅ Integrate with frontend

**Current Status:** ✅ COMPLETED
- Tables exist in schema
- API routes created
- Frontend components ready

## Demo Steps

### Step 1: Show the Agent in Action

Run the agent with a database query:

```bash
npm run orchids-agent
```

Then ask: "Can you store the recently played songs in a table"

### Step 2: Show Database Schema

The agent creates tables in `src/lib/db/schema.ts`:

```typescript
// Recently played songs table
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

### Step 3: Show API Routes

The agent creates routes in `src/app/api/recently-played/route.ts`:

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const limit = parseInt(searchParams.get("limit") || "20");

  const songs = await getRecentlyPlayedSongs(userId, limit);
  return NextResponse.json({ songs });
}
```

### Step 4: Show Frontend Integration

The agent integrates with components like `RecentlyPlayedList`:

```typescript
export default function RecentlyPlayedList({ userId, limit, onPlayTrack }) {
  const [songs, setSongs] = useState([]);
  
  useEffect(() => {
    fetch(`/api/recently-played?userId=${userId}&limit=${limit}`)
      .then(res => res.json())
      .then(data => setSongs(data.songs));
  }, [userId, limit]);
  
  // Render songs...
}
```

## Demo Commands

### 1. Test Database Connection
```bash
npm run db:setup
```

### 2. View Database Schema
```bash
npm run db:studio
```

### 3. Test API Endpoints
```bash
# Test recently played songs
curl http://localhost:3001/api/recently-played?userId=user123

# Test albums
curl http://localhost:3001/api/albums

# Test playlists
curl http://localhost:3001/api/playlists?userId=user123
```

### 4. View Frontend
```bash
npm run dev
# Open http://localhost:3001
```

## Demo Script

Here's a complete demo script you can follow:

```bash
# 1. Start the agent
npm run orchids-agent

# 2. Ask: "Can you store the recently played songs in a table"
# 3. Watch the agent create tables, routes, and integrate frontend
# 4. Test the results at http://localhost:3001
```

## Key Features Demonstrated

1. **Automatic Schema Generation**: Agent creates proper database schemas
2. **API Route Creation**: Agent generates RESTful endpoints
3. **Frontend Integration**: Agent connects data to UI components
4. **Error Handling**: Agent includes proper error handling
5. **Type Safety**: Agent maintains TypeScript types throughout

## Files Created/Modified by Agent

- `src/lib/db/schema.ts` - Database tables
- `src/lib/db/queries.ts` - Database queries
- `src/app/api/recently-played/route.ts` - API endpoint
- `src/components/recently-played-list.tsx` - Frontend component
- `src/components/spotify-main-content.tsx` - Integration

This demo shows the complete workflow from database creation to frontend display! 