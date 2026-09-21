import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

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
      className="bg-[#fafaf8] px-6 pb-20 md:pb-24"
    >
      <div className="mx-auto max-w-6xl border-t border-amber-100 pt-8">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="public-rooms-title"
            className="text-2xl font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl"
          >
            지금 답이 모이는 질문
          </h2>
          <Link
            href="/discover"
            className="group inline-flex min-h-11 flex-shrink-0 items-center gap-1.5 text-base font-semibold text-amber-800 transition-colors hover:text-amber-600"
          >
            전체 보기
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
        <p className="mt-1 break-keep text-base text-stone-600">
          공개방은 누구나 익명으로 답하고 결과를 볼 수 있어요.
        </p>

        <div className="pt-6">
          <PublicRoomsFeed
            initialRooms={rooms}
            initialTotal={total}
            initialHasMore={hasMore}
            initialSort="popular"
            initialError={error}
            mode="landing"
          />
        </div>
      </div>
    </section>
  );
}
