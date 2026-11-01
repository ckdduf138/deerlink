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

/**
 * 공개 노출에서 내리거나 다시 올린다. 방을 지우지는 않는다 - 링크를 받은 사람은
 * 그대로 쓸 수 있고, 랜딩·/discover·/archive·사이트맵에서만 빠진다.
 *
 * 이 경로는 미들웨어가 지키는 /api/admin/* 안이라 세션이 없으면 여기까지 오지 않는다.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body: unknown = await request.json().catch(() => null);
  const hidden = (body as { hidden?: unknown } | null)?.hidden;
  if (typeof hidden !== "boolean") {
    return NextResponse.json({ error: "hidden 값이 필요해요" }, { status: 400 });
  }

  const room = await prisma.room
    .update({
      where: { id },
      data: { hiddenAt: hidden ? new Date() : null },
      select: { hiddenAt: true },
    })
    .catch(() => null);

  if (!room) return NextResponse.json({ error: "방을 찾을 수 없어요" }, { status: 404 });

  revalidateTag(DISCOVER_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ hiddenAt: room.hiddenAt?.toISOString() ?? null });
}
