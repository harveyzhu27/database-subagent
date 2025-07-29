import { NextRequest, NextResponse } from "next/server";

// GET handler for store-user-favorites
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ message: "store-user-favorites endpoint" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch store-user-favorites" },
      { status: 500 }
    );
  }
}

// POST handler for store-user-favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create store-user-favorites" },
      { status: 500 }
    );
  }
}