import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!redis) return NextResponse.json({ average: 0, count: 0 });

  const data = await redis.hgetall<{ count: number; sum: number }>(`ratings:${slug}`);
  const count = Number(data?.count || 0);
  const sum = Number(data?.sum || 0);
  return NextResponse.json({ average: count ? sum / count : 0, count });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!redis) {
    return NextResponse.json(
      { error: "Les notes ne sont pas encore activées sur ce site." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Note invalide." }, { status: 400 });
  }

  await redis.hincrby(`ratings:${slug}`, "count", 1);
  await redis.hincrby(`ratings:${slug}`, "sum", rating);
  const data = await redis.hgetall<{ count: number; sum: number }>(`ratings:${slug}`);
  const count = Number(data!.count);
  const sum = Number(data!.sum);
  return NextResponse.json({ average: sum / count, count });
}