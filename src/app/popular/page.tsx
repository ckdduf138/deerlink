import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Fawn } from "@/components/Fawn";
import { PopularNav } from "@/components/popular/popular-nav";
import { PopularQuestionList } from "@/components/popular/question-list";
import { POPULAR_QUESTIONS } from "@/data/popular-questions";
import { QUESTION_TOPICS, topicQuestions, type QuestionTopic } from "@/data/question-topics";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

/**
 * 한 페이지 20개. 목록은 쿼리스트링 링크라 JS 없이도, 크롤러에게도 그대로 열린다.
 *
 * 2026-11에 상단 탭을 유형(밸런스/객관식/주관식)에서 카테고리로 바꿨다. 사용자가 찾는
 * 단위는 "밸런스게임이냐 객관식이냐"가 아니라 "커플이냐 음식이냐"였다. 유형은 각 행의
 * 뱃지로 남는다.
 */
const PAGE_SIZE = 20;

/**
 * 카테고리 필터는 /popular/[slug] 와 같은 목록을 보여준다. 그래서 canonical 을 항상
 * 그 전용 페이지로 보낸다 - 두 URL이 같은 내용으로 색인되면 서로를 갉아먹는데,
 * 전용 페이지에만 고유한 소개 문장과 제목이 있으니 그쪽이 남아야 한다.
 * 필터는 지금 보고 있는 사람을 위한 것이고, 검색에 올라가는 건 전용 페이지다.
 */
function canonicalFor(topic: QuestionTopic | null, page: number): string {
  if (topic) return `/popular/${topic.slug}`;
  return page > 1 ? `/popular?page=${page}` : "/popular";
}

type SearchParams = Promise<{ category?: string | string[]; page?: string | string[] }>;

function resolve(raw: Awaited<SearchParams>) {
  const slug = typeof raw.category === "string" ? raw.category : "";
  const topic = QUESTION_TOPICS.find((item) => item.slug === slug) ?? null;
  const questions = topic ? topicQuestions(topic) : POPULAR_QUESTIONS;
  const pageCount = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const pageParam = Number(typeof raw.page === "string" ? raw.page : 1);
  const page = Number.isInteger(pageParam) ? Math.min(Math.max(pageParam, 1), pageCount) : 1;
  return { topic, questions, page, pageCount };
}

