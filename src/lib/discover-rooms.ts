import { prisma } from "./prisma";
import { serializeDiscoverRoom } from "./serialize";
import type { DiscoverRoom } from "./types";

/**
 * /discover 페이지와 API 라우트, 랜딩 티저 섹션이 전부 이 함수 하나만 쓴다 —
 * 목록 쿼리를 각자 다시 짜면 화면마다 다른 방이 보일 수 있다.
 */

export const DISCOVER_PAGE_SIZE = 12;

/** popular = 참여자 수, answers = 참여자 수 × 질문 수 (답변 화면은 전 문항을 다 채워야 제출되니 이걸로 충분하다) */
export type DiscoverSort = "recent" | "popular" | "answers";

export async function getPublicRooms({
  page = 1,
  sort = "recent",
  pageSize = DISCOVER_PAGE_SIZE,
}: {
  page?: number;
  sort?: DiscoverSort;
  pageSize?: number;
} = {}): Promise<{ rooms: DiscoverRoom[]; total: number; hasMore: boolean }> {
  const where = { isPublic: true, expiresAt: { gt: new Date() } };

  // "답변 많은순"은 참여자 수 × 질문 수의 곱이라 DB의 orderBy 한 번으로 못 낸다.
  // 공개방 규모가 아직 작으니(운영 트래픽이 실제로 커지기 전까지는) 전부 불러와 JS에서
  // 정렬하는 쪽이 raw SQL을 새로 짜는 것보다 단순하다 — admin 목록도 이미 이렇게 한다.
  const previewSelect = {
    orderBy: { order: "asc" as const },
    take: 1,
    select: {
      type: true,
      title: true,
      optionA: true,
      optionB: true,
      options: true,
      order: true,
      id: true,
      answers: { select: { value: true } },
    },
  };

  if (sort === "answers") {
    const all = await prisma.room.findMany({
      where,
      select: {
        id: true,
        title: true,
        createdAt: true,
        expiresAt: true,
        _count: { select: { questions: true, participants: true } },
        questions: previewSelect,
      },
    });
    const sorted = all.sort(
      (a, b) =>
        b._count.participants * b._count.questions - a._count.participants * a._count.questions
    );
    const total = sorted.length;
    const rooms = sorted.slice((page - 1) * pageSize, page * pageSize);
    return {
      rooms: rooms.map(serializeDiscoverRoom),
      total,
      hasMore: page * pageSize < total,
    };
  }

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      select: {
        id: true,
        title: true,
        createdAt: true,
        expiresAt: true,
        _count: { select: { questions: true, participants: true } },
        questions: previewSelect,
      },
      orderBy:
        sort === "popular"
          ? { participants: { _count: "desc" } }
          : { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.room.count({ where }),
  ]);

  return {
    rooms: rooms.map(serializeDiscoverRoom),
    total,
    hasMore: page * pageSize < total,
  };
}
