import { NextRequest, NextResponse } from "next/server";
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
}