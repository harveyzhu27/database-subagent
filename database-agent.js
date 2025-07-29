#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class OrchidsDatabaseAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.schemaPath = path.join(this.projectRoot, 'src/lib/db/schema.ts');
    this.queriesPath = path.join(this.projectRoot, 'src/lib/db/queries.ts');
    this.apiDir = path.join(this.projectRoot, 'src/app/api');
    this.componentsDir = path.join(this.projectRoot, 'src/components');
    this.mainContentPath = path.join(this.projectRoot, 'src/components/spotify-main-content.tsx');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m', // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async analyzeQuery(query) {
    this.log('🤖 Analyzing user query...', 'info');
    this.log(`Query: "${query}"`, 'info');

    const analysis = {
      feature: '',
      tables: [],
      apiRoutes: [],
      components: [],
      operations: [],
      uiPlacement: '',
      sectionTitle: '',
      sectionDescription: ''
    };

    // Analyze query for different features
    if (query.toLowerCase().includes('recently played') || query.toLowerCase().includes('recently played songs')) {
      analysis.feature = 'recently-played';
      analysis.tables = ['recently_played'];
      analysis.apiRoutes = ['recently-played'];
      analysis.components = ['RecentlyPlayedList'];
      analysis.operations = ['getRecentlyPlayedSongs', 'addRecentlyPlayedSong'];
      analysis.uiPlacement = 'top';
      analysis.sectionTitle = 'Recently Played';
      analysis.sectionDescription = 'Your listening history';
    } else if (query.toLowerCase().includes('made for you') || query.toLowerCase().includes('playlists')) {
      analysis.feature = 'playlists';
      analysis.tables = ['playlists', 'playlist_songs'];
      analysis.apiRoutes = ['playlists'];
      analysis.components = ['PlaylistList'];
      analysis.operations = ['getUserPlaylists', 'createPlaylist', 'addSongToPlaylist'];
      analysis.uiPlacement = 'middle';
      analysis.sectionTitle = 'Made For You';
      analysis.sectionDescription = 'Your personalized playlists';
    } else if (query.toLowerCase().includes('popular albums') || query.toLowerCase().includes('albums')) {
      analysis.feature = 'albums';
      analysis.tables = ['albums', 'album_songs'];
      analysis.apiRoutes = ['albums'];
      analysis.components = ['AlbumList'];
      analysis.operations = ['getPopularAlbums', 'getAlbumSongs'];
      analysis.uiPlacement = 'bottom';
      analysis.sectionTitle = 'Popular Albums';
      analysis.sectionDescription = 'Trending albums';
    } else if (query.toLowerCase().includes('user profile') || query.toLowerCase().includes('profile')) {
      analysis.feature = 'user-profiles';
      analysis.tables = ['user_profiles', 'user_preferences'];
      analysis.apiRoutes = ['user-profiles'];
      analysis.components = ['UserProfile'];
      analysis.operations = ['getUserProfile', 'upsertUserProfile'];
      analysis.uiPlacement = 'sidebar';
      analysis.sectionTitle = 'Profile';
      analysis.sectionDescription = 'Your account settings';
    } else {
      // Generic analysis for unknown features
      const words = query.toLowerCase().split(' ');
      analysis.feature = words.join('-');
      analysis.tables = [words.join('_')];
      analysis.apiRoutes = [words.join('-')];
      analysis.components = [words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'List'];
      analysis.operations = [`get${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`, `add${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`];
      analysis.uiPlacement = 'middle';
      analysis.sectionTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      analysis.sectionDescription = `Your ${words.join(' ')}`;
    }

    this.log(`✅ Analysis complete:`, 'success');
    this.log(`   Feature: ${analysis.feature}`, 'info');
    this.log(`   Tables: ${analysis.tables.join(', ')}`, 'info');
    this.log(`   API Routes: ${analysis.apiRoutes.join(', ')}`, 'info');
    this.log(`   Components: ${analysis.components.join(', ')}`, 'info');
    this.log(`   UI Placement: ${analysis.uiPlacement}`, 'info');
    this.log(`   Section Title: ${analysis.sectionTitle}`, 'info');

    return analysis;
  }

  async generateSchema(analysis) {
    this.log('📝 Generating database schema...', 'info');
    
    const schemaContent = this.generateSchemaContent(analysis);
    const currentSchema = fs.readFileSync(this.schemaPath, 'utf8');
    
    // Check if schema already exists
    const tableExists = analysis.tables.some(table => 
      currentSchema.includes(`export const ${table.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}`)
    );
    
    if (tableExists) {
      this.log('⚠️  Schema already exists, skipping...', 'warning');
      return;
    }

    // Append new schema to existing file
    const newSchemaContent = currentSchema + '\n' + schemaContent;
    fs.writeFileSync(this.schemaPath, newSchemaContent);
    
    this.log('✅ Schema generated successfully', 'success');
  }

  generateSchemaContent(analysis) {
    let content = '\n';
    
    analysis.tables.forEach(table => {
      const tableName = table.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const pascalCase = tableName.charAt(0).toUpperCase() + tableName.slice(1);
      
      if (table === 'recently_played') {
        content += `// ${pascalCase} table schema\n`;
        content += `export const ${tableName} = pgTable("${table}", {\n`;
        content += `  id: serial("id").primaryKey(),\n`;
        content += `  user_id: text("user_id").notNull(),\n`;
        content += `  song_id: text("song_id").notNull(),\n`;
        content += `  song_title: text("song_title").notNull(),\n`;
        content += `  artist_name: text("artist_name").notNull(),\n`;
        content += `  album_art: text("album_art"),\n`;
        content += `  played_at: timestamp("played_at").defaultNow().notNull(),\n`;
        content += `  duration_ms: integer("duration_ms"),\n`;
        content += `});\n\n`;
      } else if (table === 'playlists') {
        content += `// ${pascalCase} table schema\n`;
        content += `export const ${tableName} = pgTable("${table}", {\n`;
        content += `  id: serial("id").primaryKey(),\n`;
        content += `  user_id: text("user_id").notNull(),\n`;
        content += `  name: text("name").notNull(),\n`;
        content += `  description: text("description"),\n`;
        content += `  created_at: timestamp("created_at").defaultNow().notNull(),\n`;
        content += `  updated_at: timestamp("updated_at").defaultNow().notNull(),\n`;
        content += `});\n\n`;
      } else if (table === 'albums') {
        content += `// ${pascalCase} table schema\n`;
        content += `export const ${tableName} = pgTable("${table}", {\n`;
        content += `  id: serial("id").primaryKey(),\n`;
        content += `  title: text("title").notNull(),\n`;
        content += `  artist: text("artist").notNull(),\n`;
        content += `  album_art: text("album_art"),\n`;
        content += `  release_date: timestamp("release_date"),\n`;
        content += `  genre: text("genre"),\n`;
        content += `  created_at: timestamp("created_at").defaultNow().notNull(),\n`;
        content += `});\n\n`;
      } else {
        // Generic table schema
        content += `// ${pascalCase} table schema\n`;
        content += `export const ${tableName} = pgTable("${table}", {\n`;
        content += `  id: serial("id").primaryKey(),\n`;
        content += `  name: text("name").notNull(),\n`;
        content += `  created_at: timestamp("created_at").defaultNow().notNull(),\n`;
        content += `  updated_at: timestamp("updated_at").defaultNow().notNull(),\n`;
        content += `});\n\n`;
      }
    });

    // Add type exports
    analysis.tables.forEach(table => {
      const tableName = table.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const pascalCase = tableName.charAt(0).toUpperCase() + tableName.slice(1);
      content += `export type ${pascalCase} = typeof ${tableName}.$inferSelect;\n`;
      content += `export type New${pascalCase} = typeof ${tableName}.$inferInsert;\n\n`;
    });

    return content;
  }

  async generateQueries(analysis) {
    this.log('🔍 Generating database queries...', 'info');
    
    const queriesContent = this.generateQueriesContent(analysis);
    const currentQueries = fs.readFileSync(this.queriesPath, 'utf8');
    
    // Check if queries already exist
    const queryExists = analysis.operations.some(op => 
      currentQueries.includes(`export async function ${op}`)
    );
    
    if (queryExists) {
      this.log('⚠️  Queries already exist, skipping...', 'warning');
      return;
    }

    // Append new queries to existing file
    const newQueriesContent = currentQueries + '\n' + queriesContent;
    fs.writeFileSync(this.queriesPath, newQueriesContent);
    
    this.log('✅ Queries generated successfully', 'success');
  }

  generateQueriesContent(analysis) {
    let content = '\n';
    
    if (analysis.feature === 'recently-played') {
      content += `// ✅ Recently Played Songs\n`;
      content += `export async function getRecentlyPlayedSongs(userId: string, limit = 20) {\n`;
      content += `  try {\n`;
      content += `    const songs = await db\n`;
      content += `      .select()\n`;
      content += `      .from(recentlyPlayed)\n`;
      content += `      .where(eq(recentlyPlayed.user_id, userId))\n`;
      content += `      .orderBy(desc(recentlyPlayed.played_at))\n`;
      content += `      .limit(limit);\n\n`;
      content += `    return songs;\n`;
      content += `  } catch (error) {\n`;
      content += `    console.error("Error fetching recently played songs:", error);\n`;
      content += `    throw new Error("Failed to fetch recently played songs");\n`;
      content += `  }\n`;
      content += `}\n\n`;
      
      content += `export async function addRecentlyPlayedSong(songData: {\n`;
      content += `  user_id: string;\n`;
      content += `  song_id: string;\n`;
      content += `  song_title: string;\n`;
      content += `  artist_name: string;\n`;
      content += `  album_art?: string;\n`;
      content += `  duration_ms?: number;\n`;
      content += `}) {\n`;
      content += `  try {\n`;
      content += `    const result = await db.insert(recentlyPlayed).values(songData);\n`;
      content += `    return result;\n`;
      content += `  } catch (error) {\n`;
      content += `    console.error("Error adding recently played song:", error);\n`;
      content += `    throw new Error("Failed to add recently played song");\n`;
      content += `  }\n`;
      content += `}\n\n`;
    } else if (analysis.feature === 'playlists') {
      content += `// ✅ Playlist Functions\n`;
      content += `export async function getUserPlaylists(userId: string) {\n`;
      content += `  try {\n`;
      content += `    return await db\n`;
      content += `      .select()\n`;
      content += `      .from(playlists)\n`;
      content += `      .where(eq(playlists.user_id, userId))\n`;
      content += `      .orderBy(desc(playlists.created_at));\n`;
      content += `  } catch (error) {\n`;
      content += `    console.error("Error fetching user playlists:", error);\n`;
      content += `    throw new Error("Failed to fetch user playlists");\n`;
      content += `  }\n`;
      content += `}\n\n`;
    } else if (analysis.feature === 'albums') {
      content += `// ✅ Album Functions\n`;
      content += `export async function getPopularAlbums(limit = 20) {\n`;
      content += `  try {\n`;
      content += `    return await db\n`;
      content += `      .select()\n`;
      content += `      .from(albums)\n`;
      content += `      .orderBy(desc(albums.created_at))\n`;
      content += `      .limit(limit);\n`;
      content += `  } catch (error) {\n`;
      content += `    console.error("Error fetching popular albums:", error);\n`;
      content += `    throw new Error("Failed to fetch popular albums");\n`;
      content += `  }\n`;
      content += `}\n\n`;
    }

    return content;
  }

  async generateApiRoute(analysis) {
    this.log('🌐 Generating API routes...', 'info');
    
    analysis.apiRoutes.forEach(route => {
      const routeDir = path.join(this.apiDir, route);
      const routeFile = path.join(routeDir, 'route.ts');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      // Check if route already exists
      if (fs.existsSync(routeFile)) {
        this.log(`⚠️  API route ${route} already exists, skipping...`, 'warning');
        return;
      }
      
      const routeContent = this.generateApiRouteContent(route, analysis);
      fs.writeFileSync(routeFile, routeContent);
      
      this.log(`✅ API route ${route} generated successfully`, 'success');
    });
  }

  generateApiRouteContent(route, analysis) {
    if (route === 'recently-played') {
      return `import { NextRequest, NextResponse } from "next/server";
import { getRecentlyPlayedSongs, addRecentlyPlayedSong } from "@/lib/db/queries";

// GET handler to fetch recently played songs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const songs = await getRecentlyPlayedSongs(userId, limit);

    return NextResponse.json({ songs });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently played songs" },
      { status: 500 }
    );
  }
}

// POST handler to add a song to recently played
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, song_id, song_title, artist_name, album_art, duration_ms } = body;

    if (!user_id || !song_id || !song_title || !artist_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await addRecentlyPlayedSong({
      user_id,
      song_id,
      song_title,
      artist_name,
      album_art,
      duration_ms,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to add recently played song" },
      { status: 500 }
    );
  }
}`;
    } else if (route === 'playlists') {
      return `import { NextRequest, NextResponse } from "next/server";
import { getUserPlaylists } from "@/lib/db/queries";

// GET handler to fetch user playlists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const playlists = await getUserPlaylists(userId);

    return NextResponse.json({ playlists });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}`;
    } else if (route === 'albums') {
      return `import { NextRequest, NextResponse } from "next/server";
import { getPopularAlbums } from "@/lib/db/queries";

// GET handler to fetch popular albums
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const albums = await getPopularAlbums(limit);

    return NextResponse.json({ albums });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}`;
    } else {
      return `import { NextRequest, NextResponse } from "next/server";

// GET handler for ${route}
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ message: "${route} endpoint" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ${route}" },
      { status: 500 }
    );
  }
}

// POST handler for ${route}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create ${route}" },
      { status: 500 }
    );
  }
}`;
    }
  }

  async generateComponent(analysis) {
    this.log('🎨 Generating frontend components...', 'info');
    
    analysis.components.forEach(component => {
      const componentFile = path.join(this.componentsDir, `${component.toLowerCase()}.tsx`);
      
      // Check if component already exists
      if (fs.existsSync(componentFile)) {
        this.log(`⚠️  Component ${component} already exists, skipping...`, 'warning');
        return;
      }
      
      const componentContent = this.generateComponentContent(component, analysis);
      fs.writeFileSync(componentFile, componentContent);
      
      this.log(`✅ Component ${component} generated successfully`, 'success');
    });
  }

  generateComponentContent(component, analysis) {
    if (component === 'RecentlyPlayedList') {
      return `"use client"

import { useState, useEffect } from 'react'
import { Play, Clock, Music } from 'lucide-react'

// Type for recently played song
export interface RecentlyPlayedSong {
  id: number
  user_id: string
  song_id: string
  song_title: string
  artist_name: string
  album_art?: string
  played_at: string
  duration_ms?: number
}

interface RecentlyPlayedListProps {
  userId?: string
  limit?: number
  className?: string
  onPlayTrack?: (song: RecentlyPlayedSong) => void
  showHeader?: boolean
}

export default function RecentlyPlayedList({
  userId = 'user123',
  limit = 10,
  className = '',
  onPlayTrack,
  showHeader = true
}: RecentlyPlayedListProps) {
  const [songs, setSongs] = useState<RecentlyPlayedSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(\`/api/recently-played?userId=\${userId}&limit=\${limit}\`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recently played songs')
        }
        
        const data = await response.json()
        setSongs(data.songs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching recently played songs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyPlayed()
  }, [userId, limit])

  if (loading) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
        )}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-[#181818] rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-[#282828] rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#282828] rounded w-3/4"></div>
                <div className="h-3 bg-[#282828] rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Music className="w-5 h-5" />
            <span>Error loading recently played songs</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Clock className="w-5 h-5" />
            <span>No recently played songs</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">Start listening to see your history here</p>
        </div>
      </div>
    )
  }

  return (
    <div className={\`\${className}\`}>
      {showHeader && (
        <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
      )}
      <div className="space-y-2">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center space-x-3 p-3 bg-[#181818] hover:bg-[#282828] rounded-lg transition-colors cursor-pointer group"
            onClick={() => onPlayTrack?.(song)}
          >
            {song.album_art ? (
              <img 
                src={song.album_art} 
                alt={song.song_title}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-[#282828] rounded-md flex items-center justify-center">
                <Music className="w-6 h-6 text-[#b3b3b3]" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{song.song_title}</div>
              <div className="text-sm text-[#b3b3b3] truncate">{song.artist_name}</div>
            </div>
            
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#404040] rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                onPlayTrack?.(song)
              }}
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}`;
    } else if (component === 'PlaylistList') {
      return `"use client"

import { useState, useEffect } from 'react'
import { Play, Music, Plus } from 'lucide-react'

interface Playlist {
  id: number
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface PlaylistListProps {
  userId?: string
  limit?: number
  className?: string
  onPlayTrack?: (playlist: Playlist) => void
  showHeader?: boolean
}

export default function PlaylistList({
  userId = 'user123',
  limit = 6,
  className = '',
  onPlayTrack,
  showHeader = true
}: PlaylistListProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(\`/api/playlists?userId=\${userId}&limit=\${limit}\`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch playlists')
        }
        
        const data = await response.json()
        setPlaylists(data.playlists || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching playlists:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [userId, limit])

  if (loading) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Made For You</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-[#181818] rounded-lg animate-pulse">
              <div className="w-full aspect-square bg-[#282828] rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#282828] rounded w-3/4"></div>
                <div className="h-3 bg-[#282828] rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Made For You</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Music className="w-5 h-5" />
            <span>Error loading playlists</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (playlists.length === 0) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Made For You</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Plus className="w-5 h-5" />
            <span>No playlists found</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">Create your first playlist to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className={\`\${className}\`}>
      {showHeader && (
        <h2 className="text-xl font-bold mb-4 text-white">Made For You</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="group cursor-pointer p-4 rounded-lg transition-all duration-300 hover:bg-[var(--color-interactive-hover)] border border-transparent hover:border-gray-600/50"
            onClick={() => onPlayTrack?.(playlist)}
          >
            <div className="relative w-full aspect-square mb-4">
              <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-chart-1)] opacity-20 rounded-lg flex items-center justify-center">
                <Music className="w-12 h-12 text-[#b3b3b3]" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                    onPlayTrack?.(playlist)
                  }}
                  className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer"
                >
                  <Play className="w-5 h-5 text-black fill-black ml-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate">{playlist.name}</h3>
              <p className="text-[var(--color-text-secondary)] text-xs truncate">{playlist.description || 'Playlist'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`;
    } else if (component === 'AlbumList') {
      return `"use client"

import { useState, useEffect } from 'react'
import { Play, Disc } from 'lucide-react'

interface Album {
  id: number
  title: string
  artist: string
  album_art?: string
  release_date?: string
  genre?: string
  created_at: string
}

interface AlbumListProps {
  limit?: number
  className?: string
  onPlayTrack?: (album: Album) => void
  showHeader?: boolean
}

export default function AlbumList({
  limit = 6,
  className = '',
  onPlayTrack,
  showHeader = true
}: AlbumListProps) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(\`/api/albums?limit=\${limit}\`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch albums')
        }
        
        const data = await response.json()
        setAlbums(data.albums || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching albums:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [limit])

  if (loading) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-[#181818] rounded-lg animate-pulse">
              <div className="w-full aspect-square bg-[#282828] rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#282828] rounded w-3/4"></div>
                <div className="h-3 bg-[#282828] rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Disc className="w-5 h-5" />
            <span>Error loading albums</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className={\`\${className}\`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Disc className="w-5 h-5" />
            <span>No albums found</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">Popular albums will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className={\`\${className}\`}>
      {showHeader && (
        <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="group cursor-pointer p-4 rounded-lg transition-all duration-300 hover:bg-[var(--color-interactive-hover)] border border-transparent hover:border-gray-600/50"
            onClick={() => onPlayTrack?.(album)}
          >
            <div className="relative w-full aspect-square mb-4">
              {album.album_art ? (
                <img 
                  src={album.album_art} 
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-chart-1)] opacity-20 rounded-lg flex items-center justify-center">
                  <Disc className="w-12 h-12 text-[#b3b3b3]" />
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div 
                  onClick={(e) => {
                    e.stopPropagation()
                    onPlayTrack?.(album)
                  }}
                  className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer"
                >
                  <Play className="w-5 h-5 text-black fill-black ml-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate">{album.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-xs truncate">{album.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`;
    } else {
      return `"use client"

import { useState, useEffect } from 'react'

interface ${component}Props {
  // Add your props here
}

export default function ${component}({ }: ${component}Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Add your API call here
        const response = await fetch('/api/${analysis.feature}')
        
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const result = await response.json()
        setData(result.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>${component}</h2>
      {/* Add your component content here */}
    </div>
  )
}`;
    }
  }

  async integrateIntoFrontend(analysis) {
    this.log('🎨 Integrating into frontend...', 'info');
    
    if (!fs.existsSync(this.mainContentPath)) {
      this.log('⚠️  Main content file not found, skipping frontend integration', 'warning');
      return;
    }

    const mainContent = fs.readFileSync(this.mainContentPath, 'utf8');
    
    // Check if component is already imported
    const componentName = analysis.components[0];
    const importExists = mainContent.includes(`import ${componentName}`);
    
    if (importExists) {
      this.log(`⚠️  Component ${componentName} already integrated, skipping...`, 'warning');
      return;
    }

    // Add import statement
    const importStatement = `import ${componentName} from "./${componentName.toLowerCase()}"`;
    const newMainContent = mainContent.replace(
      /import RecentlyPlayedList, { RecentlyPlayedSong } from "\.\/recently-played-list"/,
      `import RecentlyPlayedList, { RecentlyPlayedSong } from "./recently-played-list"\nimport ${componentName} from "./${componentName.toLowerCase()}"`
    );

    // Add component to the UI based on placement
    let updatedContent = newMainContent;
    
    if (analysis.uiPlacement === 'top') {
      // Add after Recently Played section
      const sectionToAdd = `
      {/* ${analysis.sectionTitle} - Database Driven */}
      <section className="px-6 py-8">
        <${componentName} 
          userId="user123"
          limit={6}
          onPlayTrack={handlePlayTrack}
          showHeader={true}
          className="mb-8"
        />
      </section>`;
      
      updatedContent = newMainContent.replace(
        /{\/\* Recently Played Songs from API \*\/\s*<section className="px-6 py-8">/,
        `{/* Recently Played Songs from API */}
      <section className="px-6 py-8">`
      );
      
      updatedContent = updatedContent.replace(
        /<\/section>\s*{\/\* Made For You/,
        `</section>${sectionToAdd}

      {/* Made For You`
      );
    } else if (analysis.uiPlacement === 'middle') {
      // Replace Made For You section
      const sectionToAdd = `
      {/* ${analysis.sectionTitle} - Database Driven */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">${analysis.sectionTitle}</h2>
          <button className="text-[var(--color-text-secondary)] text-sm font-medium hover:text-[var(--color-text-primary)] transition-colors">
            Show all
          </button>
        </div>
        <${componentName} 
          userId="user123"
          limit={6}
          onPlayTrack={handlePlayTrack}
          showHeader={false}
        />
      </section>`;
      
      updatedContent = newMainContent.replace(
        /{\/\* Made For You - Now using database data \*\/\s*<section className="px-6 py-8">[\s\S]*?<\/section>/,
        sectionToAdd
      );
    } else if (analysis.uiPlacement === 'bottom') {
      // Replace Popular Albums section
      const sectionToAdd = `
      {/* ${analysis.sectionTitle} - Database Driven */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">${analysis.sectionTitle}</h2>
          <button className="text-[var(--color-text-secondary)] text-sm font-medium hover:text-[var(--color-text-primary)] transition-colors">
            Show all
          </button>
        </div>
        <${componentName} 
          limit={6}
          onPlayTrack={handlePlayTrack}
          showHeader={false}
        />
      </section>`;
      
      updatedContent = newMainContent.replace(
        /{\/\* Popular Albums - Now using database data \*\/\s*<section className="px-6 py-8">[\s\S]*?<\/section>/,
        sectionToAdd
      );
    }

    fs.writeFileSync(this.mainContentPath, updatedContent);
    this.log(`✅ Component ${componentName} integrated into frontend`, 'success');
  }

  async runDatabaseMigration() {
    this.log('🗄️  Running database migration...', 'info');
    
    try {
      execSync('npm run db:push', { stdio: 'inherit' });
      this.log('✅ Database migration completed successfully', 'success');
    } catch (error) {
      this.log('❌ Database migration failed', 'error');
      this.log(error.message, 'error');
    }
  }

  async implementFeature(query) {
    this.log('🚀 Starting feature implementation...', 'info');
    
    try {
      // Step 1: Analyze the query
      const analysis = await this.analyzeQuery(query);
      
      // Step 2: Generate database schema
      await this.generateSchema(analysis);
      
      // Step 3: Generate database queries
      await this.generateQueries(analysis);
      
      // Step 4: Generate API routes
      await this.generateApiRoute(analysis);
      
      // Step 5: Generate frontend components
      await this.generateComponent(analysis);
      
      // Step 6: Integrate into frontend
      await this.integrateIntoFrontend(analysis);
      
      // Step 7: Run database migration
      await this.runDatabaseMigration();
      
      this.log('🎉 Feature implementation completed successfully!', 'success');
      this.log('📋 Summary:', 'info');
      this.log(`   - Database schema updated`, 'info');
      this.log(`   - API routes created`, 'info');
      this.log(`   - Frontend components generated`, 'info');
      this.log(`   - Components integrated into main UI`, 'info');
      this.log(`   - Database migration applied`, 'info');
      this.log(`   - Changes visible on localhost:3002`, 'success');
      
    } catch (error) {
      this.log('❌ Feature implementation failed', 'error');
      this.log(error.message, 'error');
    }
  }

  showHelp() {
    console.log(`
🌱 Orchids Database Agent

Usage:
  node database-agent.js <command> [query]

Commands:
  --generate <query>    Generate database schema and API routes
  --implement <query>   Implement full feature (schema + API + frontend)
  --help               Show this help message

Examples:
  node database-agent.js --implement "store recently played songs"
  node database-agent.js --implement "store made for you playlists"
  node database-agent.js --implement "store popular albums"
  node database-agent.js --generate "user profiles"

Supported Features:
  - Recently played songs
  - Playlists (Made for you)
  - Albums (Popular albums)
  - User profiles
  - Custom features (auto-generated)

The agent will:
  1. Analyze your query
  2. Generate appropriate database schemas
  3. Create API endpoints
  4. Generate frontend components
  5. Run database migrations
  6. Integrate with existing codebase
`);
  }
}

// CLI Entry Point
async function main() {
  const agent = new OrchidsDatabaseAgent();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    agent.showHelp();
    return;
  }
  
  const command = args[0];
  const query = args.slice(1).join(' ');
  
  if (!query) {
    console.log('❌ Error: Query is required');
    agent.showHelp();
    return;
  }
  
  agent.log('🌱 Orchids Database Agent Starting...', 'info');
  
  if (command === '--generate') {
    agent.log('📝 Generating database features...', 'info');
    const analysis = await agent.analyzeQuery(query);
    await agent.generateSchema(analysis);
    await agent.generateQueries(analysis);
    await agent.generateApiRoute(analysis);
    agent.log('✅ Generation completed!', 'success');
  } else if (command === '--implement') {
    await agent.implementFeature(query);
  } else {
    console.log('❌ Error: Unknown command');
    agent.showHelp();
  }
}

// Run the CLI
if (require.main === module) {
  main().catch(console.error);
}

module.exports = OrchidsDatabaseAgent; 