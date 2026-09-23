import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fawn } from "@/components/Fawn";
import { PopularNav } from "@/components/popular/popular-nav";
import { PopularQuestionList } from "@/components/popular/question-list";
import { POPULAR_QUESTIONS, type PopularQuestion } from "@/data/popular-questions";
import { QUESTION_META, QUESTION_TYPES } from "@/lib/question-meta";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";
import type { QuestionType } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * 한 페이지 20개. 첫 페이지가 곧 그 유형의 TOP 20이다 (popular-questions.ts의 배열 순서가 순위).
 * 필터·페이지는 전부 쿼리스트링 링크라 JS 없이도, 크롤러에게도 그대로 열린다.
 */
const PAGE_SIZE = 20;
const DEFAULT_TYPE: QuestionType = "balance";

const byType = Object.fromEntries(
  QUESTION_TYPES.map((type) => [type, POPULAR_QUESTIONS.filter((q) => q.type === type)])
) as Record<QuestionType, PopularQuestion[]>;

const TAB_LABEL: Record<QuestionType, string> = {
  balance: "밸런스 게임",
  multiple: "객관식",
  subjective: "주관식",
};

type SearchParams = Promise<{ type?: string | string[]; page?: string | string[] }>;

function resolve(raw: Awaited<SearchParams>) {
  const typeParam = typeof raw.type === "string" ? raw.type : "";
  const type = (QUESTION_TYPES as string[]).includes(typeParam)
    ? (typeParam as QuestionType)
    : DEFAULT_TYPE;
  const pageCount = Math.max(1, Math.ceil(byType[type].length / PAGE_SIZE));
  const pageParam = Number(typeof raw.page === "string" ? raw.page : 1);
  const page = Number.isInteger(pageParam) ? Math.min(Math.max(pageParam, 1), pageCount) : 1;
  return { type, page, pageCount };
}

function hrefFor(type: QuestionType, page: number): string {
  const params = new URLSearchParams();
  if (type !== DEFAULT_TYPE) params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/popular?${query}` : "/popular";
}

function rangeLabel(type: QuestionType, page: number): string {
  if (page === 1) return `${TAB_LABEL[type]} TOP ${Math.min(PAGE_SIZE, byType[type].length)}`;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, byType[type].length);
  return `${TAB_LABEL[type]} ${from}~${to}위`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { type, page } = resolve(await searchParams);
  const base = type === "balance" ? "밸런스 게임 질문" : `${TAB_LABEL[type]} 질문`;
  const title =
    page === 1
      ? `인기 ${base} TOP 20 - 단톡방과 MT에서 바로 쓰는 질문 모음`
      : `인기 ${base} ${rangeLabel(type, page).replace(`${TAB_LABEL[type]} `, "")}`;
  const description = `단톡방, MT, 회식, 술자리에서 가장 많이 쓰는 ${base}를 순위로 모았어요. 깻잎 논쟁, 부먹 찍먹부터 친구 사이 진심 질문까지. 골라서 링크 하나로 공유하면 친구들의 선택이 열려요.`;
  const url = hrefFor(type, page);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...SITE_OPEN_GRAPH, title: `${title} | Deerlink`, description, url },
    keywords: [
      "밸런스게임 질문",
      "밸런스게임 질문 모음",
      "인기 밸런스게임",
      "밸런스게임 추천",
      "밸런스게임 순위",
      "단톡방 밸런스게임",
      "MT 밸런스게임",
      "술자리 게임 질문",
      "커플 밸런스게임 질문",
      "아이스브레이킹 질문",
    ],
  };
}

export default async function PopularPage({ searchParams }: { searchParams: SearchParams }) {
  const { type, page, pageCount } = resolve(await searchParams);
  const offset = (page - 1) * PAGE_SIZE;
  const questions = byType[type].slice(offset, offset + PAGE_SIZE);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: rangeLabel(type, page),
    numberOfItems: questions.length,
    itemListElement: questions.map((q, i) => ({
      "@type": "ListItem",
      position: offset + i + 1,
      name: q.title,
    })),
  };

  return (
    <div className="min-h-screen bg-page text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <PopularNav />

      <main className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:px-6">
        <header className="mb-8">
          <h1 className="break-keep font-cute text-4xl leading-[1.1] text-stone-900 md:text-5xl">
            요즘 제일 많이 하는 질문
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-stone-600">
            단톡방, MT, 술자리에서 가장 자주 도는 질문을 순위로 모았어요. 마음에 드는 걸
            골라 방을 만들면 링크 하나로 친구들의 선택을 모을 수 있어요.
          </p>
        </header>

        <nav aria-label="질문 유형" className="mb-6">
          <ul className="flex gap-1 rounded-full bg-white p-1 shadow-[0_2px_0_rgb(191_122_34/0.07)]">
            {QUESTION_TYPES.map((tab) => {
              const active = tab === type;
              const Icon = QUESTION_META[tab].icon;
              return (
                <li key={tab} className="flex-1">
                  <Link
                    href={hrefFor(tab, 1)}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "pressable flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold",
                      active
                        ? "bg-brand text-brand-ink shadow-[0_2px_0_var(--color-brand-edge)]"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    )}
                  >
                    <Icon className="hidden h-4 w-4 sm:block" aria-hidden="true" />
                    {TAB_LABEL[tab]}
                    <span className={cn("tabular-nums", active ? "text-brand-ink/70" : "text-stone-500")}>
                      {byType[tab].length}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
          <h2 className="font-cute text-2xl text-stone-900">{rangeLabel(type, page)}</h2>
          <p className="text-sm tabular-nums text-stone-500">
            {page} / {pageCount} 페이지
          </p>
        </div>

        <PopularQuestionList
          questions={questions}
          startRank={offset + 1}
          highlightTop={3}
        />

        {pageCount > 1 && <Pagination type={type} page={page} pageCount={pageCount} />}

        <section className="surface mt-16 flex flex-col items-center px-6 py-12 text-center">
          <Fawn mood="happy" className="h-20 w-20" />
          <h2 className="mt-4 font-cute text-2xl text-stone-900 md:text-3xl">
            내 질문으로 직접 만들어도 돼요
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
            여기 질문을 섞어도 되고, 우리끼리만 아는 질문을 써도 돼요. 회원가입 없이 30초면
            링크가 나와요.
          </p>
          <Link href="/create" className="btn-primary mt-7">
            방 만들기
          </Link>
        </section>
      </main>
    </div>
  );
}

function Pagination({
  type,
  page,
  pageCount,
}: {
  type: QuestionType;
  page: number;
  pageCount: number;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const edge =
    "pressable flex min-h-11 min-w-11 items-center justify-center rounded-full text-sm font-semibold";

  return (
    <nav aria-label="페이지" className="mt-6 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(type, page - 1)} aria-label="이전 페이지" className={cn(edge, "text-stone-700 hover:bg-white")}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(edge, "text-stone-300")} aria-hidden="true">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {pages.map((n) => (
        <Link
          key={n}
          href={hrefFor(type, n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={`${n}페이지`}
          className={cn(
            edge,
            "tabular-nums",
            n === page ? "bg-brand text-brand-ink" : "text-stone-600 hover:bg-white hover:text-stone-900"
          )}
        >
          {n}
        </Link>
      ))}

      {page < pageCount ? (
        <Link href={hrefFor(type, page + 1)} aria-label="다음 페이지" className={cn(edge, "text-stone-700 hover:bg-white")}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(edge, "text-stone-300")} aria-hidden="true">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </nav>
  );
}
