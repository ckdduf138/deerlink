import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PopularNav } from "@/components/popular/popular-nav";
import {
  findPopularQuestion,
  POPULAR_QUESTIONS,
  popularQuestionPath,
  type PopularQuestion,
} from "@/data/popular-questions";
import { QUESTION_TOPICS } from "@/data/question-topics";
import { QUESTION_META } from "@/lib/question-meta";
import { getQuestionStats, percentOf, type QuestionStats } from "@/lib/question-stats";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

// 집계는 답이 쌓이면서 바뀌지만 검색 페이지가 실시간일 필요는 없다.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return POPULAR_QUESTIONS.map((question) => ({ id: question.id }));
}

const RELATED_COUNT = 6;

// DB가 죽어도 페이지는 질문만으로 그려져야 한다. 집계가 없으면 그 섹션만 빠진다.
async function loadStats(question: PopularQuestion) {
  return getQuestionStats(question).catch(() => null);
}

function metaTitle(question: PopularQuestion): string {
  if (question.type === "balance") return `${question.title} 밸런스 게임`;
  if (question.type === "multiple") return `${question.title} 투표 질문`;
  return `${question.title} 대화 질문`;
}

function metaDescription(question: PopularQuestion, stats: QuestionStats | null): string {
  if (stats?.type === "balance") {
    const pctA = percentOf(stats.a, stats.total);
    return `${question.optionA} ${pctA}%, ${question.optionB} ${100 - pctA}%. 실제로 ${stats.total}명이 답한 결과예요. 링크 하나로 친구들의 선택과 비교해보세요.`;
  }
  if (stats?.type === "multiple") {
    const top = stats.counts.indexOf(Math.max(...stats.counts));
    return `${stats.total}명 중 가장 많이 고른 답은 "${question.options?.[top]}" (${percentOf(stats.counts[top], stats.total)}%). 친구들은 뭘 고를지 링크 하나로 비교해보세요.`;
  }
  // 집계가 아직 없으면 brief가 이 페이지의 유일한 고유 문장이다. 설명도 여기서 가져온다.
  if (question.brief) {
    // 검색결과에서 잘리지 않게 why 한 문단까지만 쓴다 (tip은 본문에만).
    return `${question.brief.why} 링크 하나로 친구들의 답과 비교해보세요.`;
  }
  if (question.type === "balance") {
    return `${question.optionA}, 아니면 ${question.optionB}? 단톡방에 링크를 보내면 친구들이 각자 고르고, 내 답을 마친 뒤에 서로의 선택이 열려요. 회원가입 없이 무료.`;
  }
  if (question.type === "multiple") {
    return `${question.options?.join(", ")} 중에 친구들은 뭘 고를까요? 링크 하나로 투표하고, 내 답을 마친 뒤에 결과를 비교해요. 회원가입 없이 무료.`;
  }
  return `친구들에게 "${question.title}"라고 물어보세요. 링크를 보내면 각자 답을 적고, 내 답을 마친 뒤에 서로의 답이 열려요. 회원가입 없이 무료.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const question = findPopularQuestion(id);
  if (!question) return {};

  const stats = await loadStats(question);
  const title = metaTitle(question);
  const description = metaDescription(question, stats);
  const path = popularQuestionPath(question.id);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      title: `${title} | Deerlink`,
      description,
      url: path,
    },
  };
}

function topicsOf(question: PopularQuestion) {
  return QUESTION_TOPICS.filter((topic) => topic.questionIds.includes(question.id));
}

/** 같은 주제에 묶인 질문을 먼저, 모자라면 같은 유형으로 채운다. */
function relatedQuestions(question: PopularQuestion): PopularQuestion[] {
  const topicIds = new Set(topicsOf(question).flatMap((topic) => topic.questionIds));
  const others = POPULAR_QUESTIONS.filter((item) => item.id !== question.id);
  const sameTopic = others.filter((item) => topicIds.has(item.id));
  const sameType = others.filter((item) => item.type === question.type && !topicIds.has(item.id));
  return [...sameTopic, ...sameType].slice(0, RELATED_COUNT);
}

function jsonLd(question: PopularQuestion, baseUrl: string) {
  const topic = topicsOf(question)[0];
  const trail = [
    { name: "인기 질문", item: `${baseUrl}/popular` },
    ...(topic ? [{ name: topic.label, item: `${baseUrl}/popular/${topic.slug}` }] : []),
    { name: question.title, item: `${baseUrl}${popularQuestionPath(question.id)}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      ...entry,
    })),
  };
}

