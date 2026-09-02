import { prisma } from "@/lib/prisma";
import { DISCOVER_CACHE_TAG } from "@/lib/discover-rooms";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.room.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  if (result.count > 0) revalidateTag(DISCOVER_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ deleted: result.count });
}
