import { prisma } from "@/lib/prisma";
import { AdminClient } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rooms = await prisma.room.findMany({
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: {
        include: { answers: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = rooms.map((room) => ({
    id: room.id,
    title: room.title,
    createdAt: room.createdAt.toISOString(),
    expiresAt: room.expiresAt.toISOString(),
    questions: room.questions.map((q) => ({
      id: q.id,
      type: q.type,
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
  }));

  return <AdminClient initialRooms={serialized} />;
}
