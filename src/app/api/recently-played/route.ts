import { NextRequest, NextResponse } from "next/server";
import { getRecentlyPlayedSongs, addRecentlyPlayedSong, toggleSongLike } from "@/lib/db/queries";

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
      liked: body.liked,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to add recently played song" },
      { status: 500 }
    );
  }
}

// PATCH handler to toggle song like status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, song_id, liked } = body;

    if (!user_id || !song_id || typeof liked !== 'boolean') {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await toggleSongLike(user_id, song_id, liked);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to toggle song like" },
      { status: 500 }
    );
  }
}
