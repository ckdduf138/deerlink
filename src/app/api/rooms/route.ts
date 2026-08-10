import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

// 클라이언트 입력 제한(create-editor.tsx, question-card.tsx)과 값을 맞춘다 —
// 서버가 이보다 느슨하면 UI가 약속한 상한이 그냥 장식이 된다.
const TITLE_MAX = 50;
const QUESTION_TITLE_MAX = 80;
const OPTION_MAX = 30;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 5;
const MAX_QUESTIONS = 20;
const QUESTION_TYPES = ["balance", "multiple", "subjective"] as const;

interface QuestionInput {
  type: (typeof QUESTION_TYPES)[number];
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

function validQuestion(q: unknown): q is QuestionInput {
  if (typeof q !== "object" || q === null) return false;
  const { type, title, optionA, optionB, options } = q as Record<string, unknown>;

  if (typeof type !== "string" || !QUESTION_TYPES.includes(type as never)) return false;
  if (typeof title !== "string" || !title.trim() || title.length > QUESTION_TITLE_MAX) return false;

  if (type === "balance") {
    if (typeof optionA !== "string" || !optionA.trim() || optionA.length > OPTION_MAX) return false;
    if (typeof optionB !== "string" || !optionB.trim() || optionB.length > OPTION_MAX) return false;
  }

  if (type === "multiple") {
    if (!Array.isArray(options)) return false;
    if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) return false;
    if (!options.every((o) => typeof o === "string" && o.trim() && o.length <= OPTION_MAX)) return false;
  }

  return true;
}

export async function POST(request: Request) {
  const limit = checkRateLimit(`rooms:${clientKey(request)}`, 5, 10 * 60 * 1000);
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

  const { title, questions, isPublic } = body as {
    title: unknown;
    questions: unknown;
    isPublic?: unknown;
  };

  if (typeof title !== "string" || !title.trim() || title.length > TITLE_MAX) {
    return NextResponse.json({ error: "제목을 확인해주세요" }, { status: 400 });
  }
  if (!Array.isArray(questions) || questions.length < 1 || questions.length > MAX_QUESTIONS) {
    return NextResponse.json({ error: "질문 개수를 확인해주세요" }, { status: 400 });
  }
  if (!questions.every(validQuestion)) {
    return NextResponse.json({ error: "질문 내용을 확인해주세요" }, { status: 400 });
  }
  if (isPublic !== undefined && typeof isPublic !== "boolean") {
    return NextResponse.json({ error: "공개 설정을 확인해주세요" }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const room = await prisma.room.create({
    data: {
      title: title.trim(),
      isPublic: isPublic === true,
      expiresAt,
      questions: {
        create: (questions as QuestionInput[]).map((q, i) => ({
          type: q.type,
          title: q.title.trim(),
          optionA: q.optionA?.trim(),
          optionB: q.optionB?.trim(),
          options: q.options ? JSON.stringify(q.options.map((o) => o.trim())) : null,
          order: i,
        })),
      },
    },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(room);
}
