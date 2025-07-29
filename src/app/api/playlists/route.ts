import { NextRequest, NextResponse } from "next/server";
import { getUserPlaylists, createPlaylist, addSongToPlaylist, getPlaylistSongs } from "@/lib/db/queries";

// GET handler to fetch user playlists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const playlistId = searchParams.get("playlistId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (playlistId) {
      // Get songs for specific playlist
      const songs = await getPlaylistSongs(parseInt(playlistId));
      return NextResponse.json({ songs });
    } else {
      // Get all playlists for user
      const playlists = await getUserPlaylists(userId);
      return NextResponse.json({ playlists });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

// POST handler to create playlist or add song
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "create_playlist") {
      const { user_id, name, description } = data;
      
      if (!user_id || !name) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      await createPlaylist({ user_id, name, description });
      return NextResponse.json({ success: true });
    } else if (action === "add_song") {
      const { playlist_id, song_id, song_title, artist_name, album_art } = data;
      
      if (!playlist_id || !song_id || !song_title || !artist_name) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      await addSongToPlaylist({
        playlist_id,
        song_id,
        song_title,
        artist_name,
        album_art,
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to process playlist request" },
      { status: 500 }
    );
  }
}