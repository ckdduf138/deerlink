import { prisma } from "@/lib/prisma";
import { DISCOVER_CACHE_TAG } from "@/lib/discover-rooms";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.room.delete({ where: { id } });
  revalidateTag(DISCOVER_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ ok: true });
}