function Choices({ question }: { question: PopularQuestion }) {
  if (question.type === "balance") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <p className="flex min-h-20 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-center text-base font-semibold text-amber-900 break-keep">
          {question.optionA}
        </p>
        <p className="flex min-h-20 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 px-4 py-5 text-center text-base font-semibold text-teal-900 break-keep">
          {question.optionB}
        </p>
      </div>
    );
  }

  if (question.type === "multiple") {
    return (
      <ol className="space-y-2">
        {question.options?.map((option) => (
          <li
            key={option}
            className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-800"
          >
            {option}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-base leading-relaxed text-stone-600">
      정해진 보기 없이 각자 짧게 적는 질문이에요. 서로 모르던 답이 나오기 좋아서 모임 끝무렵에
      던지면 이야기가 길어져요.
    </p>
  );
}

/**
 * 막대는 서버에서 그린다. BalanceRatioBar는 폭 0에서 늘어나는 애니메이션이라 서버 HTML에
 * width 0으로 박힌다 — 검색으로 처음 들어온 사람이 JS 전에 빈 막대를 보면 안 된다.
 * 공식은 같다 (percentOf, B는 100에서 뺀 값).
 */
function Stats({ question, stats }: { question: PopularQuestion; stats: QuestionStats }) {
  if (stats.type === "balance") {
    const pctA = percentOf(stats.a, stats.total);
    const pctB = 100 - pctA;
    return (
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4 text-base font-semibold">
          <span className="min-w-0 flex-1 truncate text-amber-800">{question.optionA}</span>
          <span className="min-w-0 flex-1 truncate text-right text-teal-800">
            {question.optionB}
          </span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
          {stats.a > 0 && <div className="h-full bg-amber-500" style={{ width: `${pctA}%` }} />}
          {stats.b > 0 && <div className="h-full bg-teal-500" style={{ width: `${pctB}%` }} />}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-sm tabular-nums text-stone-600">
          <span>
            {stats.a}명, {pctA}%
          </span>
          <span>
            {pctB}%, {stats.b}명
          </span>
        </div>
      </div>
    );
  }

  const max = Math.max(...stats.counts);
  return (
    <ol className="space-y-4">
      {question.options?.map((option, index) => {
        const count = stats.counts[index];
        const pct = percentOf(count, stats.total);
        const top = count === max && count > 0;
        return (
          <li key={option}>
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <span
                className={cn(
                  "min-w-0 flex-1 text-base",
                  top ? "font-semibold text-stone-900" : "text-stone-700"
                )}
              >
                {option}
              </span>
              <span className="font-mono text-sm tabular-nums text-stone-600">
                {count}명, {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
              {count > 0 && (
                <div
                  className={cn("h-full", top ? "bg-amber-500" : "bg-stone-300")}
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default async function PopularQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = findPopularQuestion(id);
  if (!question) notFound();

  const stats = await loadStats(question);
  const meta = QUESTION_META[question.type];
  const topics = topicsOf(question);
  const related = relatedQuestions(question);
  const backTopic = topics[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";
  const startHref = `/create?question=${encodeURIComponent(question.id)}`;

  return (
    <div className="min-h-screen bg-page text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(question, baseUrl)) }}
      />

      <PopularNav />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32">
        <Link
          href={backTopic ? `/popular/${backTopic.slug}` : "/popular"}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backTopic ? `${backTopic.label} 질문 모음` : "인기 질문 전체"}
        </Link>

        <header className="mt-4">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${meta.badge}`}
          >
            {meta.longLabel}
          </span>
          <h1 className="mt-4 break-keep text-3xl font-cute leading-[1.2] text-stone-900 md:text-4xl">
            {question.title}
          </h1>
        </header>

        <div className="mt-8">
          <Choices question={question} />
        </div>

        {question.brief && (
          <section aria-labelledby="brief-heading" className="mt-10 rounded-2xl bg-white p-6 shadow-[0_2px_0_rgb(191_122_34/0.07),0_10px_28px_-14px_rgb(150_95_30/0.22)]">
            <h2 id="brief-heading" className="text-lg font-cute text-stone-900">
              왜 의견이 갈릴까요?
            </h2>
            <p className="mt-2 break-keep text-base leading-relaxed text-stone-700">{question.brief.why}</p>
            <p className="mt-4 break-keep text-base leading-relaxed text-stone-600">{question.brief.tip}</p>
          </section>
        )}

        {stats && (
          <section
            aria-labelledby="stats-heading"
            className="mt-12 rounded-2xl border border-stone-200 bg-white p-6"
          >
            <h2 id="stats-heading" className="text-xl font-cute text-stone-900">
              실제로 {stats.total}명이 답했어요
            </h2>
            <p className="mt-1.5 mb-6 text-sm leading-relaxed text-stone-600">
              Deerlink 공개방에서 모인 익명 집계예요. 한 사람당 한 번만 셌어요.
            </p>
            <Stats question={question} stats={stats} />
          </section>
        )}

        <section className="mt-12 rounded-3xl border border-amber-100 bg-amber-50 px-6 py-10 text-center md:px-10">
          <h2 className="break-keep text-2xl font-cute text-stone-900">
            {stats ? "우리 친구들은 다르게 고를까요?" : "친구들은 뭐라고 답할까요?"}
          </h2>
          <p className="mx-auto mt-3 mb-7 max-w-md text-sm leading-relaxed text-stone-600">
            이 질문으로 방을 만들어 링크를 보내면 각자 답하고, 내 답을 마친 뒤에 서로의 선택이
            열려요. 먼저 본 답에 맞춰 고를 수 없어요.
          </p>
          <Link
            href={startHref}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-amber-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-800"
          >
            이 질문으로 방 만들기
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </section>

        {topics.length > 0 && (
          <section className="mt-14" aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="text-lg font-cute text-stone-900">
              이 질문이 잘 맞는 자리
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/popular/${topic.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-amber-100 bg-amber-50 px-4 text-sm text-amber-900 transition-colors hover:border-amber-300"
                  >
                    {topic.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-cute text-stone-900">
            같이 물어보기 좋은 질문
          </h2>
          <ul className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={popularQuestionPath(item.id)}
                  className="group flex min-h-14 items-center justify-between gap-4 py-3 text-base text-stone-800 transition-colors hover:text-stone-950"
                >
                  <span className="break-keep">{item.title}</span>
                  <ArrowRight
                    className="h-4 w-4 flex-shrink-0 text-amber-700 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-16 border-t border-stone-200 pt-8 text-center">
          <p className="text-xs text-stone-600">&copy; 2026 Deerlink</p>
        </footer>
      </main>
    </div>
  );
}
