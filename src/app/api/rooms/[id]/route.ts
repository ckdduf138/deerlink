import { prisma } from "@/lib/prisma";
import { hasCompletedAnswers, participantCookieName } from "@/lib/participant-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  }

  if (new Date(room.expiresAt) < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  const { participants, ...roomWithoutParticipants } = room;

  const participantId = request.cookies.get(participantCookieName(id))?.value;
  const viewer = participants.find((p) => p.id === participantId);

  if (!hasCompletedAnswers(viewer, room.questions.length)) {
    // participant.id 는 곧 결과 열람 자격이다 — 잠긴 응답에 실으면 쿠키로 위조할 수 있다
    return NextResponse.json({
      ...roomWithoutParticipants,
      locked: true,
      participantCount: participants.length,
      participants: participants.map((p) => ({ nickname: p.nickname })),
    });
  }

  return NextResponse.json({
    ...roomWithoutParticipants,
    locked: false,
    participantCount: participants.length,
    participants,
  });
}
