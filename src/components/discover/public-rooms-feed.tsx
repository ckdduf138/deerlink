"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu } from "@base-ui/react/menu";
import { AlertCircle, ArrowRight, Check, ChevronDown, Flame, History, Hourglass, Loader2, MessagesSquare, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRemainingShort } from "@/lib/format";
import type { DiscoverPreviewQuestion, DiscoverRoom } from "@/lib/types";
import type { DiscoverSort } from "@/lib/discover-rooms";
import { BalanceRatioBar } from "@/components/ResultBar";

/**
 * /discover 페이지와 랜딩 공개방 섹션이 공유하는 목록 UI다.
 * 정렬, 오류 복구, 카드 액션을 한곳에서 관리해 두 화면이 같은 동작을 유지한다.
 */
export function PublicRoomsFeed({
  initialRooms,
  initialTotal,
  initialHasMore,
  initialSort = "recent",
  mode = "full",
  initialError = null,
  pageSize,
}: {
  initialRooms: DiscoverRoom[];
  initialTotal: number;
  initialHasMore: boolean;
  initialSort?: DiscoverSort;
  mode?: "full" | "landing";
  initialError?: string | null;
  /** landing은 한 화면 분량만 보여준다. 정렬을 바꿔도 같은 개수만 다시 받는다. */
  pageSize?: number;
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
  const pageSizeQuery = pageSize ? `&pageSize=${pageSize}` : "";

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

  const visibleRooms = pageSize ? rooms.slice(0, pageSize) : rooms;
  const landing = mode === "landing";
  const sortOptions = landing ? LANDING_SORTS : FULL_SORTS;

  return (
    <div aria-busy={loading}>
      <SortMenu
        options={sortOptions}
        value={sort}
        onChange={changeSort}
        disabled={loading}
        className={landing ? "mb-5" : "mb-6"}
      />

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
          <div className="py-16 text-center">
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
          <div
            className={cn(
              "min-w-0",
              landing
                ? "grid gap-4 transition-opacity duration-200 sm:grid-cols-2"
                : "space-y-3",
              landing && loading && "opacity-60"
            )}
          >
            {visibleRooms.map((room, i) =>
              landing ? (
                <RoomCard
                  key={room.id}
                  room={room}
                  size={i === 0 ? "featured" : "standard"}
                  className={i === 0 ? "sm:row-span-2" : undefined}
                />
              ) : (
                <motion.div
                  key={room.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (i % 12) * 0.04 }}
                  className="min-w-0"
                >
                  <RoomCard room={room} size="compact" />
                </motion.div>
              )
            )}
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

const FULL_SORTS: { value: DiscoverSort; label: string; icon?: LucideIcon }[] = [
  { value: "recent", label: "최신순", icon: History },
  { value: "popular", label: "인기순", icon: Flame },
  { value: "answers", label: "답변 많은순", icon: MessagesSquare },
];

/** 랜딩 섹션 제목이 "인기"라서 기본값인 인기순을 맨 앞에 둔다. */
const LANDING_SORTS = [FULL_SORTS[1], FULL_SORTS[0], FULL_SORTS[2]];

type CardSize = "compact" | "standard" | "featured";

/**
 * `/discover`(compact)와 랜딩(standard·featured)이 쓰던 카드는 원래 서로 다른 컴포넌트였다
 * — 내용 순서(방 제목이 먼저냐 질문이 먼저냐), 유형별 미리보기 유무, 하단 문구가 전부
 * 달라서 같은 방인데 어디서 보느냐에 따라 다른 카드로 읽혔다. 지금은 하나의 컴포넌트가
 * 크기만 다르게 그린다 — 항상 질문 제목이 먼저 오고(방 이름이 아니라 질문이 궁금증을
 * 만든다), 유형별 미리보기가 모든 크기에 있고, 이동 신호는 화살표 아이콘 하나뿐이다
 * ("참여하기"/"답하기" 같은 문구를 따로 달지 않는다 — 카드 전체가 링크고 화살표가
 * 이미 그 뜻이다).
 *
 * compact만 밸런스 게임에 답이 있으면 실시간 비율 막대(BalanceRatioBar)를 보여준다 —
 * `/discover`는 둘러보다 답할 방을 고르는 화면이라 결과를 먼저 봐도 된다. featured·
 * standard(랜딩)는 반드시 두 선택지만 보여준다 — 결과부터 보이면 답할 이유가 없어진다.
 */
function RoomCard({
  room,
  size,
  className,
}: {
  room: DiscoverRoom;
  size: CardSize;
  className?: string;
}) {
  const q = room.previewQuestion;
  const headline = q?.title ?? room.title;

  return (
    <Link
      href={`/room/${room.id}?join=1`}
      aria-label={`${room.title} 공개방 참여하기`}
      className={cn(
        "group block h-full min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600",
        className
      )}
    >
      <article
        className={cn(
          "flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow,transform] duration-200 group-hover:border-amber-300",
          size === "featured"
            ? "gap-5 border-amber-100/80 p-7 shadow-lg shadow-amber-100/60 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-amber-200/70 sm:p-9"
            : size === "standard"
              ? "gap-4 border-amber-100 p-5 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-amber-100/50 sm:p-6"
              : "gap-3 border-amber-100 p-5 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-amber-100/50"
        )}
      >
        <p
          className={cn(
            "break-keep font-bold leading-snug text-stone-900",
            size === "featured"
              ? "line-clamp-3 text-2xl sm:text-3xl"
              : size === "standard"
                ? "line-clamp-2 text-lg sm:text-xl"
                : "line-clamp-2 text-base"
          )}
        >
          {headline}
        </p>

        {q && <TypePreview question={q} size={size} />}

        <div className="mt-auto flex items-end justify-between gap-3">
          <div
            className={cn(
              "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-stone-500",
              size === "compact" ? "text-xs" : "text-sm"
            )}
          >
            {q && <span className="truncate text-stone-600">{room.title}</span>}
            <span className="flex flex-shrink-0 items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">{room.participantCount}</span>
            </span>
            <span className="flex flex-shrink-0 items-center gap-1 font-mono tabular-nums">
              <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
              {formatRemainingShort(room.expiresAt)}
            </span>
          </div>
          <ArrowRight
            className={cn(
              "flex-shrink-0 text-amber-700 transition-transform duration-200 group-hover:translate-x-1",
              size === "compact" ? "h-4 w-4" : "h-5 w-5"
            )}
            aria-hidden="true"
          />
        </div>
      </article>
    </Link>
  );
}

/**
 * 유형별로 미리보기가 다르다 — 세 유형이 전부 카드에 섞여 나오니 하나씩 확인했다.
 * 밸런스: 선택지 두 개를 amber/teal로 대비해서 보여준다(이지선다라 대비가 그대로 정보다).
 * 객관식: 선택지가 여러 개라 대비를 안 쓰고 teal 톤 하나로 통일하고, 3개까지만 보여주고
 * 나머지는 "+N"으로 뭉친다(선택지가 8개인 질문도 있어서 다 펼치면 카드가 깨진다).
 * 주관식: 미리보여줄 선택지가 없다 — 자유 텍스트라 뭘 보여줘도 답을 대신 보여주는 셈이
 * 된다. 제목만으로 충분하다고 보고 이 자리는 비워둔다.
 */
function TypePreview({ question, size }: { question: DiscoverPreviewQuestion; size: CardSize }) {
  if (question.type === "balance" && question.optionA && question.optionB) {
    const total = question.countA + question.countB;

    if (size === "compact" && total > 0) {
      return (
        <BalanceRatioBar
          a={{ label: question.optionA, count: question.countA }}
          b={{ label: question.optionB, count: question.countB }}
        />
      );
    }

    return (
      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center",
          size === "featured" ? "gap-3" : "gap-2"
        )}
      >
        <OptionChip tone="amber" size={size}>
          {question.optionA}
        </OptionChip>
        <span
          className={cn("font-semibold text-stone-400", size === "featured" ? "text-sm" : "text-xs")}
          aria-hidden="true"
        >
          VS
        </span>
        <OptionChip tone="teal" size={size}>
          {question.optionB}
        </OptionChip>
      </div>
    );
  }

  if (question.type === "multiple" && question.options.length > 0) {
    const shown = question.options.slice(0, 3);
    const extra = question.options.length - shown.length;
    return (
      <div className="flex flex-wrap gap-2">
        {shown.map((option) => (
          <span
            key={option}
            className={cn(
              "truncate rounded-lg border border-teal-200 bg-teal-50 font-medium text-teal-900",
              size === "compact" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
            )}
          >
            {option}
          </span>
        ))}
        {extra > 0 && (
          <span
            className={cn(
              "rounded-lg border border-stone-200 bg-stone-50 font-medium text-stone-500",
              size === "compact" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
            )}
          >
            +{extra}
          </span>
        )}
      </div>
    );
  }

  return null;
}

