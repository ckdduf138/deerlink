import { ImageResponse } from "next/og";
import { type NextRequest, NextResponse } from "next/server";
import { ShareImage } from "@/components/results/share-image";
import { canViewResults, participantCookieName } from "@/lib/participant-session";
import { prisma } from "@/lib/prisma";
import { serializeResultsRoom } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: {
        include: { answers: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없어요." }, { status: 404 });
  }
  if (room.expiresAt < new Date()) {
    return NextResponse.json({ error: "만료된 방이에요." }, { status: 410 });
  }

  const participantId = request.cookies.get(participantCookieName(id))?.value;
  const viewer = room.participants.find((participant) => participant.id === participantId);
  if (
    !canViewResults({
      isPublic: room.isPublic,
      participant: viewer,
      totalQuestions: room.questions.length,
    })
  ) {
    return NextResponse.json(
      { error: "모든 질문에 답한 뒤 결과 이미지를 볼 수 있어요." },
      { status: 403 }
    );
  }

  return new ImageResponse(ShareImage({ room: serializeResultsRoom(room) }), {
    width: 1080,
    height: 1080,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `inline; filename="deerlink-${id}.png"`,
    },
  });
}
