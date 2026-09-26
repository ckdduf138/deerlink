"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu } from "@base-ui/react/menu";
import { AlertCircle, Check, ChevronDown, ChevronRight, Flame, History, Hourglass, Loader2, MessagesSquare, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRemainingShort } from "@/lib/format";
import type { DiscoverPreviewQuestion, DiscoverRoom } from "@/lib/types";
import type { DiscoverSort } from "@/lib/discover-rooms";
import { BalanceRatioBar } from "@/components/ResultBar";
import { Fawn } from "@/components/Fawn";

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
  excludeId = null,
}: {
  initialRooms: DiscoverRoom[];
  initialTotal: number;
  initialHasMore: boolean;
  initialSort?: DiscoverSort;
  mode?: "full" | "landing";
  initialError?: string | null;
  /** landing은 한 화면 분량만 보여준다. 정렬을 바꿔도 같은 개수만 다시 받는다. */
  pageSize?: number;
  /** 랜딩 히어로가 이미 보여준 방. 목록에서 빼고, 그 자리를 채우려고 하나 더 받는다. */
  excludeId?: string | null;
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
  const fetchSize = pageSize && excludeId ? pageSize + 1 : pageSize;
  const pageSizeQuery = fetchSize ? `&pageSize=${fetchSize}` : "";

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

  const listed = excludeId ? rooms.filter((room) => room.id !== excludeId) : rooms;
  const visibleRooms = pageSize ? listed.slice(0, pageSize) : listed;
  const landing = mode === "landing";
  const sortOptions = landing ? LANDING_SORTS : FULL_SORTS;

  return (
    <div aria-busy={loading}>
      <div data-nosnippet>
        <SortMenu
          options={sortOptions}
          value={sort}
          onChange={changeSort}
          disabled={loading}
          className="mb-5"
        />
      </div>

      {error && (
        <div
          className="mb-5 flex items-center justify-between gap-4 rounded-2xl bg-red-50 px-4 py-3"
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

      {visibleRooms.length === 0 && !loading && !error && (
        <div className="surface flex flex-col items-start gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <Fawn mood="curious" className="h-20 w-20 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-cute text-stone-900 sm:text-2xl">
              {landing ? "첫 공개방을 열어주세요" : "아직 공개된 방이 없어요"}
            </h3>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-stone-600">
              방을 만들 때 공개로 설정하면 여기서 누구나 익명으로 답할 수 있어요.
            </p>
          </div>
          <Link href="/create" className="btn-primary flex-shrink-0">
            공개방 만들기
          </Link>
        </div>
      )}

      {visibleRooms.length > 0 && (
        <>
          {mode === "full" && (
            <p className="mb-3 text-sm tabular-nums text-stone-600"><span data-nosnippet>{total}개 방</span></p>
          )}
          <div
            className={cn(
              "grid min-w-0 gap-3 transition-opacity duration-200 sm:gap-4",
              landing ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
              loading && "opacity-60"
            )}
          >
            {visibleRooms.map((room, i) =>
              landing ? (
                <RoomCard key={room.id} room={room} size="list" />
              ) : (
                <motion.div
                  key={room.id}
                  initial={reduceMotion ? false : { opacity: 0, transform: "translateY(8px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  transition={{ duration: 0.28, delay: (i % 12) * 0.04, ease: [0.23, 1, 0.32, 1] }}
                  className="min-w-0"
                >
                  <RoomCard room={room} size="compact" className="h-full" />
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
          className="btn-secondary mt-6 w-full bg-white hover:bg-stone-50"
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

type CardSize = "compact" | "list";

/**
 * `/discover`(compact)와 랜딩(list)이 쓰던 카드는 원래 서로 다른 컴포넌트였다 — 내용
 * 순서(방 제목이 먼저냐 질문이 먼저냐), 유형별 미리보기 유무, 하단 문구가 전부 달라서
 * 같은 방인데 어디서 보느냐에 따라 다른 카드로 읽혔다. 지금은 하나의 컴포넌트가 크기만
 * 다르게 그린다 — 항상 질문 제목이 먼저 오고(방 이름이 아니라 질문이 궁금증을 만든다),
 * 유형별 미리보기가 모든 크기에 있고, 이동 신호는 화살표 아이콘 하나뿐이다.
 *
 * 랜딩(`list`)은 2026-09에 1위를 크게 띄우는 벤토(1+2)에서 세 항목이 같은 크기인
 * 리스트로 바꿨다 — 벤토는 "왜 이게 1등인지" 라벨 없이 카드 크기로만 순위를 말했는데
 * 실제로 보면 카드 세 개 크기가 제각각이라 산만했다. 리스트는 카드 박스(테두리·그림자)
 * 없이 구분선(부모의 `divide-y`)만으로 항목을 나눈다.
 *
 * compact만 밸런스 게임에 답이 있으면 실시간 비율 막대(BalanceRatioBar)를 보여준다 —
 * `/discover`는 둘러보다 답할 방을 고르는 화면이라 결과를 먼저 봐도 된다. list(랜딩)는
 * 반드시 두 선택지만 보여준다 — 결과부터 보이면 답할 이유가 없어진다.
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
      aria-label={`${headline}, ${room.title} 공개방 참여하기`}
      className={cn(
        "group block min-w-0 rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600",
        className
      )}
    >
      <article
        className={cn(
          "surface flex h-full min-w-0 flex-col gap-4 p-5 sm:p-6",
          "transition-[transform,box-shadow] duration-200 ease-out-strong group-active:scale-[0.98]",
          "group-hover:-translate-y-0.5 group-hover:shadow-[0_1px_2px_rgb(28_20_18/0.04),0_12px_32px_-12px_rgb(28_20_18/0.18)]"
        )}
      >
        <p className="line-clamp-2 break-keep text-[17px] font-bold leading-snug tracking-tight text-stone-900 sm:text-lg">
          {headline}
        </p>

        {q && <TypePreview question={q} size={size} />}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1 text-sm text-stone-500">
          <div className="flex min-w-0 items-center gap-x-3">
            {q && <span className="truncate font-medium text-stone-600">{room.title}</span>}
            <span className="flex flex-shrink-0 items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">{room.participantCount}</span>
            </span>
            <span className="flex flex-shrink-0 items-center gap-1 tabular-nums">
              <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
              {formatRemainingShort(room.expiresAt)}
            </span>
          </div>
          <ChevronRight
            className="h-5 w-5 flex-shrink-0 text-stone-400 transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5 group-hover:text-stone-700"
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
      <div className="grid grid-cols-2 gap-2">
        <OptionChip tone="amber">{question.optionA}</OptionChip>
        <OptionChip tone="teal">{question.optionB}</OptionChip>
      </div>
    );
  }

  if (question.type === "multiple" && question.options.length > 0) {
    const shown = question.options.slice(0, 3);
    const extra = question.options.length - shown.length;
    return (
      <div className="flex flex-wrap gap-1.5">
        {shown.map((option) => (
          <span
            key={option}
            className="max-w-full truncate rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-900"
          >
            {option}
          </span>
        ))}
        {extra > 0 && (
          <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-600">
            +{extra}
          </span>
        )}
      </div>
    );
  }

  return null;
}

function OptionChip({ tone, children }: { tone: "amber" | "teal"; children: string }) {
  return (
    <span
      className={cn(
        "fawn-spots flex min-h-14 items-center justify-center break-keep rounded-2xl px-3 py-2 text-center text-[15px] font-semibold leading-snug",
        tone === "amber" ? "bg-amber-100 text-amber-950" : "bg-teal-100 text-teal-950"
      )}
    >
      <span className="line-clamp-2">{children}</span>
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
          "pressable flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[15px] font-semibold text-stone-800 shadow-[inset_0_0_0_2px_#f1e4cf] hover:bg-[#fffaf2] disabled:cursor-wait disabled:opacity-60",
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
          <Menu.Popup className="min-w-44 origin-[var(--transform-origin)] rounded-2xl bg-white p-1.5 shadow-[0_2px_4px_rgb(28_20_18/0.06),0_16px_40px_-12px_rgb(28_20_18/0.25)] outline-none transition-[opacity,transform] duration-150 ease-out-strong data-[starting-style]:scale-[0.96] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.96] data-[ending-style]:opacity-0">
            <Menu.RadioGroup value={value} onValueChange={onChange}>
              {options.map(({ value: optionValue, label, icon: Icon }) => (
                <Menu.RadioItem
                  key={optionValue}
                  value={optionValue}
                  closeOnClick
                  className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl px-3 text-[15px] font-medium text-stone-700 outline-none data-[highlighted]:bg-stone-100 data-[highlighted]:text-stone-900"
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
