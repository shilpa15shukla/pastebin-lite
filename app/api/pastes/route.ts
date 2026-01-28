import { NextResponse } from "next/server";
import redis from "../../lib/redis";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return NextResponse.json({ error: "ttl_seconds invalid" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return NextResponse.json({ error: "max_views invalid" }, { status: 400 });
  }

  const id = nanoid(8);
  const now = Date.now();
  const expires_at =
    ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null;

  await redis.hset(`paste:${id}`, {
    content,
    created_at: now,
    expires_at: expires_at ?? "",
    max_views: max_views ?? "",
    view_count: 0,
  });

  return NextResponse.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
