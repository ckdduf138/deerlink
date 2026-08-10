"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, ListChecks, Loader2, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRemaining } from "@/lib/format";
import type { DiscoverRoom } from "@/lib/types";
import type { DiscoverSort } from "@/lib/discover-rooms";

/**
 * /discover 페이지와 랜딩 페이지가 공유하는 공개방 목록 UI다.
 * 정렬 탭 + 목록 + 더 보기를 통째로 담당한다 — 쿼리는 getPublicRooms 하나만 쓰던 원칙을
 * UI에도 그대로 적용한 것. 페이지 타이틀·네비게이션은 각자의 맥락이 다르므로
 * 이 컴포넌트가 아니라 호출하는 쪽(page.tsx, DiscoverTeaserSection)이 감싼다.
 */
export function PublicRoomsFeed({
  initialRooms,
  initialTotal,
  initialHasMore,
  initialSort = "recent",
}: {
  initialRooms: DiscoverRoom[];
  initialTotal: number;
  initialHasMore: boolean;
  initialSort?: DiscoverSort;
}) {
  const [rooms, setRooms] = useState(initialRooms);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [sort, setSort] = useState<DiscoverSort>(initialSort);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const changeSort = async (next: DiscoverSort) => {
    if (next === sort || loading) return;
    setSort(next);
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/discover?sort=${next}&page=1`);
      const data = await res.json();
      setRooms(data.rooms);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/rooms/discover?sort=${sort}&page=${nextPage}`);
      const data = await res.json();
      setRooms((prev) => [...prev, ...data.rooms]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => changeSort("recent")}
          className={cn(
            "min-h-9 px-3.5 rounded-full text-xs font-medium border transition-colors",
            sort === "recent"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-stone-200 text-stone-600 hover:border-stone-300"
          )}
        >
          최신순
        </button>
        <button
          onClick={() => changeSort("popular")}
          className={cn(
            "min-h-9 flex items-center gap-1 px-3.5 rounded-full text-xs font-medium border transition-colors",
            sort === "popular"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-stone-200 text-stone-600 hover:border-stone-300"
          )}
        >
          <Flame className="w-3 h-3" />
          인기순
        </button>
        <button
          onClick={() => changeSort("answers")}
          className={cn(
            "min-h-9 flex items-center gap-1 px-3.5 rounded-full text-xs font-medium border transition-colors",
            sort === "answers"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-stone-200 text-stone-600 hover:border-stone-300"
          )}
        >
          <MessagesSquare className="w-3 h-3" />
          답변 많은순
        </button>
      </div>

      {rooms.length === 0 && !loading && (
        <div className="py-16 text-center">
          <Users className="mx-auto mb-5 w-10 h-10 text-stone-300" />
          <p className="text-stone-600 text-sm">아직 공개된 방이 없어요</p>
          <p className="text-stone-600 text-xs mt-1">방을 만들 때 공개로 설정하면 여기 나타나요</p>
        </div>
      )}

      {rooms.length > 0 && (
        <>
          <p className="mb-3 text-[11px] text-stone-500 font-mono tabular-nums">{total}개 방</p>
          <div className="space-y-3">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (i % 12) * 0.03 }}
              >
                <Link
                  href={`/room/${room.id}?join=1`}
                  className="block rounded-2xl border border-amber-100 bg-white p-5 transition-colors hover:border-amber-300 hover:bg-amber-50/30"
                >
                  <p className="text-base font-bold text-stone-900 mb-2 leading-snug line-clamp-2">
                    {room.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      <ListChecks className="w-3 h-3" />
                      질문 {room.questionCount}개
                    </span>
                    <span className="w-px h-3 bg-stone-300" />
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {room.participantCount}명 참여
                    </span>
                    <span className="w-px h-3 bg-stone-300" />
                    <span className="font-mono tabular-nums text-stone-500">
                      {formatRemaining(room.expiresAt)} 남음
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-6 flex items-center justify-center gap-2 w-full min-h-11 rounded-xl border border-dashed border-stone-300 hover:border-amber-400 text-sm text-stone-600 hover:text-amber-700 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "더 보기"}
        </button>
      )}
    </div>
  );
}
