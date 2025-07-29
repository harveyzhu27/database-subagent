import { NextRequest, NextResponse } from "next/server";
import { getMadeForYouRecommendations, addMadeForYouRecommendation } from "@/lib/db/queries";

// GET handler to fetch made for you recommendations
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

    const recommendations = await getMadeForYouRecommendations(userId, limit);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch made for you recommendations" },
      { status: 500 }
    );
  }
}

// POST handler to add a made for you recommendation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      song_id, 
      song_title, 
      artist_name, 
      album_art, 
      album_name, 
      duration_ms, 
      recommendation_reason, 
      confidence_score 
    } = body;

    if (!user_id || !song_id || !song_title || !artist_name || !album_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await addMadeForYouRecommendation({
      user_id,
      song_id,
      song_title,
      artist_name,
      album_art,
      album_name,
      duration_ms,
      recommendation_reason,
      confidence_score,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to add made for you recommendation" },
      { status: 500 }
    );
  }
} 