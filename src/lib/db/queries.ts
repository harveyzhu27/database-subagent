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
  songs,
  madeForYou,
  popularAlbums,
  userSongInteractions,
} from "./schema";
import { eq, desc, and, gte } from "drizzle-orm";

// ✅ Recently Played Songs - Updated with liked and play_count
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
  liked?: boolean;
}) {
  try {
    // Check if song already exists for this user
    const existingSong = await db
      .select()
      .from(recentlyPlayed)
      .where(and(
        eq(recentlyPlayed.user_id, songData.user_id),
        eq(recentlyPlayed.song_id, songData.song_id)
      ))
      .limit(1);

    if (existingSong.length > 0) {
      // Update existing record - increment play count and update timestamp
      await db
        .update(recentlyPlayed)
        .set({
          played_at: new Date(),
          play_count: (existingSong[0].play_count || 1) + 1,
          liked: songData.liked !== undefined ? songData.liked : existingSong[0].liked,
        })
        .where(eq(recentlyPlayed.id, existingSong[0].id));
    } else {
      // Insert new record
      await db.insert(recentlyPlayed).values({
        ...songData,
        play_count: 1,
        liked: songData.liked || false,
      });
    }

    // Also record the interaction
    await db.insert(userSongInteractions).values({
      user_id: songData.user_id,
      song_id: songData.song_id,
      interaction_type: 'play',
    });
  } catch (error) {
    console.error("Error adding recently played song:", error);
    throw new Error("Failed to add recently played song");
  }
}

export async function toggleSongLike(userId: string, songId: string, liked: boolean) {
  try {
    await db
      .update(recentlyPlayed)
      .set({ liked })
      .where(and(
        eq(recentlyPlayed.user_id, userId),
        eq(recentlyPlayed.song_id, songId)
      ));

    // Record the interaction
    await db.insert(userSongInteractions).values({
      user_id: userId,
      song_id: songId,
      interaction_type: liked ? 'like' : 'unlike',
    });
  } catch (error) {
    console.error("Error toggling song like:", error);
    throw new Error("Failed to toggle song like");
  }
}

// ✅ Made for You Recommendations
export async function getMadeForYouRecommendations(userId: string, limit = 20) {
  try {
    const recommendations = await db
      .select()
      .from(madeForYou)
      .where(eq(madeForYou.user_id, userId))
      .orderBy(desc(madeForYou.confidence_score))
      .limit(limit);

    return recommendations;
  } catch (error) {
    console.error("Error fetching made for you recommendations:", error);
    throw new Error("Failed to fetch made for you recommendations");
  }
}

export async function addMadeForYouRecommendation(recommendationData: {
  user_id: string;
  song_id: string;
  song_title: string;
  artist_name: string;
  album_art?: string;
  album_name: string;
  duration_ms?: number;
  recommendation_reason?: string;
  confidence_score?: number;
}) {
  try {
    await db.insert(madeForYou).values({
      ...recommendationData,
      confidence_score: recommendationData.confidence_score || 50,
    });
  } catch (error) {
    console.error("Error adding made for you recommendation:", error);
    throw new Error("Failed to add made for you recommendation");
  }
}

// ✅ Popular Albums
export async function getPopularAlbums(limit = 20) {
  try {
    return await db
      .select()
      .from(popularAlbums)
      .orderBy(desc(popularAlbums.popularity_score))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching popular albums:", error);
    throw new Error("Failed to fetch popular albums");
  }
}

export async function addPopularAlbum(albumData: {
  album_id: string;
  album_title: string;
  artist_name: string;
  album_art?: string;
  genre?: string;
  release_date?: Date;
  total_plays?: number;
  weekly_plays?: number;
  monthly_plays?: number;
  popularity_score?: number;
}) {
  try {
    await db.insert(popularAlbums).values({
      ...albumData,
      popularity_score: albumData.popularity_score || 50,
    });
  } catch (error) {
    console.error("Error adding popular album:", error);
    throw new Error("Failed to add popular album");
  }
}

export async function updateAlbumPlayCount(albumId: string) {
  try {
    // First get the current values
    const currentAlbum = await db
      .select()
      .from(popularAlbums)
      .where(eq(popularAlbums.album_id, albumId))
      .limit(1);

    if (currentAlbum.length > 0) {
      const current = currentAlbum[0];
      await db
        .update(popularAlbums)
        .set({
          total_plays: (current.total_plays || 0) + 1,
          weekly_plays: (current.weekly_plays || 0) + 1,
          monthly_plays: (current.monthly_plays || 0) + 1,
          updated_at: new Date(),
        })
        .where(eq(popularAlbums.album_id, albumId));
    }
  } catch (error) {
    console.error("Error updating album play count:", error);
    throw new Error("Failed to update album play count");
  }
}

// ✅ User Song Interactions
export async function getUserSongInteractions(userId: string, limit = 50) {
  try {
    return await db
      .select()
      .from(userSongInteractions)
      .where(eq(userSongInteractions.user_id, userId))
      .orderBy(desc(userSongInteractions.created_at))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching user song interactions:", error);
    throw new Error("Failed to fetch user song interactions");
  }
}

export async function addUserSongInteraction(interactionData: {
  user_id: string;
  song_id: string;
  interaction_type: 'like' | 'skip' | 'play' | 'share' | 'unlike';
}) {
  try {
    await db.insert(userSongInteractions).values(interactionData);
  } catch (error) {
    console.error("Error adding user song interaction:", error);
    throw new Error("Failed to add user song interaction");
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


// ✅ Album Functions (Legacy - keeping for backward compatibility)
export async function getLegacyPopularAlbums(limit = 20) {
  try {
    return await db
      .select()
      .from(albums)
      .orderBy(desc(albums.created_at))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching legacy popular albums:", error);
    throw new Error("Failed to fetch legacy popular albums");
  }
}









