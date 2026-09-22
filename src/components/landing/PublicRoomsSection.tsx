import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

/** 데스크톱 3열 두 줄 분량. 히어로가 가져간 1위 방은 목록에서 뺀다 (`excludeId`). */
export const LANDING_ROOM_COUNT = 6;

/**
 * 회색 바탕 위 흰 카드 그리드. 히어로(흰 바탕)와 바탕색으로 섹션이 갈린다.
 * 첫 화면에 걸치는 섹션이라 등장 애니메이션을 걸지 않는다.
 */
export function PublicRoomsSection({
  rooms,
  total,
  hasMore,
  error,
  excludeId,
}: {
  rooms: DiscoverRoom[];
  total: number;
  hasMore: boolean;
  error: string | null;
  excludeId: string | null;
}) {
  return (
    <section aria-labelledby="public-rooms-title" className="bg-page px-5 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="public-rooms-title"
            className="text-[26px] font-cute leading-tight text-stone-900 sm:text-4xl"
          >
            지금 뜨는 밸런스 게임
          </h2>

          {total > 0 && (
            <Link
              href="/discover"
              className="pressable -mr-2 inline-flex min-h-11 flex-shrink-0 items-center rounded-xl px-2 text-[15px] font-semibold text-stone-600 hover:text-stone-900"
            >
              전체 보기
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <PublicRoomsFeed
          initialRooms={rooms}
          initialTotal={total}
          initialHasMore={hasMore}
          initialSort="popular"
          initialError={error}
          mode="landing"
          pageSize={LANDING_ROOM_COUNT}
          excludeId={excludeId}
        />
      </div>
    </section>
  );
}
