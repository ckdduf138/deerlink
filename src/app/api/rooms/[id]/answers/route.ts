import { prisma } from "@/lib/prisma";
import {
  PARTICIPANT_COOKIE_MAX_AGE,
  participantCookieName,
} from "@/lib/participant-session";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

// 클라이언트 입력 제한(lobby.tsx, answer-mode.tsx)과 값을 맞춘다
const NICKNAME_MAX = 20;
const VALUE_MAX = 500;

interface AnswerInput {
  questionId: string;
  value: string;
}

function validAnswers(answers: unknown): answers is AnswerInput[] {
  if (!Array.isArray(answers) || answers.length === 0) return false;
  return answers.every(
    (a) =>
      typeof a === "object" &&
      a !== null &&
      typeof (a as Record<string, unknown>).questionId === "string" &&
      typeof (a as Record<string, unknown>).value === "string" &&
      (a as { value: string }).value.length <= VALUE_MAX
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: roomId } = await params;

  // 방을 공유받은 사람 여럿이 같은 와이파이 뒤에서 동시에 답할 수 있으니
  // IP당 상한은 넉넉하게 — 방 생성보다 훨씬 자주 일어나는 정상 행동이다.
  const limit = checkRateLimit(`answers:${clientKey(request)}`, 30, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "너무 많이 시도했어요. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const { nickname, answers } = body as { nickname: unknown; answers: unknown };

  if (!validAnswers(answers)) {
    return NextResponse.json({ error: "답변 형식을 확인해주세요" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { questions: { select: { id: true } } },
  });

  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  }
  if (new Date(room.expiresAt) < new Date()) {
    return NextResponse.json({ error: "만료된 방이에요" }, { status: 410 });
  }

  // 공개방은 닉네임 없이 익명으로 참여한다 — 서버가 "참여자 N"을 붙인다.
  // 비공개방은 지금까지와 동일하게 닉네임을 요구한다.
  if (!room.isPublic) {
    if (typeof nickname !== "string" || !nickname.trim() || nickname.length > NICKNAME_MAX) {
      return NextResponse.json({ error: "닉네임을 확인해주세요" }, { status: 400 });
    }
  }

  // 다른 방의 questionId가 섞여 들어오면 여기서 걸러진다
  const validQuestionIds = new Set(room.questions.map((q) => q.id));
  if (!answers.every((a) => validQuestionIds.has(a.questionId))) {
    return NextResponse.json({ error: "질문 정보가 올바르지 않습니다" }, { status: 400 });
  }

  // 같은 questionId가 두 번 오면 Prisma unique 제약(questionId, participantId)이
  // createMany 안에서도 깨진다 — 마지막 값만 남기고 정리한다
  const deduped = [...new Map(answers.map((a) => [a.questionId, a])).values()];

  const participant = await prisma.$transaction(async (tx) => {
    const resolvedNickname = room.isPublic
      ? `참여자 ${(await tx.participant.count({ where: { roomId } })) + 1}`
      : (nickname as string).trim();

    const p = await tx.participant.create({
      data: { roomId, nickname: resolvedNickname },
    });

    await tx.answer.createMany({
      data: deduped.map((a) => ({
        questionId: a.questionId,
        participantId: p.id,
        value: a.value,
      })),
    });

    return p;
  });

  // 참여자 신원은 서버가 httpOnly 쿠키로 발급한다 — 클라이언트가 스스로 심을 수 없어야 한다
  const response = NextResponse.json(participant);
  response.cookies.set(participantCookieName(roomId), participant.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PARTICIPANT_COOKIE_MAX_AGE,
  });
  return response;
}
