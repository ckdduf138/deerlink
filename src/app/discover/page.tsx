import type { Metadata } from "next";
import { getPublicRooms } from "@/lib/discover-rooms";
import { DiscoverClient } from "./discover-client";

export const metadata: Metadata = {
  title: "공개방 둘러보기 - Deerlink",
  description: "Deerlink에서 공개로 만들어진 방을 둘러보고 참여해보세요.",
};

export default async function DiscoverPage() {
  const { rooms, total, hasMore } = await getPublicRooms({ page: 1, sort: "recent" });

  return (
    <DiscoverClient initialRooms={rooms} initialTotal={total} initialHasMore={hasMore} />
  );
}
