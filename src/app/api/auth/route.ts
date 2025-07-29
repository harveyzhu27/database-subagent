import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, upsertUserProfile, getUserPreferences, upsertUserPreferences } from "@/lib/db/queries";

// GET handler to fetch user profile or preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "profile"; // "profile" or "preferences"

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      const preferences = await getUserPreferences(userId);
      return NextResponse.json({ preferences });
    } else {
      const profile = await getUserProfile(userId);
      return NextResponse.json({ profile });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// POST handler to create or update user profile/preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body; // type: "profile" or "preferences"

    if (!data.user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      await upsertUserPreferences(data);
      return NextResponse.json({ success: true });
    } else {
      await upsertUserProfile(data);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by orchids-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, upsertUserProfile, getUserPreferences, upsertUserPreferences } from "@/lib/db/queries";

// GET handler to fetch user profile or preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "profile"; // "profile" or "preferences"

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      const preferences = await getUserPreferences(userId);
      return NextResponse.json({ preferences });
    } else {
      const profile = await getUserProfile(userId);
      return NextResponse.json({ profile });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// POST handler to create or update user profile/preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body; // type: "profile" or "preferences"

    if (!data.user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      await upsertUserPreferences(data);
      return NextResponse.json({ success: true });
    } else {
      await upsertUserProfile(data);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by orchids-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, upsertUserProfile, getUserPreferences, upsertUserPreferences } from "@/lib/db/queries";

// GET handler to fetch user profile or preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "profile"; // "profile" or "preferences"

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      const preferences = await getUserPreferences(userId);
      return NextResponse.json({ preferences });
    } else {
      const profile = await getUserProfile(userId);
      return NextResponse.json({ profile });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// POST handler to create or update user profile/preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body; // type: "profile" or "preferences"

    if (!data.user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      await upsertUserPreferences(data);
      return NextResponse.json({ success: true });
    } else {
      await upsertUserProfile(data);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by orchids-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, upsertUserProfile, getUserPreferences, upsertUserPreferences } from "@/lib/db/queries";

// GET handler to fetch user profile or preferences
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      const preferences = await getUserPreferences(userId);
      return NextResponse.json({ preferences });
    } else {
      const profile = await getUserProfile(userId);
      return NextResponse.json({ profile });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// POST handler to create or update user profile/preferences
    if (!data.user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    if (type === "preferences") {
      await upsertUserPreferences(data);
      return NextResponse.json({ success: true });
    } else {
      await upsertUserProfile(data);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}