function OptionChip({
  tone,
  size,
  children,
}: {
  tone: "amber" | "teal";
  size: CardSize;
  children: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center justify-center break-keep rounded-xl border text-center font-semibold leading-snug",
        tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-teal-200 bg-teal-50 text-teal-900",
        size === "featured"
          ? "min-h-16 px-4 py-3 text-lg sm:text-xl"
          : size === "standard"
            ? "min-h-12 px-3 py-2 text-base"
            : "min-h-10 px-2.5 py-1.5 text-sm"
      )}
    >
      {children}
    </span>
  );
}

/**
 * 정렬은 항상 하나만 선택돼 있다 — 그럼 화면에 세 개를 다 늘어놓을 필요가 없다.
 * 지금 정렬 하나만 보여주는 버튼을 누르면 나머지 옵션이 뜬다(토스·네이버류 앱이
 * 정렬에 흔히 쓰는 패턴). 칩 3개가 항상 떠 있던 것보다 화면에 남는 텍스트가 훨씬 적다.
 * 테두리 없는 채워진 배경(bg-stone-100)을 쓴다 — 테두리만 있는 흰 배경은 누를 수
 * 있는 요소로 잘 안 읽혀서 존재감이 약했다.
 */
function SortMenu({
  options,
  value,
  onChange,
  disabled,
  className,
}: {
  options: { value: DiscoverSort; label: string; icon?: LucideIcon }[];
  value: DiscoverSort;
  onChange: (next: DiscoverSort) => void;
  disabled: boolean;
  className?: string;
}) {
  const active = options.find((option) => option.value === value) ?? options[0];
  const ActiveIcon = active.icon;

  return (
    <Menu.Root>
      <Menu.Trigger
        disabled={disabled}
        aria-label={`공개방 정렬: ${active.label}`}
        className={cn(
          "flex min-h-11 items-center gap-1.5 rounded-xl bg-stone-100 px-4 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-200 disabled:cursor-wait disabled:opacity-60",
          "data-[popup-open]:bg-amber-50 data-[popup-open]:text-amber-900",
          className
        )}
      >
        {ActiveIcon && <ActiveIcon className="h-3.5 w-3.5" aria-hidden="true" />}
        {active.label}
        <ChevronDown className="h-3.5 w-3.5 text-stone-500" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="start" sideOffset={6}>
          <Menu.Popup className="min-w-40 rounded-2xl border border-amber-100 bg-white p-1.5 shadow-lg shadow-amber-100/60 outline-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 transition-[opacity,transform] duration-150">
            <Menu.RadioGroup value={value} onValueChange={onChange}>
              {options.map(({ value: optionValue, label, icon: Icon }) => (
                <Menu.RadioItem
                  key={optionValue}
                  value={optionValue}
                  closeOnClick
                  className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl px-3 text-sm font-medium text-stone-700 outline-none data-[highlighted]:bg-amber-50 data-[highlighted]:text-amber-900"
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                    {label}
                  </span>
                  <Menu.RadioItemIndicator>
                    <Check className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
