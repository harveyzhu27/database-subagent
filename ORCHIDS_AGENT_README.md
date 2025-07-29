# 🎵 Orchids Agent - Database Feature Planner

A CLI tool that analyzes Next.js + TypeScript projects and plans database feature implementations.

## Features

- **Project Analysis**: Automatically scans your Next.js project structure
- **Smart Planning**: Analyzes user queries and generates implementation plans
- **File Planning**: Shows exactly which files will be created or modified
- **Database Integration**: Plans database schemas, API routes, and frontend components

## Usage

### Basic Usage

```bash
# Using npm script
npm run orchids-agent "Can you store the recently played songs in a table?"

# Direct execution
node orchids-agent.js "Can you store the recently played songs in a table?"

# Generate actual code (new!)
node orchids-agent.js "Can you store the recently played songs in a table?" --generate
```

### Examples

```bash
# Recently played songs
npm run orchids-agent "Can you store the recently played songs in a table?"

# Playlist management
npm run orchids-agent "I want to create playlists and save them to a database"

# User profiles
npm run orchids-agent "Add user profiles and authentication to the app"

# Generic database feature
npm run orchids-agent "Create a favorites system for songs"
```

## What It Does

1. **Analyzes Project Structure**: Scans your `src/` directory for:
   - React components
   - Pages and routes
   - API routes
   - Existing database features

2. **Plans Implementation**: Based on your query, it generates:
   - Database schema requirements
   - API route specifications
   - React component plans
   - Integration steps

3. **Shows File Changes**: Lists exactly which files will be:
   - Created (new database schemas, API routes, components)
   - Modified (existing components to integrate new features)

4. **Generates Code** (with `--generate` flag): Creates actual TypeScript code for:
   - Drizzle database schemas
   - Database query functions
   - Next.js API routes
   - Type definitions
   - **Automatically writes files** to the correct project locations
   - **Appends to existing files** with clear markers
   - **Frontend integration** with React components and API calls
   - **Duplicate Detection**: Automatically skips existing functions/types to prevent conflicts

## Output Example

```
🎵 Orchids Agent - Database Feature Planner

📝 User Request: "Can you store the recently played songs in a table?"

🔍 Analyzing project structure...
✅ Found 246 components, 2 pages, 0 API routes

🧠 Planning changes...

📋 Implementation Plan:

1. Create database schema for recently played songs table
2. Create API route for storing recently played songs
3. Create API route for retrieving recently played songs
4. Create React component for displaying recently played songs
5. Integrate with existing music player components
6. Add state management for recently played songs

📁 Files to be created/modified:

   Create: src/lib/database/schema.ts
   Create: src/app/api/recently-played/route.ts
   Create: src/components/recently-played-songs.tsx
   Modify: src/components/spotify-player.tsx
   Create: src/hooks/use-recently-played.ts

💡 Next Steps:
   1. Review the plan above
   2. Use `--generate` flag to automatically create files
   3. The tool will create/append files with clear markers
   4. Test the new database feature

## Supported Query Types

The agent recognizes and plans for various database features:

- **Recently Played Songs**: Creates tables and APIs for tracking play history
- **Playlists**: Plans playlist management with CRUD operations
- **User Profiles**: User authentication and profile management
- **Favorites**: Bookmarking and favoriting systems
- **Generic Features**: Custom database features based on your description

## File Writing Behavior

When using the `--generate` flag, the tool will:

- **Create new files** if they don't exist
- **Append to existing files** with a clear marker: `// ⬇️ Added by orchids-agent`
- **Create directories** automatically if needed
- **Show progress messages** for each file created/appended
- **Detect duplicates** and skip existing functions/types to prevent conflicts
- **Smart filtering** that only writes new code, skipping duplicates with warning messages

### Example Output:
```
📝 Writing recently played songs code...
⚠️  Skipped: recentlyPlayed already exists in src/lib/db/schema.ts
⚠️  Skipped: getRecentlyPlayedSongs already exists in src/lib/db/queries.ts
✅ Appended code to src/app/api/recently-played/route.ts
📝 Writing frontend integration...
✅ Added recently played songs UI as overlay to existing page
✅ Successfully generated recently played songs feature!
```

## Frontend Integration Features

The CLI tool automatically generates frontend components that:

- **Fetch data** from the generated API routes using `useEffect` and `fetch()`
- **Handle loading states** with proper loading indicators
- **Error handling** with user-friendly error messages
- **TypeScript types** for type safety
- **Responsive UI** with Tailwind CSS styling
- **Integration with existing pages** as overlays or inline components

### Generated Frontend Components:

- **Recently Played Songs**: Displays a list of recently played songs with album art
- **Playlists Manager**: Interactive playlist browser with song lists
- **User Profile**: Profile information and preferences display

## Project Structure

The tool expects a standard Next.js project structure:

```
src/
├── app/
│   ├── api/          # API routes
│   ├── page.tsx      # Main page
│   └── layout.tsx    # Root layout
├── components/       # React components
├── lib/             # Utilities and database
└── hooks/           # Custom React hooks
```

## Requirements

- Node.js 16+
- Next.js project with TypeScript
- Standard project structure with `src/` directory

## Future Enhancements

- [x] Code generation (`--generate` flag) ✅
- [x] Automatic file writing ✅
- [x] File append functionality ✅
- [x] Frontend integration ✅
- [ ] Implementation mode (`--implement` flag)
- [ ] Database schema generation
- [ ] API route template generation
- [ ] Component template generation
- [ ] Integration with specific databases (Prisma, Supabase, etc.)
- [ ] Interactive mode for complex queries 