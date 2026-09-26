import type { Metadata } from "next";
import { getPublicRooms } from "@/lib/discover-rooms";
import { countArchivedRooms } from "@/lib/room-archive";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";
import { DiscoverClient } from "./discover-client";

const description = "지금 참여할 수 있는 밸런스 게임 공개방을 둘러보세요. 원하는 질문을 골라 답하면 다른 사람들의 선택과 결과를 볼 수 있어요.";

export const metadata: Metadata = {
  title: "밸런스 게임 하기 - 공개방 둘러보기",
  description,
  alternates: { canonical: "/discover" },
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: "밸런스 게임 하기 - 공개방 둘러보기 | 디어링크",
    description,
    url: "/discover",
  },
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const result = await getPublicRooms({ page: 1, sort: "recent" })
    .then((data) => ({ ...data, initialError: null }))
    .catch(() => ({
      rooms: [],
      total: 0,
      hasMore: false,
      initialError: "공개방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    }));

  // 보존된 방이 하나도 없을 땐 링크를 걸지 않는다. 빈 페이지로 보내는 링크는 없느니만 못하다.
  const archivedCount = await countArchivedRooms().catch(() => 0);

  return (
    <DiscoverClient
      initialRooms={result.rooms}
      initialTotal={result.total}
      initialHasMore={result.hasMore}
      initialError={result.initialError}
      archivedCount={archivedCount}
    />
  );
}
