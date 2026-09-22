import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

/**
 * 1위(featured) + 2개. 모바일은 세로로 쌓고, sm 이상은 1위 카드가 왼쪽에서 두 칸을
 * 세로로 차지하는 벤토(1 큰 셀 + 2)다 — CLAUDE.md 랜딩 규칙의 벤토 계열과 같은 비율.
 */
export const LANDING_ROOM_COUNT = 3;

/**
 * 히어로 바로 아래, 첫 화면에 걸치는 섹션이라 등장 애니메이션을 걸지 않는다.
 * initial opacity 0이면 서버 HTML에 투명하게 박혀서 JS가 돌기 전까지 안 보인다.
 */
export function PublicRoomsSection({
  rooms,
  total,
  hasMore,
  error,
}: {
  rooms: DiscoverRoom[];
  total: number;
  hasMore: boolean;
  error: string | null;
}) {
  return (
    <section
      aria-labelledby="public-rooms-title"
      className="border-t border-amber-100 bg-white px-6 pb-20 pt-16 md:pb-24 md:pt-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2
            id="public-rooms-title"
            className="text-2xl font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl"
          >
            인기 밸런스 게임
          </h2>

          {total > 0 && (
            <Link
              href="/discover"
              className="group inline-flex min-h-11 flex-shrink-0 items-center gap-1 text-sm font-semibold text-amber-800 transition-colors hover:text-amber-600 sm:text-base"
            >
              전체 보기
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
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
        />
      </div>
    </section>
  );
}
