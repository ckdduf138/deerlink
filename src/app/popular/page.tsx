import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, ListChecks, PenLine } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { POPULAR_QUESTIONS } from "@/data/popular-questions";

export const metadata: Metadata = {
  title: "밸런스게임 질문 모음 28선 - 단톡방·MT에서 바로 쓰는 인기 질문",
  description:
    "친구들과 단톡방, MT, 회식, 술자리에서 바로 쓸 수 있는 인기 밸런스게임 질문 11개, 객관식 10개, 주관식 7개를 모았어요. 골라서 링크 하나로 공유, 모두 답하면 결과 공개.",
  alternates: {
    canonical: "/popular",
  },
  openGraph: {
    title: "밸런스게임 질문 모음 28선 | Deerlink",
    description:
      "단톡방·MT에서 바로 쓰는 인기 밸런스게임, 객관식, 주관식 질문 모음. 링크 하나로 공유.",
    url: "/popular",
  },
  keywords: [
    "밸런스게임 질문",
    "밸런스게임 질문 모음",
    "인기 밸런스게임",
    "밸런스게임 추천",
    "단톡방 밸런스게임",
    "단톡방 질문",
    "MT 밸런스게임",
    "MT 질문",
    "술자리 게임 질문",
    "친구와 할 수 있는 게임",
    "커플 밸런스게임 질문",
    "웃긴 밸런스게임",
  ],
};

const balance = POPULAR_QUESTIONS.filter((q) => q.type === "balance");
const multiple = POPULAR_QUESTIONS.filter((q) => q.type === "multiple");
const subjective = POPULAR_QUESTIONS.filter((q) => q.type === "subjective");

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "밸런스게임 질문 모음 28선",
  description: "단톡방, MT, 술자리에서 바로 쓰는 인기 질문 모음",
  numberOfItems: POPULAR_QUESTIONS.length,
  itemListElement: POPULAR_QUESTIONS.map((q, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: q.title,
  })),
};

export default function PopularPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-[#fafaf8]/80 backdrop-blur-md border-b border-amber-100/50">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-stone-900 tracking-tight"
        >
          <AntlerLogo className="w-3.5 h-[18px] text-amber-500" />
          Deerlink
        </Link>
        <Link
          href="/create"
          className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          방 만들기 &rarr;
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-16">
          <div className="text-xs text-stone-600 uppercase tracking-widest mb-4">
            인기 질문 모음
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
            단톡방에서 바로 쓰는
            <br />
            <span className="text-stone-500">밸런스게임 질문 28선</span>
          </h1>
          <p className="text-base text-stone-600 leading-relaxed mb-8 max-w-xl">
            친구들과 단톡방·MT·술자리·회식에서 바로 쓸 수 있는 밸런스게임,
            객관식, 주관식 질문을 모았어요. 마음에 드는 질문을 골라 링크 하나로
            공유하면, 모두가 답을 마친 순간 결과가 한꺼번에 공개됩니다.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/30 hover:-translate-y-0.5"
          >
            방 만들기 시작
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </header>

        <Section
          eyebrow={`밸런스게임 ${balance.length}선`}
          title="둘 중 하나만 골라야 한다면?"
          description="가치관, 취향, 인간관계까지, 양자택일로 친구들의 진짜 생각을 확인하는 질문들이에요. 단톡방, MT, 커플 데이트에서 가장 많이 쓰는 유형."
          icon={Scale}
          color="amber"
        >
          <ol className="space-y-4">
            {balance.map((q, i) => (
              <li
                key={q.title}
                className="rounded-2xl border border-amber-100 bg-white p-5"
              >
                <div className="text-xs font-mono text-amber-600 mb-2 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-semibold text-stone-900 leading-snug mb-3">
                  {q.title}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="py-2 px-3 rounded-lg border border-amber-100 bg-amber-50 text-xs font-medium text-amber-700 text-center">
                    {q.optionA}
                  </div>
                  <div className="py-2 px-3 rounded-lg border border-stone-200 bg-stone-50 text-xs font-medium text-stone-600 text-center">
                    {q.optionB}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          eyebrow={`객관식 ${multiple.length}선`}
          title="여러 선택지 중에 가장 가까운 건?"
          description="간단한 객관식 질문으로 그룹 내 성향을 빠르게 비교. 가치관 테스트, 팀 빌딩, 아이스브레이킹에 잘 맞아요."
          icon={ListChecks}
          color="teal"
        >
          <ol className="space-y-4">
            {multiple.map((q, i) => (
              <li
                key={q.title}
                className="rounded-2xl border border-teal-100 bg-white p-5"
              >
                <div className="text-xs font-mono text-teal-600 mb-2 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-semibold text-stone-900 leading-snug mb-3">
                  {q.title}
                </h3>
                <ul className="space-y-1.5">
                  {q.options?.map((opt, oi) => (
                    <li
                      key={oi}
                      className="flex items-center gap-2 text-xs text-stone-600"
                    >
                      <span className="w-1 h-1 rounded-full bg-teal-400 flex-shrink-0" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          eyebrow={`주관식 ${subjective.length}선`}
          title="자유롭게 답하는 질문들"
          description="형식 없는 짧은 답변으로 의외의 진심을 모으는 질문. 모임의 마지막에 던지면 분위기가 깊어져요."
          icon={PenLine}
          color="stone"
        >
          <ol className="space-y-4">
            {subjective.map((q, i) => (
              <li
                key={q.title}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="text-xs font-mono text-stone-600 mb-2 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-semibold text-stone-900 leading-snug">
                  {q.title}
                </h3>
              </li>
            ))}
          </ol>
        </Section>

        <section className="mt-20 rounded-3xl bg-amber-50 border border-amber-100 px-8 py-14 text-center">
          <AntlerLogo className="w-10 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-4">
            마음에 드는 질문 있었나요?
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-8 max-w-md mx-auto">
            지금 방을 만들면 인기 질문 시트에서 위 질문들을 그대로 가져올 수
            있어요. 회원가입 없이 30초면 링크 완성.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/40 hover:-translate-y-0.5"
          >
            지금 방 만들기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
          <p className="text-xs text-stone-600">
            &copy; 2026 Deerlink &middot; 링크 하나로 그룹 의견 비교
          </p>
        </footer>
      </main>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  icon: Icon,
  color,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Scale;
  color: "amber" | "teal" | "stone";
  children: React.ReactNode;
}) {
  const colorMap = {
    amber: "text-amber-500",
    teal: "text-teal-500",
    stone: "text-stone-600",
  };
  return (
    <section className="mt-16">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-600 uppercase tracking-widest mb-3">
          <Icon className={`w-3.5 h-3.5 ${colorMap[color]}`} />
          {eyebrow}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
