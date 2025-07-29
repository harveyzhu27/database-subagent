import { NextRequest, NextResponse } from "next/server";
import { getPopularAlbums, addPopularAlbum, updateAlbumPlayCount } from "@/lib/db/queries";

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
      { error: "Failed to fetch popular albums" },
      { status: 500 }
    );
  }
}

// POST handler to add a popular album
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      album_id, 
      album_title, 
      artist_name, 
      album_art, 
      genre, 
      release_date, 
      total_plays, 
      weekly_plays, 
      monthly_plays, 
      popularity_score 
    } = body;

    if (!album_id || !album_title || !artist_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await addPopularAlbum({
      album_id,
      album_title,
      artist_name,
      album_art,
      genre,
      release_date: release_date ? new Date(release_date) : undefined,
      total_plays,
      weekly_plays,
      monthly_plays,
      popularity_score,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to add popular album" },
      { status: 500 }
    );
  }
}

// PATCH handler to update album play count
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { album_id } = body;

    if (!album_id) {
      return NextResponse.json(
        { error: "album_id is required" },
        { status: 400 }
      );
    }

    await updateAlbumPlayCount(album_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update album play count" },
      { status: 500 }
    );
  }
} 