"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowRight, Flame, ListChecks, Loader2, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRemaining } from "@/lib/format";
import type { DiscoverPreviewQuestion, DiscoverRoom } from "@/lib/types";
import type { DiscoverSort } from "@/lib/discover-rooms";
import { QUESTION_META } from "@/lib/question-meta";
import { BalanceRatioBar } from "@/components/ResultBar";

/**
 * /discover 페이지와 히어로 공개방 탭이 공유하는 목록 UI다.
 * 정렬, 오류 복구, 카드 액션을 한곳에서 관리해 두 화면이 같은 동작을 유지한다.
 */
export function PublicRoomsFeed({
  initialRooms,
  initialTotal,
  initialHasMore,
  initialSort = "recent",
  mode = "full",
  initialError = null,
}: {
  initialRooms: DiscoverRoom[];
  initialTotal: number;
  initialHasMore: boolean;
  initialSort?: DiscoverSort;
  mode?: "full" | "hero" | "landing";
  initialError?: string | null;
}) {
  const [rooms, setRooms] = useState(initialRooms);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [sort, setSort] = useState<DiscoverSort>(initialSort);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [failedAction, setFailedAction] = useState<
    { kind: "sort"; sort: DiscoverSort } | { kind: "more" } | null
  >(initialError ? { kind: "sort", sort: initialSort } : null);
  const reduceMotion = useReducedMotion();
  const pageSizeQuery = mode === "hero" || mode === "landing" ? "&pageSize=2" : "";

  const requestRooms = async (url: string) => {
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json().catch(() => null)) as {
      rooms?: DiscoverRoom[];
      total?: number;
      hasMore?: boolean;
    } | null;
    if (
      !res.ok ||
      !data ||
      !Array.isArray(data.rooms) ||
      typeof data.total !== "number" ||
      typeof data.hasMore !== "boolean"
    ) {
      throw new Error("discover request failed");
    }
    return { rooms: data.rooms, total: data.total, hasMore: data.hasMore };
  };

  const changeSort = async (next: DiscoverSort, force = false) => {
    if ((!force && next === sort) || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await requestRooms(
        `/api/rooms/discover?sort=${next}&page=1${pageSizeQuery}`
      );
      setRooms(data.rooms);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(1);
      setSort(next);
      setFailedAction(null);
    } catch {
      setError("공개방을 불러오지 못했어요. 기존 목록은 그대로 유지했어요.");
      setFailedAction({ kind: "sort", sort: next });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const data = await requestRooms(
        `/api/rooms/discover?sort=${sort}&page=${nextPage}${pageSizeQuery}`
      );
      setRooms((prev) => [...prev, ...data.rooms]);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(nextPage);
      setFailedAction(null);
    } catch {
      setError("다음 공개방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      setFailedAction({ kind: "more" });
    } finally {
      setLoading(false);
    }
  };

  const retryFailedAction = () => {
    if (failedAction?.kind === "sort") {
      void changeSort(failedAction.sort, true);
    } else if (failedAction?.kind === "more") {
      void loadMore();
    }
  };

  const visibleRooms = mode === "hero" || mode === "landing" ? rooms.slice(0, 2) : rooms;

  return (
    <div aria-busy={loading}>
      {mode !== "landing" && <div
        className={cn("mb-6 flex flex-wrap items-center gap-2", mode === "hero" && "mb-4")}
        role="group"
        aria-label="공개방 정렬"
      >
        <button
          onClick={() => changeSort("recent")}
          disabled={loading}
          aria-pressed={sort === "recent"}
          className={cn(
            "min-h-11 px-3.5 rounded-full text-xs font-medium border transition-colors disabled:cursor-wait disabled:opacity-60",
            sort === "recent"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-stone-200 text-stone-600 hover:border-stone-300"
          )}
        >
          최신순
        </button>
        <button
          onClick={() => changeSort("popular")}
          disabled={loading}
          aria-pressed={sort === "popular"}
          className={cn(
            "min-h-11 flex items-center gap-1 px-3.5 rounded-full text-xs font-medium border transition-colors disabled:cursor-wait disabled:opacity-60",
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
          disabled={loading}
          aria-pressed={sort === "answers"}
          className={cn(
            "min-h-11 flex items-center gap-1 px-3.5 rounded-full text-xs font-medium border transition-colors disabled:cursor-wait disabled:opacity-60",
            sort === "answers"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-stone-200 text-stone-600 hover:border-stone-300"
          )}
        >
          <MessagesSquare className="w-3 h-3" />
          답변 많은순
        </button>
      </div>}

      {error && (
        <div
          className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
        >
          <div className="flex min-w-0 items-start gap-2 text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
          <button
            onClick={retryFailedAction}
            disabled={loading}
            className="min-h-11 flex-shrink-0 px-2 text-xs font-semibold text-red-700 underline underline-offset-2 disabled:opacity-60"
          >
            다시 시도
          </button>
        </div>
      )}

      {rooms.length === 0 && !loading && !error && (
        mode === "landing" ? (
          <div className="grid overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-lg shadow-amber-100/60 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="p-7 sm:p-9">
              <Users className="mb-6 h-9 w-9 text-amber-700" aria-hidden="true" />
              <h3 className="text-2xl font-bold tracking-tight text-stone-900">
                첫 공개방을 열어주세요
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-stone-600">
                방을 만들 때 공개로 설정하면 이곳에서 누구나 결과를 보고 익명으로
                답할 수 있어요.
              </p>
            </div>
            <div className="border-t border-amber-100 p-7 md:border-l md:border-t-0 md:p-9">
              <Link
                href="/create"
                className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-700 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-900/20 transition-colors hover:bg-amber-600"
              >
                공개방 만들기
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <div className={cn("text-center", mode === "hero" ? "py-10" : "py-16")}>
            <Users className="mx-auto mb-5 h-10 w-10 text-stone-300" />
            <p className="text-stone-600 text-sm">아직 공개된 방이 없어요</p>
            <p className="text-stone-600 text-xs mt-1">방을 만들 때 공개로 설정하면 여기 나타나요</p>
          </div>
        )
      )}

      {visibleRooms.length > 0 && (
        <>
          {mode === "full" && (
            <p className="mb-3 text-xs text-stone-500 font-mono tabular-nums">{total}개 방</p>
          )}
          <div className={cn(
            "min-w-0 space-y-3",
            mode === "landing" &&
              "grid gap-4 space-y-0 lg:grid-cols-2"
          )}>
            {visibleRooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (i % 12) * 0.04 }}
                className={cn("min-w-0", mode === "landing" && "h-full")}
              >
                <Link
                  href={`/room/${room.id}?join=1`}
                  aria-label={`${room.title} 공개방 참여하기`}
                  className="group block h-full min-w-0 max-w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
                >
                  <article className={cn(
                    "flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-amber-300 group-hover:shadow-lg group-hover:shadow-amber-100/50",
                    mode === "landing" && "min-h-56",
                    mode === "landing" && "rounded-2xl"
                  )}>
                    <div className={cn(
                      "flex min-w-0 flex-1 flex-col",
                      mode === "hero" ? "p-4" : "p-5",
                      mode === "landing" && "p-5 sm:p-6",
                      mode === "landing" && "sm:p-7"
                    )}>
                      <p className={cn(
                        "min-w-0 font-bold leading-snug text-stone-900",
                        mode === "landing" ? "truncate" : "line-clamp-2",
                        mode === "landing" ? "text-xl sm:text-2xl" : "text-base"
                      )}>
                        {room.title}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                        <span className="flex items-center gap-1.5">
                          <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                          {room.questionCount}개
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" />
                          {room.participantCount}명
                        </span>
                        {mode === "full" && (
                          <span className="font-mono tabular-nums text-stone-500">
                            {formatRemaining(room.expiresAt)}
                          </span>
                        )}
                      </div>
                      {(mode === "full" || mode === "landing") && room.previewQuestion && (
                        <QuestionPreview question={room.previewQuestion} />
                      )}
                      <div className={cn(
                        "mt-auto flex min-h-11 items-end justify-between gap-3 pt-6 text-sm font-semibold text-amber-800",
                        mode === "landing" && "pt-8"
                      )}>
                        <span>참여하기</span>
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {mode === "full" && hasMore && (
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

/**
 * 카드 안에서 첫 질문을 미리 보여준다 — "링크 하나로 그룹이 답한다"는 게 실제로
 * 어떤 화면인지 클릭 전에 보여줘서 호기심을 끈다. 밸런스 게임은 답변이 있으면
 * 결과 페이지와 같은 BalanceRatioBar로 실시간 비율까지 보여준다.
 */
function QuestionPreview({ question }: { question: DiscoverPreviewQuestion }) {
  const meta = QUESTION_META[question.type];
  const Icon = meta.icon;
  const total = question.countA + question.countB;

  if (question.type === "balance" && total > 0) {
    return (
      <div className="mt-4 border-t border-stone-100 pt-4">
        <BalanceRatioBar
          a={{ label: question.optionA ?? "A", count: question.countA }}
          b={{ label: question.optionB ?? "B", count: question.countB }}
        />
      </div>
    );
  }

  if (question.type === "balance") {
    return (
      <div className="mt-4 border-t border-stone-100 pt-4">
        <p className="mb-2 line-clamp-2 text-sm leading-snug text-stone-700">{question.title}</p>
        <div className="grid grid-cols-2 gap-2">
          <span className="truncate rounded-lg border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 text-center">
            {question.optionA}
          </span>
          <span className="truncate rounded-lg border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-900 text-center">
            {question.optionB}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-start gap-1.5 border-t border-stone-100 pt-4 text-sm text-stone-700">
      <Icon className={cn("mt-0.5 h-3.5 w-3.5 flex-shrink-0", meta.accent)} />
      <span className="min-w-0 line-clamp-2 leading-snug">{question.title}</span>
    </div>
  );
}