function hrefFor(topic: QuestionTopic | null, page: number): string {
  const params = new URLSearchParams();
  if (topic) params.set("category", topic.slug);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/popular?${query}` : "/popular";
}

function rangeLabel(topic: QuestionTopic | null, total: number, page: number): string {
  const name = topic ? topic.label : "전체";
  if (page === 1) return `${name} TOP ${Math.min(PAGE_SIZE, total)}`;
  const from = (page - 1) * PAGE_SIZE + 1;
  return `${name} ${from}~${Math.min(page * PAGE_SIZE, total)}위`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { topic, questions, page } = resolve(await searchParams);
  const title = topic
    ? `${topic.label} 질문 모음 ${questions.length}선`
    : page === 1
      ? `밸런스 게임 질문 모음 ${questions.length}선`
      : `밸런스 게임 질문 모음 ${(page - 1) * PAGE_SIZE + 1}위부터`;
  const description = topic
    ? topic.metaDescription
    : "밸런스 게임, 투표, 대화 질문을 카테고리별로 모았어요. 질문을 고르면 방이 만들어지고, 링크를 보내면 각자 답한 뒤 선택을 비교할 수 있어요.";
  const url = canonicalFor(topic, page);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...SITE_OPEN_GRAPH, title: `${title} | 디어링크`, description, url },
  };
}

export default async function PopularPage({ searchParams }: { searchParams: SearchParams }) {
  const { topic, questions, page, pageCount } = resolve(await searchParams);
  const offset = (page - 1) * PAGE_SIZE;
  const visible = questions.slice(offset, offset + PAGE_SIZE);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: rangeLabel(topic, questions.length, page),
    numberOfItems: visible.length,
    itemListElement: visible.map((q, i) => ({
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
        <h1 className="mb-6 break-keep font-cute text-4xl leading-[1.1] text-stone-900 md:text-5xl">
          밸런스 게임 질문 모음
        </h1>

        {/* 가로 스크롤 한 줄. 카테고리가 20개를 넘어가도 접히지 않고, 지금 고른 칩이 항상 보인다. */}
        <nav aria-label="카테고리" className="-mx-4 mb-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          <ul className="flex w-max gap-2">
            {[null, ...QUESTION_TOPICS].map((item) => {
              const active = item?.slug === topic?.slug;
              return (
                <li key={item?.slug ?? "all"}>
                  <Link
                    href={hrefFor(item, 1)}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "pressable flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-semibold",
                      active
                        ? "bg-brand text-brand-ink shadow-[0_2px_0_var(--color-brand-edge)]"
                        : "bg-white text-stone-600 hover:text-stone-900"
                    )}
                  >
                    {item?.label ?? "전체"}
                    <span className={cn("tabular-nums", active ? "text-brand-ink/70" : "text-stone-500")}>
                      {item ? item.questionIds.length : POPULAR_QUESTIONS.length}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
          <h2 className="font-cute text-2xl text-stone-900">
            {rangeLabel(topic, questions.length, page)}
          </h2>
          {pageCount > 1 && (
            <p className="text-sm tabular-nums text-stone-500">
              {page} / {pageCount} 페이지
            </p>
          )}
        </div>

        {/* 필터 중에는 전용 페이지로 가는 길을 둔다. 소개 문장과 "이 주제로 방 만들기"가 거기 있다. */}
        {topic && (
          <Link
            href={`/popular/${topic.slug}`}
            className="group mb-3 flex items-center gap-1.5 px-1 text-sm font-semibold text-amber-800"
          >
            {topic.label} 전체 페이지 보기
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}

        <PopularQuestionList
          questions={visible}
          showType
          startRank={offset + 1}
          highlightTop={topic ? 0 : 3}
        />

        {pageCount > 1 && <Pagination topic={topic} page={page} pageCount={pageCount} />}

        {/*
          위 칩은 ?category= 필터라 canonical 이 전용 페이지로 넘어간다. 그 링크만 있으면
          크롤러가 /popular/[slug] 로 가는 직통 경로가 없어지므로, 필터를 안 건 상태에서는
          전용 페이지로 바로 가는 목록을 둔다. 필터 중에는 위에 "전체 페이지 보기"가
          이미 있으니 그리지 않는다 (같은 이름 목록이 한 화면에 두 번 나오면 헷갈린다).
        */}
        {!topic && (
          <nav aria-label="카테고리별 전체 페이지" className="mt-14">
            <h2 className="font-cute text-2xl text-stone-900">카테고리별로 모아 보기</h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {QUESTION_TOPICS.map((item) => (
                <Link key={item.slug} href={`/popular/${item.slug}`} className="btn-secondary">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}

        <section className="surface mt-16 flex flex-col items-center px-6 py-12 text-center">
          <Fawn mood="happy" className="h-20 w-20" />
          <h2 className="mt-4 font-cute text-2xl text-stone-900 md:text-3xl">
            내 질문으로 직접 만들어도 돼요
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
            여기 질문을 섞어도 되고, 우리끼리만 아는 질문을 써도 돼요. 회원가입 없이 바로
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
  topic,
  page,
  pageCount,
}: {
  topic: QuestionTopic | null;
  page: number;
  pageCount: number;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const edge =
    "pressable flex min-h-11 min-w-11 items-center justify-center rounded-full text-sm font-semibold";

  return (
    <nav aria-label="페이지" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(topic, page - 1)} aria-label="이전 페이지" className={cn(edge, "text-stone-700 hover:bg-white")}>
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
          href={hrefFor(topic, n)}
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
        <Link href={hrefFor(topic, page + 1)} aria-label="다음 페이지" className={cn(edge, "text-stone-700 hover:bg-white")}>
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
