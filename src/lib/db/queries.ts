import { db } from "./index";
import {
  recentlyPlayed,
  playlists,
  playlistSongs,
  userProfiles,
  userPreferences,
  featureItems,
  albums,
  albumSongs,
} from "./schema";
import { eq, desc } from "drizzle-orm";

// ✅ Recently Played Songs
export async function getRecentlyPlayedSongs(userId: string, limit = 20) {
  try {
    const songs = await db
      .select()
      .from(recentlyPlayed)
      .where(eq(recentlyPlayed.user_id, userId))
      .orderBy(desc(recentlyPlayed.played_at))
      .limit(limit);

    return songs;
  } catch (error) {
    console.error("Error fetching recently played songs:", error);
    throw new Error("Failed to fetch recently played songs");
  }
}

export async function addRecentlyPlayedSong(songData: {
  user_id: string;
  song_id: string;
  song_title: string;
  artist_name: string;
  album_art?: string;
  duration_ms?: number;
}) {
  try {
    const result = await db.insert(recentlyPlayed).values(songData);
    return result;
  } catch (error) {
    console.error("Error adding recently played song:", error);
    throw new Error("Failed to add recently played song");
  }
}

// ✅ Playlist Functions
export async function getUserPlaylists(userId: string) {
  try {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.user_id, userId))
      .orderBy(desc(playlists.created_at));
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    throw new Error("Failed to fetch user playlists");
  }
}

export async function createPlaylist(playlistData: {
  user_id: string;
  name: string;
  description?: string;
}) {
  try {
    return await db.insert(playlists).values(playlistData);
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw new Error("Failed to create playlist");
  }
}

export async function addSongToPlaylist(songData: {
  playlist_id: number;
  song_id: string;
  song_title: string;
  artist_name: string;
  album_art?: string;
}) {
  try {
    return await db.insert(playlistSongs).values(songData);
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw new Error("Failed to add song to playlist");
  }
}

export async function getPlaylistSongs(playlistId: number) {
  try {
    return await db
      .select()
      .from(playlistSongs)
      .where(eq(playlistSongs.playlist_id, playlistId))
      .orderBy(desc(playlistSongs.added_at));
  } catch (error) {
    console.error("Error fetching playlist songs:", error);
    throw new Error("Failed to fetch playlist songs");
  }
}

// ✅ User Profiles
export async function getUserProfile(userId: string) {
  try {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.user_id, userId))
      .limit(1);

    return profile[0] || null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

export async function upsertUserProfile(profileData: {
  user_id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  is_premium?: boolean;
}) {
  try {
    return await db
      .insert(userProfiles)
      .values(profileData)
      .onConflictDoUpdate({
        target: userProfiles.user_id,
        set: {
          email: profileData.email,
          display_name: profileData.display_name,
          avatar_url: profileData.avatar_url,
          is_premium: profileData.is_premium,
          updated_at: new Date(),
        },
      });
  } catch (error) {
    console.error("Error upserting user profile:", error);
    throw new Error("Failed to upsert user profile");
  }
}

// ✅ User Preferences
export async function getUserPreferences(userId: string) {
  try {
    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.user_id, userId))
      .limit(1);

    return preferences[0] || null;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    throw new Error("Failed to fetch user preferences");
  }
}

export async function upsertUserPreferences(preferencesData: {
  user_id: string;
  theme?: string;
  language?: string;
  auto_play?: boolean;
  crossfade_duration?: number;
}) {
  try {
    return await db
      .insert(userPreferences)
      .values(preferencesData)
      .onConflictDoUpdate({
        target: userPreferences.user_id,
        set: {
          theme: preferencesData.theme,
          language: preferencesData.language,
          auto_play: preferencesData.auto_play,
          crossfade_duration: preferencesData.crossfade_duration,
          updated_at: new Date(),
        },
      });
  } catch (error) {
    console.error("Error upserting user preferences:", error);
    throw new Error("Failed to upsert user preferences");
  }
}

// ✅ Feature Items
export async function getUserFeatureItems(userId: string) {
  try {
    return await db
      .select()
      .from(featureItems)
      .where(eq(featureItems.user_id, userId))
      .orderBy(desc(featureItems.created_at));
  } catch (error) {
    console.error("Error fetching feature items:", error);
    throw new Error("Failed to fetch feature items");
  }
}

export async function createFeatureItem(itemData: {
  user_id: string;
  title: string;
  description?: string;
  status?: string;
}) {
  try {
    return await db.insert(featureItems).values(itemData);
  } catch (error) {
    console.error("Error creating feature item:", error);
    throw new Error("Failed to create feature item");
  }
}

export async function updateFeatureItem(
  id: number,
  updateData: { title?: string; description?: string; status?: string }
) {
  try {
    return await db
      .update(featureItems)
      .set({ ...updateData, updated_at: new Date() })
      .where(eq(featureItems.id, id));
  } catch (error) {
    console.error("Error updating feature item:", error);
    throw new Error("Failed to update feature item");
  }
}


// ✅ Album Functions
export async function getPopularAlbums(limit = 20) {
  try {
    return await db
      .select()
      .from(albums)
      .orderBy(desc(albums.created_at))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching popular albums:", error);
    throw new Error("Failed to fetch popular albums");
  }
}





