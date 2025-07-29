import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

// Recently played songs table schema
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

// Playlists table schema
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Playlist songs junction table
export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlist_id: integer("playlist_id").notNull(),
  song_id: text("song_id").notNull(),
  song_title: text("song_title").notNull(),
  artist_name: text("artist_name").notNull(),
  album_art: text("album_art"),
  added_at: timestamp("added_at").defaultNow().notNull(),
});

// User profiles table schema
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  email: text("email").notNull(),
  display_name: text("display_name"),
  avatar_url: text("avatar_url"),
  is_premium: boolean("is_premium").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().unique(),
  theme: text("theme").default("dark"),
  language: text("language").default("en"),
  auto_play: boolean("auto_play").default(true),
  crossfade_duration: integer("crossfade_duration").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Generic feature table schema
export const featureItems = pgTable("feature_items", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("active"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Type definitions
export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;
export type NewRecentlyPlayed = typeof recentlyPlayed.$inferInsert;

export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;
export type PlaylistSong = typeof playlistSongs.$inferSelect;
export type NewPlaylistSong = typeof playlistSongs.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;

export type FeatureItem = typeof featureItems.$inferSelect;
export type NewFeatureItem = typeof featureItems.$inferInsert;

// Albums table schema
export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album_art: text("album_art"),
  release_date: timestamp("release_date"),
  genre: text("genre"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// AlbumSongs table schema
export const albumSongs = pgTable("album_songs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Albums = typeof albums.$inferSelect;
export type NewAlbums = typeof albums.$inferInsert;

export type AlbumSongs = typeof albumSongs.$inferSelect;
export type NewAlbumSongs = typeof albumSongs.$inferInsert;



// StoreUserFavorites table schema
export const storeUserFavorites = pgTable("store_user_favorites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type StoreUserFavorites = typeof storeUserFavorites.$inferSelect;
export type NewStoreUserFavorites = typeof storeUserFavorites.$inferInsert;

