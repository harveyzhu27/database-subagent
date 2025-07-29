import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, description, status } = body;

    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by database-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, description, status } = body;

    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by database-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, description, status } = body;

    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by database-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, title, description, status } = body;

    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by database-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by database-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}

// ⬇️ Added by database-agent
import { NextRequest, NextResponse } from "next/server";
import { getUserFeatureItems, createFeatureItem, updateFeatureItem } from "@/lib/db/queries";

// GET handler to fetch feature items
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const items = await getUserFeatureItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature items" },
      { status: 500 }
    );
  }
}

// POST handler to create feature item
    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createFeatureItem({
      user_id,
      title,
      description,
      status: status || "active",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create feature item" },
      { status: 500 }
    );
  }
}

// PUT handler to update feature item
    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await updateFeatureItem(id, {
      title,
      description,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update feature item" },
      { status: 500 }
    );
  }
}