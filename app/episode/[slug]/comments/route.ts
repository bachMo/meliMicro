import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

type Comment = { id: string; name: string; text: string; createdAt: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!redis) return NextResponse.json({ comments: [] });

  const raw = await redis.lrange<Comment>(`comments:${slug}`, 0, -1);
  const comments = raw.slice().reverse();
  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!redis) {
    return NextResponse.json(
      { error: "Les commentaires ne sont pas encore activés sur ce site." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const name = (body?.name || "").toString().trim().slice(0, 40) || "Anonyme";
  const text = (body?.text || "").toString().trim().slice(0, 500);
  if (!text) {
    return NextResponse.json({ error: "Le commentaire est vide." }, { status: 400 });
  }

  const comment: Comment = {
    id: crypto.randomUUID(),
    name,
    text,
    createdAt: new Date().toISOString(),
  };
  await redis.rpush(`comments:${slug}`, comment);
  return NextResponse.json({ comment });
}