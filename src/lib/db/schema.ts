import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

// Songs table schema - base songs with metadata
export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  song_id: text("song_id").notNull().unique(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album").notNull(),
  album_art: text("album_art"),
  duration_ms: integer("duration_ms"),
  genre: text("genre"),
  release_date: timestamp("release_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

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
  liked: boolean("liked").default(false), // NEW: Track if user liked this song
  play_count: integer("play_count").default(1), // NEW: Track how many times played
});

// Made for you recommendations table
export const madeForYou = pgTable("made_for_you", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  song_id: text("song_id").notNull(),
  song_title: text("song_title").notNull(),
  artist_name: text("artist_name").notNull(),
  album_art: text("album_art"),
  album_name: text("album_name").notNull(),
  duration_ms: integer("duration_ms"),
  recommendation_reason: text("recommendation_reason"), // e.g., "Based on your listening history"
  confidence_score: integer("confidence_score"), // 1-100 score for recommendation quality
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Popular albums table
export const popularAlbums = pgTable("popular_albums", {
  id: serial("id").primaryKey(),
  album_id: text("album_id").notNull().unique(),
  album_title: text("album_title").notNull(),
  artist_name: text("artist_name").notNull(),
  album_art: text("album_art"),
  genre: text("genre"),
  release_date: timestamp("release_date"),
  total_plays: integer("total_plays").default(0),
  weekly_plays: integer("weekly_plays").default(0),
  monthly_plays: integer("monthly_plays").default(0),
  popularity_score: integer("popularity_score").default(0), // 1-100 popularity score
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// User song interactions table - track likes, skips, etc.
export const userSongInteractions = pgTable("user_song_interactions", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  song_id: text("song_id").notNull(),
  interaction_type: text("interaction_type").notNull(), // 'like', 'skip', 'play', 'share'
  created_at: timestamp("created_at").defaultNow().notNull(),
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

// New type definitions
export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export type MadeForYou = typeof madeForYou.$inferSelect;
export type NewMadeForYou = typeof madeForYou.$inferInsert;

export type PopularAlbum = typeof popularAlbums.$inferSelect;
export type NewPopularAlbum = typeof popularAlbums.$inferInsert;

export type UserSongInteraction = typeof userSongInteractions.$inferSelect;
export type NewUserSongInteraction = typeof userSongInteractions.$inferInsert;



// StoreLikedSongs table schema
export const storeLikedSongs = pgTable("store_liked_songs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type StoreLikedSongs = typeof storeLikedSongs.$inferSelect;
export type NewStoreLikedSongs = typeof storeLikedSongs.$inferInsert;

