import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { ResultsClient } from "./results-client";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  if (!room) notFound();

  // 참여자만 결과 열람 가능
  const cookieStore = await cookies();
  const participantId = cookieStore.get(`participant_${id}`)?.value;
  const isParticipant = room.participants.some((p) => p.id === participantId);

  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-6 px-4">
        <AntlerLogo className="w-10 h-12 text-stone-300" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-stone-800 mb-2">
            참여 후 결과를 볼 수 있어요
          </h1>
          <p className="text-sm text-stone-500">
            질문에 답변하면 모두의 결과를 확인할 수 있어요
          </p>
        </div>
        <Link
          href={`/room/${id}`}
          className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          답변하러 가기
        </Link>
      </div>
    );
  }

  if (new Date(room.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-6 px-4">
        <AntlerLogo className="w-10 h-12 text-stone-300" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-stone-800 mb-2">
            방이 만료됐어요
          </h1>
          <p className="text-sm text-stone-500">
            24시간이 지나 더 이상 접근할 수 없어요
          </p>
        </div>
        <Link
          href="/create"
          className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          새 방 만들기
        </Link>
      </div>
    );
  }

  const serializedRoom = {
    id: room.id,
    title: room.title,
    expiresAt: room.expiresAt.toISOString(),
    questions: room.questions.map((q) => ({
      id: q.id,
      type: q.type as "balance" | "multiple" | "subjective",
      title: q.title,
      optionA: q.optionA,
      optionB: q.optionB,
      options: q.options,
      order: q.order,
    })),
    participants: room.participants.map((p) => ({
      id: p.id,
      nickname: p.nickname,
      answers: p.answers.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        value: a.value,
      })),
    })),
  };

  return <ResultsClient room={serializedRoom} />;
}
