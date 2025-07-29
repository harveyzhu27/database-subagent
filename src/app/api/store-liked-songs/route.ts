import { NextRequest, NextResponse } from "next/server";

// GET handler for store-liked-songs
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ message: "store-liked-songs endpoint" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch store-liked-songs" },
      { status: 500 }
    );
  }
}

// POST handler for store-liked-songs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create store-liked-songs" },
      { status: 500 }
    );
  }
}